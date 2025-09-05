import { Server } from "../../../../lex/index.ts";
import { AppContext } from "../../../../main.ts";
import { transformPostsToPostViews } from "../../../../utils/post-transformer.ts";
import { decodeBase64, encodeBase64 } from "jsr:@std/encoding";
import { OutputSchema } from "../../../../lex/types/so/sprk/feed/getAuthorFeed.ts";
import { PostDocument } from "../../../../data-plane/db/models.ts";

interface CursorData {
  createdAt: string;
  id: string;
}

interface BlockCheckResult {
  isBlocked: boolean;
  isBlocking: boolean;
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

// Helper function to check block status
async function checkBlockStatus(
  ctx: AppContext,
  userDid: string,
  actorDid: string,
): Promise<BlockCheckResult> {
  const [userIsBlocked, userIsBlocking] = await Promise.all([
    ctx.db.models.Block.findOne({
      authorDid: actorDid,
      subject: userDid,
    }).lean(),
    ctx.db.models.Block.findOne({
      authorDid: userDid,
      subject: actorDid,
    }).lean(),
  ]);

  return {
    isBlocked: !!userIsBlocked,
    isBlocking: !!userIsBlocking,
  };
}

// Helper function to build post query
function buildPostQuery(
  actorDid: string,
  filter?: string,
  cursor?: CursorData,
): Record<string, unknown> {
  const query: Record<string, unknown> = {
    authorDid: actorDid,
    reply: null,
  };

  // Add filter conditions
  if (filter === "posts_with_media") {
    query.$or = [
      { "embed.$type": "so.sprk.embed.images" },
      { "embed.$type": "so.sprk.embed.video" },
    ];
  } else if (filter === "posts_with_video") {
    query["embed.$type"] = "so.sprk.embed.video";
  }

  // Add cursor-based pagination
  if (cursor) {
    const paginationConditions = [
      { createdAt: { $lt: cursor.createdAt } },
      { createdAt: cursor.createdAt, _id: { $lt: cursor.id } },
    ];

    if (query.$or) {
      // If filter already uses $or, wrap everything in $and
      query.$and = [
        { $or: query.$or },
        { $or: paginationConditions },
      ];
      delete query.$or;
    } else {
      query.$or = paginationConditions;
    }
  }

  return query;
}

// Helper function to get pinned posts
async function getPinnedPosts(
  ctx: AppContext,
  actorDid: string,
): Promise<PostDocument[]> {
  const profile = await ctx.db.models.Profile.findOne({
    authorDid: actorDid,
  }).lean();

  if (!profile?.pinnedPost?.uri) {
    return [];
  }

  const pinnedPost = await ctx.db.models.Post.findOne({
    uri: profile.pinnedPost.uri,
  }).lean();

  return pinnedPost ? [pinnedPost] : [];
}

export default function (server: Server, ctx: AppContext) {
  server.so.sprk.feed.getAuthorFeed({
    auth: ctx.authVerifier.standardOptional,
    handler: async ({ params, auth }) => {
      try {
        // Extract and validate parameters
        const { actor, limit = 50, cursor, filter, includePins = false } =
          params;
        const userDid = auth.credentials.type === "standard"
          ? auth.credentials.iss
          : undefined;

        // Validate required parameters
        if (!actor) {
          throw new Error("Actor parameter is required");
        }

        // Validate limit
        if (limit < 1 || limit > 100) {
          throw new Error("Limit must be between 1 and 100");
        }

        // Resolve actor DID
        let resolvedActorDid = actor;
        if (!actor.startsWith("did:")) {
          try {
            const didDoc = await ctx.resolver.resolveHandleToDidDoc(actor);
            resolvedActorDid = didDoc.did;
          } catch (error) {
            console.error("Failed to resolve handle:", error);
            throw new Error("Could not resolve actor handle");
          }
        }

        // Check block status if user is authenticated
        if (userDid) {
          const { isBlocked, isBlocking } = await checkBlockStatus(
            ctx,
            userDid,
            resolvedActorDid,
          );

          if (isBlocked) {
            return {
              status: 400,
              error: "BlockedByActor" as const,
              message: "The requesting account is blocked by the actor",
            };
          }

          if (isBlocking) {
            return {
              status: 400,
              error: "BlockedActor" as const,
              message: "The requesting account has blocked the actor",
            };
          }
        }

        // Parse cursor if provided
        let cursorData: CursorData | undefined;
        if (cursor) {
          cursorData = parseCursor(cursor);
        }

        // Build and execute query
        const query = buildPostQuery(resolvedActorDid, filter, cursorData);
        const posts = await ctx.db.models.Post.find(query)
          .sort({ createdAt: -1, _id: -1 })
          .limit(limit + 1) // Get one extra for hasMore check
          .lean();

        // Check if there are more results
        const hasMore = posts.length > limit;
        if (hasMore) {
          posts.pop(); // Remove the extra item
        }

        // Get pinned posts if requested (only on first page)
        let pinnedPosts: PostDocument[] = [];
        if (includePins && !cursor) {
          pinnedPosts = await getPinnedPosts(ctx, resolvedActorDid);
        }

        // Transform posts to feed view posts
        const allPosts = [...pinnedPosts, ...posts];
        const feedViewPosts = await transformPostsToPostViews(
          allPosts,
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

          if (message === "BlockedByActor" || message === "BlockedActor") {
            return {
              status: 400,
              error: message as "BlockedByActor" | "BlockedActor",
              message: message === "BlockedByActor"
                ? "The requesting account is blocked by the actor"
                : "The requesting account has blocked the actor",
            };
          }

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

          if (message.includes("Actor") || message.includes("actor")) {
            return {
              status: 400,
              message: "Invalid actor parameter or could not resolve handle",
            };
          }
        }

        // Log unexpected errors and rethrow
        console.error("Unexpected error in getAuthorFeed:", error);
        throw error;
      }
    },
  });
}
