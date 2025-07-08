import { Server } from "../../../../lexicon/index.ts";
import { FollowDocument } from "../../../../data-plane/server/index.ts";
import { AppContext } from "../../../../main.ts";
import type * as SoSprkActorDefs from "../../../../lexicon/types/so/sprk/actor/defs.ts";
import { ensureValidDid, isValidHandle } from "@atproto/syntax";
import { RootFilterQuery } from "mongoose";
import { XRPCError } from "@sprk/xrpc-server";
import { OutputSchema } from "../../../../lexicon/types/so/sprk/graph/getFollows.ts";

export default function (server: Server, ctx: AppContext) {
  server.so.sprk.graph.getFollows({
    auth: ctx.authVerifier.standardOptional,
    handler: async ({ params, auth }) => {
      const { actor } = params;
      const limit = params.limit;
      const cursor = params.cursor;
      const viewerDid = auth.credentials.type === "standard"
        ? auth.credentials.iss
        : undefined;

      let actorDid;

      if (isValidHandle(actor)) {
        const actorDidDoc = await ctx.resolver.resolveHandleToDidDoc(actor);
        actorDid = actorDidDoc.did;
      } else {
        try {
          ensureValidDid(actor);
          actorDid = actor;
        } catch (error) {
          ctx.logger.warn(
            { did: actor, error: (error as Error).message },
            "Failed to ensure valid DID",
          );
          throw new XRPCError(400, "Invalid actor DID");
        }
      }

      const actorPref = await ctx.db.models.UserPreference.findOne({
        userDid: actorDid,
      });
      const actorFollowMode = actorPref?.followMode || "sprk";

      // Build query
      const query: RootFilterQuery<FollowDocument> = {
        authorDid: actorDid,
        type: actorFollowMode,
      };

      if (cursor) {
        query._id = { $gt: cursor };
      }

      // Get follows with pagination
      const follows = await ctx.db.models.Follow.find(query)
        .sort({ _id: 1 })
        .limit(limit)
        .lean();

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

          const viewerFollow = await ctx.db.models.Follow.findOne({
            subject: follow.subject,
            authorDid: viewerDid,
          });

          // Basic profile view with just DID and handle
          const basicProfileView: SoSprkActorDefs.ProfileView = {
            $type: "so.sprk.actor.defs#profileView",
            did: follow.subject,
            handle: profile?.authorHandle ?? "unknown.invalid",
            viewer: {
              $type: "so.sprk.actor.defs#viewerState",
              followedBy: viewerFollow ? viewerFollow.uri : undefined,
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
        authorDid: actorDid,
      });

      // Basic subject profile view with just DID and handle
      let handle = null;
      try {
        if (actorDid) {
          const didData = await ctx.resolver.resolveDidToDidDoc(actorDid);
          handle = didData.handle;
        }
      } catch (error) {
        ctx.logger.warn(
          { did: actorDid, error: (error as Error).message },
          "Failed to resolve DID to handle",
        );
      }

      const subjectProfileView: SoSprkActorDefs.ProfileView = {
        $type: "so.sprk.actor.defs#profileView",
        did: actorDid,
        handle: handle ?? "unknown.invalid",
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

      const res = {
        encoding: "application/json",
        body: {
          subject: subjectProfileView,
          follows: profileViews,
          cursor: nextCursor,
        } satisfies OutputSchema,
      } as const;

      return res;
    },
  });
}
