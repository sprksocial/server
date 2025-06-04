import { ensureValidDid, isValidHandle } from "@atproto/syntax";
import { Hono } from "hono";

import type { Label } from "../../../../lexicon/types/com/atproto/label/defs.ts";
import type * as ComAtprotoRepoStrongRef from "../../../../lexicon/types/com/atproto/repo/strongRef.ts";
import type * as SoSprkActorDefs from "../../../../lexicon/types/so/sprk/actor/defs.ts";
import { AppContext, AppEnv } from "../../../../main.ts";
import { optionalAuthMiddleware } from "../../../../services/auth/middleware.ts";

export const createGetProfileRouter = (ctx: AppContext) => {
  const router = new Hono<AppEnv>();

  router.get(
    "/xrpc/so.sprk.actor.getProfile",
    optionalAuthMiddleware,
    async (c) => {
      const actorParam = c.req.query("actor");
      const viewerDid = c.get("did") as string | undefined;

      if (!actorParam) {
        return c.json({ error: "Actor not provided" }, 400);
      }

      let actorDidDoc;
      if (isValidHandle(actorParam)) {
        actorDidDoc = await ctx.resolver.resolveHandleToDidDoc(actorParam);
      } else {
        try {
          ensureValidDid(actorParam);
          actorDidDoc = await ctx.resolver.resolveDidToDidDoc(actorParam);
        } catch (_err) {
          return c.json({ error: "Invalid actor" }, 400);
        }
      }

      const actorDid = actorDidDoc.did;

      const now = new Date().toISOString();

      await ctx.indexingService.indexHandle(actorDid, now);

      // First check if actor exists and has profile
      let actorDoc = await ctx.db.models.Actor.findOne({
        did: actorDid,
      });

      const profile = await ctx.db.models.Profile.findOne({
        authorDid: actorDid,
      });

      if (!actorDoc) {
        try {
          ctx.logger.info(
            { did: actorDid },
            "No profile found, attempting to index",
          );
          await ctx.indexingService.indexHandle(actorDid, now, true);

          // Refetch after indexing
          actorDoc = await ctx.db.models.Actor.findOne({
            did: actorDid,
          });
        } catch (error) {
          ctx.logger.error({ error, did: actorDid }, "Failed to index handle");
        }
      }

      if (!actorDoc) {
        return c.json({ error: "Actor not found" }, 404);
      }

      if (!profile) {
        return c.json({ error: "Profile not found" }, 404);
      }

      // Use actor's handle if available, otherwise resolve from DID
      const handle = actorDoc.handle ||
        (await ctx.resolver.resolveDidToHandle(actorDid));

      // Get actor's preference for follow mode (used for both viewer state and counting)
      const actorPref = await ctx.db.models.UserPreference.findOne({
        userDid: actorDid,
      });
      const actorFollowMode = actorPref?.followMode || "sprk";

      // Build viewer state if a user is authenticated
      const viewer: SoSprkActorDefs.ViewerState = {};

      if (viewerDid) {
        // Determine follow mode from viewer's preference for checking if viewer follows profile
        const viewerPref = await ctx.db.models.UserPreference.findOne({
          userDid: viewerDid,
        });
        const viewerFollowMode = viewerPref?.followMode || "sprk";

        // Check if viewer follows this profile (use viewer's follow mode)
        const follow = await ctx.db.models.Follow.findOne({
          subject: actorDid,
          authorDid: viewerDid,
          type: viewerFollowMode,
        });
        if (follow) viewer.following = follow.uri;

        // Check if this profile follows the viewer (use profile owner's follow mode)
        const followedBy = await ctx.db.models.Follow.findOne({
          subject: viewerDid,
          authorDid: actorDid,
          type: actorFollowMode,
        });
        if (followedBy) viewer.followedBy = followedBy.uri;

        // Check block relationships
        const block = await ctx.db.models.Block.findOne({
          subject: actorDid,
          authorDid: viewerDid,
        });
        if (block) viewer.blocking = block.uri;

        const blockedBy = await ctx.db.models.Block.findOne({
          subject: viewerDid,
          authorDid: actorDid,
        });
        if (blockedBy) viewer.blockedBy = true;
      }

      // Check for associated services
      const associated: SoSprkActorDefs.ProfileAssociated = {};

      // Check for feed generators
      let feedgensCount = 0;
      try {
        if (ctx.db.models.Generator) {
          feedgensCount = await ctx.db.models.Generator.countDocuments({
            authorDid: actorDid,
          });
        }
      } catch (_error) {
        // Ignore if model doesn't exist
      }

      if (feedgensCount > 0) {
        associated.feedgens = feedgensCount;
      }

      // Get avatar and banner URLs
      const avatar = profile.avatar
        ? `https://media.sprk.so/avatar/tiny/${actorDid}/${profile.avatar.ref.$link}/webp`
        : undefined;
      const banner = profile.banner
        ? `https://media.sprk.so/img/tiny/${actorDid}/${profile.banner.ref.$link}/webp`
        : undefined;

      // Convert labels to the correct type if it exists
      let labels: Label[] | undefined = undefined;
      if (profile.labels) {
        labels = Array.isArray(profile.labels)
          ? (profile.labels as Label[])
          : undefined;
      }

      // Convert pinnedPost to the correct type if it exists
      let pinnedPost: ComAtprotoRepoStrongRef.Main | undefined = undefined;
      if (profile.pinnedPost) {
        pinnedPost = profile
          .pinnedPost as unknown as ComAtprotoRepoStrongRef.Main;
      }

      const twentyFourHoursAgo = new Date();
      twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

      const [recentStories, followersCount, followsCount, postsCount] =
        await Promise.all([
          // Fetch recent stories (within 24 hours)
          ctx.db.models.Story.find({
            authorDid: actorDid,
            indexedAt: { $gte: twentyFourHoursAgo.toISOString() },
          })
            .sort({ indexedAt: -1 })
            .limit(15)
            .lean()
            .catch((error) => {
              ctx.logger.warn(
                { error, actorDid },
                "Failed to fetch stories for profile",
              );
              return [];
            }),

          // Count unique followers across both Sprk and Bsky follow types
          ctx.db.models.Follow.aggregate([
            { $match: { subject: actorDid } },
            { $group: { _id: "$authorDid" } },
            { $count: "total" },
          ]).then((result) => result[0]?.total || 0),

          // Count follows based on actor's follow mode preference
          ctx.db.models.Follow.countDocuments({
            authorDid: actorDid,
            type: actorFollowMode,
          }),

          // Count posts
          ctx.db.models.Post.countDocuments({
            authorDid: actorDid,
          }),
        ]);

      // Convert recent stories to strongRefs
      const stories: ComAtprotoRepoStrongRef.Main[] = recentStories.map(
        (story) => ({
          uri: story.uri,
          cid: story.cid,
        }),
      );

      // Build the ProfileViewDetailed response
      const profileView: SoSprkActorDefs.ProfileViewDetailed = {
        did: actorDid,
        handle: handle,
        displayName: profile.displayName,
        description: profile.description,
        avatar,
        banner,
        followersCount,
        followsCount,
        postsCount,
        associated: Object.keys(associated).length > 0 ? associated : undefined,
        indexedAt: profile.indexedAt,
        createdAt: profile.createdAt,
        viewer: Object.keys(viewer).length > 0 ? viewer : undefined,
        labels,
        pinnedPost,
        stories: stories.length > 0 ? stories : undefined,
      };

      return c.json(profileView);
    },
  );

  return router;
};
