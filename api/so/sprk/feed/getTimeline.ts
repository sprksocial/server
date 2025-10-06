import { Server } from "../../../../lex/index.ts";
import { AppContext } from "../../../../main.ts";
import { transformPostsToPostViews } from "../../../../utils/post-transformer.ts";
import { decodeBase64, encodeBase64 } from "@std/encoding";
import { OutputSchema } from "../../../../lex/types/so/sprk/feed/getTimeline.ts";

interface CursorData {
  createdAt: string;
  id: string;
}

// Helper function to parse cursor
function parseCursor(cursor: string): CursorData {
  try {
    const decodedCursor = new TextDecoder().decode(decodeBase64(cursor));
    const [timestamp, id] = decodedCursor.split("::");

    if (!timestamp || !id) {
      throw new Error("Invalid cursor format");
    }

    return { createdAt: timestamp, id };
  } catch {
    throw new Error("Invalid cursor format");
  }
}

// Helper function to generate cursor
function generateCursor(createdAt: string, id: string): string {
  return encodeBase64(
    new TextEncoder().encode(`${createdAt}::${id}`),
  );
}

// Helper function to get followed user DIDs
async function getFollowedUsers(
  ctx: AppContext,
  userDid: string,
): Promise<string[]> {
  const follows = await ctx.db.models.Follow.find({
    authorDid: userDid,
  }).select("subject").lean();

  return follows.map((follow) => follow.subject);
}

// Helper function to build timeline query
function buildTimelineQuery(
  followedDids: string[],
  cursor?: CursorData,
): Record<string, unknown> {
  const query: Record<string, unknown> = {
    authorDid: { $in: followedDids },
    reply: null, // Only show top-level posts, not replies
  };

  // Add cursor-based pagination
  if (cursor) {
    query.$or = [
      { createdAt: { $lt: cursor.createdAt } },
      { createdAt: cursor.createdAt, _id: { $lt: cursor.id } },
    ];
  }

  return query;
}

export default function (server: Server, ctx: AppContext) {
  server.so.sprk.feed.getTimeline({
    auth: ctx.authVerifier.standard,
    handler: async ({ params, auth }) => {
      try {
        const { limit = 50, cursor } = params;
        const userDid = auth.credentials.iss;

        // Validate limit
        if (limit < 1 || limit > 100) {
          throw new Error("Limit must be between 1 and 100");
        }

        // Parse cursor if provided
        let cursorData: CursorData | undefined;
        if (cursor) {
          cursorData = parseCursor(cursor);
        }

        // Get list of users the authenticated user follows
        const followedDids = await getFollowedUsers(ctx, userDid);

        // If user doesn't follow anyone, return empty feed
        if (followedDids.length === 0) {
          return {
            encoding: "application/json",
            body: {
              feed: [],
            },
          };
        }

        // Build and execute query for posts from followed users
        const query = buildTimelineQuery(followedDids, cursorData);
        const posts = await ctx.db.models.Post.find(query)
          .sort({ createdAt: -1, _id: -1 })
          .limit(limit + 1); // Get one extra for hasMore check

        // Check if there are more results
        const hasMore = posts.length > limit;
        if (hasMore) {
          posts.pop(); // Remove the extra item
        }

        // Transform posts to feed view posts
        const feedViewPosts = await transformPostsToPostViews(
          posts,
          ctx,
          userDid,
        );

        // Generate next cursor if there are more results
        let nextCursor: string | undefined;
        if (hasMore && posts.length > 0) {
          const lastPost = posts[posts.length - 1];
          nextCursor = generateCursor(
            String(lastPost.createdAt),
            String(lastPost._id),
          );
        }

        // Prepare response
        const response: OutputSchema = {
          feed: feedViewPosts.map((post) => ({ post })),
        };

        if (nextCursor) {
          response.cursor = nextCursor;
        }

        return {
          encoding: "application/json",
          body: response,
        };
      } catch (error) {
        // Handle specific error cases
        if (error instanceof Error) {
          const message = error.message;

          if (message.includes("cursor") || message.includes("Cursor")) {
            return {
              status: 400,
              message: "The provided cursor is invalid",
            };
          }

          if (message.includes("limit") || message.includes("Limit")) {
            return {
              status: 400,
              message: "Limit must be between 1 and 100",
            };
          }
        }

        // Log unexpected errors and rethrow
        console.error("Unexpected error in getTimeline:", error);
        throw error;
      }
    },
  });
}
