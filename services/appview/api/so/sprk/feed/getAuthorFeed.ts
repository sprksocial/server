import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { optionalAuthMiddleware } from "../../../../services/auth/middleware.ts";
import { AppContext, AppEnv } from "../../../../main.ts";
import { transformPostToPostView } from "../../../../utils/post-transformer.ts";
import { encodeBase64, decodeBase64 } from "jsr:@std/encoding"

export const createGetAuthorFeedRouter = (ctx: AppContext) => {
  const router = new Hono<AppEnv>();

  router.get(
    "/xrpc/so.sprk.feed.getAuthorFeed",
    optionalAuthMiddleware,
    async (c) => {
      // Get query parameters
      const actor = c.req.query("actor");
      const limit = parseInt(c.req.query("limit") || "50", 10);
      const cursor = c.req.query("cursor");
      const filter = c.req.query("filter") || "posts_with_replies";
      const includePins = c.req.query("includePins") === "true";
      const viewerDid = c.var.did as string | undefined;

      // Validate required parameters
      if (!actor) {
        throw new HTTPException(400, { message: "Actor is required" });
      }

      // Validate limit
      if (isNaN(limit) || limit < 1 || limit > 100) {
        throw new HTTPException(400, {
          message: "Invalid limit: must be between 1 and 100",
        });
      }

      try {
        // Resolve DID if handle is provided
        let actorDid = actor;
        if (!actorDid.startsWith("did:")) {
          try {
            const didDoc = await ctx.resolver.resolveHandleToDidDoc(actor);
            actorDid = didDoc.did;
          } catch {
            throw new HTTPException(400, {
              message: "Invalid actor: could not resolve handle",
            });
          }
        }

        // Check if user is blocked or blocking the actor
        if (viewerDid) {
          const userIsBlocked = await ctx.db.models.Block.findOne({
            authorDid: actorDid,
            subject: viewerDid,
          });

          if (userIsBlocked) {
            throw new HTTPException(403, { message: "BlockedByActor" });
          }

          const userIsBlocking = await ctx.db.models.Block.findOne({
            authorDid: viewerDid,
            subject: actorDid,
          });

          if (userIsBlocking) {
            throw new HTTPException(403, { message: "BlockedActor" });
          }
        }

        // Build query based on filter
        type MongoQuery = {
          authorDid: string;
          reply: null;
          $or?: Array<{ [key: string]: unknown }>;
          [key: string]: unknown;
        };

        const query: MongoQuery = { authorDid: actorDid, reply: null };

        if (filter === "posts_with_media") {
          query.$or = [
            { "embed.$type": "so.sprk.embed.images" },
            { "embed.$type": "so.sprk.embed.video" },
          ];
        } else if (filter === "posts_with_video") {
          query["embed.$type"] = "so.sprk.embed.video";
        }

        // Parse cursor if provided
        let createdAtCursor;
        let idCursor;

        if (cursor) {
          try {
            const decodedCursor = new TextDecoder().decode(decodeBase64(cursor));
            const [timestamp, id] = decodedCursor.split("::");
            createdAtCursor = timestamp;
            idCursor = id;
          } catch {
            throw new HTTPException(400, { message: "Invalid cursor format" });
          }
        }

        // Add cursor-based pagination
        if (createdAtCursor && idCursor) {
          query.$or = [
            { createdAt: { $lt: createdAtCursor } },
            { createdAt: createdAtCursor, _id: { $lt: idCursor } },
          ];
        }

        // Get posts from database
        const posts = await ctx.db.models.Post.find(query)
          .sort({ createdAt: -1, _id: -1 })
          .limit(limit + 1) // Get one extra for cursor
          .lean();

        // Check if we have more results (for cursor)
        const hasMore = posts.length > limit;
        if (hasMore) {
          posts.pop(); // Remove the extra item
        }

        // Include pinned posts if requested
        const pinnedPosts = [];
        if (includePins) {
          // Get profile to find pinned posts
          const profile = await ctx.db.models.Profile.findOne({
            authorDid: actorDid,
          }).lean();

          if (profile?.pinnedPost) {
            const pinnedPostUri = profile.pinnedPost.uri;
            const pinnedPost = await ctx.db.models.Post.findOne({
              uri: pinnedPostUri,
            }).lean();

            if (pinnedPost) {
              pinnedPosts.push(pinnedPost);
            }
          }
        }

        // Transform posts to feed view posts
        const feedViewPosts = await Promise.all(
          [...pinnedPosts, ...posts].map(async (post) => {
            const postView = await transformPostToPostView(
              post,
              ctx.db,
              viewerDid,
            );

            return {
              post: postView,
            };
          }),
        );

        // Generate next cursor if there are more results
        let nextCursor;
        if (hasMore && posts.length > 0) {
          const lastPost = posts[posts.length - 1];
          nextCursor = encodeBase64(
            new TextEncoder().encode(`${lastPost.createdAt}::${lastPost._id}`)
          );
        }

        return c.json({
          cursor: nextCursor,
          feed: feedViewPosts,
        });
      } catch (error) {
        if (error instanceof HTTPException) {
          throw error;
        }

        console.error("Error fetching author feed:", error);
        throw new HTTPException(500, {
          message: "Failed to fetch author feed",
        });
      }
    },
  );

  return router;
};
