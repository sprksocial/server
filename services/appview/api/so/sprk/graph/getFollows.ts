import { Server } from "../../../../lexicon/index.ts";
import { FollowDocument } from "../../../../data-plane/server/index.ts";
import { PipelineStage } from "mongoose";
import { AppContext } from "../../../../main.ts";
import type * as SoSprkActorDefs from "../../../../lexicon/types/so/sprk/actor/defs.ts";

export default function (server: Server, ctx: AppContext) {
  server.so.sprk.graph.getFollows({
    auth: ctx.authVerifier.standardOptional,
    handler: async ({ params, auth }) => {
      const { actor } = params;
      const limit = params.limit ?? 50;
      const cursor = params.cursor;
      const userDid = auth.credentials.type === "standard"
        ? auth.credentials.iss
        : undefined;

      if (!actor) {
        throw new Error("Actor is required");
      }

      // Validate limit
      if (limit < 1 || limit > 100) {
        throw new Error("Limit must be between 1 and 100");
      }

      let follows = [];

      // If user is authenticated, respect their follow preferences
      if (userDid) {
        const viewerPref = await ctx.db.models.UserPreference.findOne({
          userDid,
        });
        const followType = viewerPref?.followMode || "sprk";

        // Build query with the user's preferred follow type
        const query: {
          authorDid: string;
          type: string;
          _id?: { $gt: string };
        } = {
          authorDid: actor,
          type: followType,
        };

        if (cursor) {
          query._id = { $gt: cursor };
        }

        follows = await ctx.db.models.Follow.find(query)
          .sort({ _id: 1 })
          .limit(limit)
          .lean();
      } else {
        // For unauthenticated users, get all follow types without duplicates
        // We use aggregation to get distinct follows by subject
        const pipelineStages: PipelineStage[] = [
          { $match: { authorDid: actor } },
        ];

        if (cursor) {
          pipelineStages.push({ $match: { _id: { $gt: cursor } } });
        }

        // Group by subject to avoid duplicates
        pipelineStages.push(
          { $sort: { _id: 1 } },
          {
            $group: {
              _id: "$subject",
              doc: { $first: "$$ROOT" },
            },
          },
          { $replaceRoot: { newRoot: "$doc" } },
          { $sort: { _id: 1 } },
          { $limit: limit },
        );

        follows = await ctx.db.models.Follow.aggregate(pipelineStages);
      }

      // Get next cursor
      const nextCursor = follows.length === limit
        ? follows[follows.length - 1]._id.toString()
        : undefined;

      // Get profile views for each follow
      const profileViews = await Promise.all(
        follows.map(async (follow: FollowDocument) => {
          const profile = await ctx.db.models.Profile.findOne({
            authorDid: follow.subject,
          });

          // Get handle through DID resolution
          let handle = null;
          try {
            const didData = await ctx.resolver.resolveDidToDidDoc(
              follow.subject,
            );
            handle = didData.handle;
          } catch (error) {
            ctx.logger.warn(
              { did: follow.subject, error: (error as Error).message },
              "Failed to resolve DID to handle",
            );
          }

          // Basic profile view with just DID and handle
          const basicProfileView: SoSprkActorDefs.ProfileView = {
            $type: "so.sprk.actor.defs#profileView",
            did: follow.subject,
            handle: handle ?? "unknown.bsky.social",
            viewer: {
              $type: "so.sprk.actor.defs#viewerState",
              followedBy: follow.uri,
            },
          };

          // If we found a profile, add the additional fields
          if (profile) {
            const avatarUrl = profile.avatar?.ref?.$link
              ? `https://media.sprk.so/avatar/tiny/${profile.authorDid}/${profile.avatar.ref.$link}/webp`
              : undefined;

            return {
              ...basicProfileView,
              displayName: profile.displayName,
              description: profile.description,
              avatar: avatarUrl,
              indexedAt: profile.indexedAt,
              createdAt: profile.createdAt,
            };
          }

          return basicProfileView;
        }),
      );

      // Get subject profile if it exists
      const subjectProfile = await ctx.db.models.Profile.findOne({
        authorDid: actor,
      });
      const subjectProfileView: SoSprkActorDefs.ProfileView = {
        $type: "so.sprk.actor.defs#profileView",
        did: actor,
        handle: "unknown",
      };
      // If we found the subject profile, add the additional fields
      if (subjectProfile) {
        const avatarUrl = subjectProfile.avatar?.ref?.$link
          ? `https://media.sprk.so/avatar/tiny/${subjectProfile.authorDid}/${subjectProfile.avatar.ref.$link}/webp`
          : undefined;

        Object.assign(subjectProfileView, {
          handle: subjectProfile.authorHandle,
          displayName: subjectProfile.displayName,
          description: subjectProfile.description,
          avatar: avatarUrl,
          indexedAt: subjectProfile.indexedAt,
          createdAt: subjectProfile.createdAt,
        });
      } else {
        let handle = null;
        try {
          if (actor) {
            const didData = await ctx.resolver.resolveDidToDidDoc(actor);
            handle = didData.handle;
          }
        } catch (error) {
          ctx.logger.warn(
            { did: actor, error: (error as Error).message },
            "Failed to resolve DID to handle",
          );
        }
        Object.assign(subjectProfileView, {
          handle: handle ?? "unknown",
        });
      }

      return {
        encoding: "application/json",
        body: {
          subject: subjectProfileView,
          follows: profileViews,
          cursor: nextCursor,
        },
      };
    },
  });
}
