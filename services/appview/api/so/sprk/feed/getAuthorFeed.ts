import { Server } from "../../../../lexicon/index.ts";
import { AppContext } from "../../../../main.ts";
import { transformPostsToPostViews } from "../../../../utils/post-transformer.ts";
import { decodeBase64, encodeBase64 } from "jsr:@std/encoding";
import { OutputSchema } from "../../../../lexicon/types/so/sprk/feed/getAuthorFeed.ts";

export default function (server: Server, ctx: AppContext) {
  server.so.sprk.feed.getAuthorFeed({
    auth: ctx.authVerifier.standardOptional,
    handler: async ({ params, auth }) => {
      // Get query parameters
      const { actor, limit, cursor, filter, includePins } = params;
      const userDid = auth.credentials.type === "standard"
        ? auth.credentials.iss
        : undefined;

      // Validate required parameters
      if (!actor) {
        throw new Error("Actor is required");
      }

      // Validate limit
      if (limit < 1 || limit > 100) {
        throw new Error("Invalid limit: must be between 1 and 100");
      }

      // Resolve DID if handle is provided
      let resolvedActorDid = actor;

      try {
        if (!resolvedActorDid.startsWith("did:")) {
          try {
            const didDoc = await ctx.resolver.resolveHandleToDidDoc(actor);
            resolvedActorDid = didDoc.did;
          } catch (error) {
            console.error("Failed to resolve handle:", error);
            throw new Error("Invalid actor: could not resolve handle");
          }
        }

        // Check if user is blocked or blocking the actor
        if (userDid) {
          const userIsBlocked = await ctx.db.models.Block.findOne({
            authorDid: resolvedActorDid,
            subject: userDid,
          });

          if (userIsBlocked) {
            throw new Error("BlockedByActor");
          }

          const userIsBlocking = await ctx.db.models.Block.findOne({
            authorDid: userDid,
            subject: resolvedActorDid,
          });

          if (userIsBlocking) {
            throw new Error("BlockedActor");
          }
        }

        // Build query based on filter
        type MongoQuery = {
          authorDid: string;
          reply: null;
          $or?: Array<{ [key: string]: unknown }>;
          [key: string]: unknown;
        };

        const query: MongoQuery = { authorDid: resolvedActorDid, reply: null };

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
            const decodedCursor = new TextDecoder().decode(
              decodeBase64(cursor),
            );
            const [timestamp, id] = decodedCursor.split("::");
            createdAtCursor = timestamp;
            idCursor = id;
          } catch {
            throw new Error("Invalid cursor format");
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
        const pinnedPosts: typeof posts = [];
        if (includePins) {
          // Get profile to find pinned posts
          const profile = await ctx.db.models.Profile.findOne({
            authorDid: resolvedActorDid,
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
        const feedViewPosts = await transformPostsToPostViews(
          [...pinnedPosts, ...posts],
          ctx,
          userDid,
        );

        // Generate next cursor if there are more results
        let nextCursor;
        if (hasMore && posts.length > 0) {
          const lastPost = posts[posts.length - 1];
          nextCursor = encodeBase64(
            new TextEncoder().encode(`${lastPost.createdAt}::${lastPost._id}`),
          );
        }

        const responseBody: OutputSchema = {
          feed: feedViewPosts.map((post) => ({ post })),
        };

        if (nextCursor) {
          responseBody.cursor = nextCursor;
        }

        return {
          encoding: "application/json",
          body: {
            cursor: nextCursor,
            feed: feedViewPosts.map((post) => ({ post })),
          },
        };
      } catch (error) {
        if (error instanceof Error) {
          if (error.message === "BlockedByActor") {
            return {
              status: 400,
              error: "BlockedByActor",
              message: "The requesting account is blocked by the actor",
            };
          }
          if (error.message === "BlockedActor") {
            return {
              status: 400,
              error: "BlockedActor",
              message: "The requesting account has blocked the actor",
            };
          }
        }
        throw error;
      }
    },
  });
}
