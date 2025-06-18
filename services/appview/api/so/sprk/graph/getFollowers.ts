import { Server } from "../../../../lexicon/index.ts";
import { AppContext } from "../../../../main.ts";
import type * as SoSprkActorDefs from "../../../../lexicon/types/so/sprk/actor/defs.ts";
import { FollowDocument } from "../../../../data-plane/server/index.ts";

export default function (server: Server, ctx: AppContext) {
  server.so.sprk.graph.getFollowers({
    auth: ctx.authVerifier.standardOptional,
    handler: async ({ params }) => {
      const { actor } = params;
      const limit = params.limit ?? 50;
      const cursor = params.cursor;

      if (!actor) {
        throw new Error("Actor is required");
      }

      // Validate limit
      if (limit < 1 || limit > 100) {
        throw new Error("Limit must be between 1 and 100");
      }

      // Build query
      const query: { subject: string; _id?: { $gt: string } } = {
        subject: actor,
      };
      if (cursor) {
        query._id = { $gt: cursor };
      }

      // Get followers with pagination
      const followers = await ctx.db.models.Follow.find(query)
        .sort({ _id: 1 })
        .limit(limit)
        .lean();

      // Get profile views for each follower
      const profileViews = await Promise.all(
        followers.map(async (follow: FollowDocument) => {
          const profile = await ctx.db.models.Profile.findOne({
            authorDid: follow.authorDid,
          });

          // Basic profile view with just DID and handle
          const basicProfileView: SoSprkActorDefs.ProfileView = {
            $type: "so.sprk.actor.defs#profileView",
            did: follow.authorDid,
            handle: follow.authorHandle,
            viewer: {
              $type: "so.sprk.actor.defs#viewerState",
              following: follow.uri,
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

      // Get next cursor
      const nextCursor = followers.length === limit
        ? followers[followers.length - 1]._id.toString()
        : undefined;

      // Get subject profile if it exists
      const subjectProfile = await ctx.db.models.Profile.findOne({
        authorDid: actor,
      });

      // Basic subject profile view with just DID and handle
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
      const subjectProfileView: SoSprkActorDefs.ProfileView = {
        $type: "so.sprk.actor.defs#profileView",
        did: actor,
        handle: handle ?? "unknown",
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
      }

      return {
        encoding: "application/json",
        body: {
          subject: subjectProfileView,
          followers: profileViews,
          cursor: nextCursor,
        },
      };
    },
  });
}
