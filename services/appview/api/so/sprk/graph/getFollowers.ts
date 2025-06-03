import { Hono } from "hono";

import { optionalAuthMiddleware } from "../../../../services/auth/middleware.ts";
import { AppContext } from "../../../../main.ts";
import type * as SoSprkActorDefs from "../../../../lexicon/types/so/sprk/actor/defs.ts";

export const createGetFollowersRouter = (ctx: AppContext) => {
  const router = new Hono();

  router.get(
    "/xrpc/so.sprk.graph.getFollowers",
    optionalAuthMiddleware,
    async (c) => {
      const actor = c.req.query("actor");
      const limit = parseInt(c.req.query("limit") ?? "50");
      const cursor = c.req.query("cursor");

      if (!actor) {
        return c.json({ error: "Actor is required" }, 400);
      }

      // Validate limit
      if (limit < 1 || limit > 100) {
        return c.json({ error: "Limit must be between 1 and 100" }, 400);
      }

      // Build query
      const query: { subject: string; _id?: { $gt: string } } = { subject: actor };
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
        followers.map(async (follow) => {
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
            return {
              ...basicProfileView,
              displayName: profile.displayName,
              description: profile.description,
              avatar: profile.avatar?.ref?.$link,
              indexedAt: profile.indexedAt,
              createdAt: profile.createdAt,
            };
          }

          return basicProfileView;
        }),
      );

      // Get next cursor
      const nextCursor = followers.length === limit
        ? followers[followers.length - 1]._id
        : undefined;
      console.log("nextCursor", nextCursor);

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
        Object.assign(subjectProfileView, {
          handle: subjectProfile.authorHandle,
          displayName: subjectProfile.displayName,
          description: subjectProfile.description,
          avatar: subjectProfile.avatar?.ref?.$link,
          indexedAt: subjectProfile.indexedAt,
          createdAt: subjectProfile.createdAt,
        });
      }

      return c.json({
        subject: subjectProfileView,
        followers: profileViews,
        cursor: nextCursor,
      });
    },
  );

  return router;
};
