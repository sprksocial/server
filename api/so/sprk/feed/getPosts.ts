import { Server } from "../../../../lex/index.ts";
import { AppContext } from "../../../../main.ts";
import { OutputSchema } from "../../../../lex/types/so/sprk/feed/getPosts.ts";
import { transformPostsToPostViews } from "../../../../utils/post-transformer.ts";
import { PostDocument } from "../../../../data-plane/db/models.ts";

// Constants
const MAX_POSTS_LIMIT = 25;
const MAX_URI_LENGTH = 3000;

// Helper function to validate URIs
function validateUris(uris: string[]): { valid: string[]; invalid: string[] } {
  const valid: string[] = [];
  const invalid: string[] = [];

  for (const uri of uris) {
    if (typeof uri !== "string" || uri.length === 0) {
      invalid.push(uri);
      continue;
    }

    if (uri.length > MAX_URI_LENGTH) {
      invalid.push(uri);
      continue;
    }

    // Basic AT-URI validation
    if (!uri.startsWith("at://")) {
      invalid.push(uri);
      continue;
    }

    valid.push(uri);
  }

  return { valid, invalid };
}

// Helper function to deduplicate URIs while preserving order
function deduplicateUris(uris: string[]): string[] {
  const seen = new Set<string>();
  return uris.filter((uri) => {
    if (seen.has(uri)) {
      return false;
    }
    seen.add(uri);
    return true;
  });
}

// Helper function to check for blocked relationships
async function checkBlockedPosts(
  ctx: AppContext,
  posts: PostDocument[],
  userDid?: string,
): Promise<Set<string>> {
  if (!userDid || posts.length === 0) {
    return new Set();
  }

  const authorDids = [...new Set(posts.map((p) => p.authorDid))];

  // Check if user is blocking any of the authors or is blocked by them
  const [userBlocking, userBlocked] = await Promise.all([
    ctx.db.models.Block.find({
      authorDid: userDid,
      subject: { $in: authorDids },
    }).lean(),
    ctx.db.models.Block.find({
      authorDid: { $in: authorDids },
      subject: userDid,
    }).lean(),
  ]);

  const blockedAuthorDids = new Set([
    ...userBlocking.map((b) => b.subject),
    ...userBlocked.map((b) => b.authorDid),
  ]);

  // Return URIs of posts from blocked authors
  return new Set(
    posts
      .filter((p) => blockedAuthorDids.has(p.authorDid))
      .map((p) => p.uri),
  );
}

// Helper function to sort posts by original URI order
function sortPostsByUriOrder(
  posts: PostDocument[],
  originalUris: string[],
): PostDocument[] {
  const postMap = new Map(posts.map((post) => [post.uri, post]));
  const sortedPosts: PostDocument[] = [];

  for (const uri of originalUris) {
    const post = postMap.get(uri);
    if (post) {
      sortedPosts.push(post);
    }
  }

  return sortedPosts;
}

export default function (server: Server, ctx: AppContext) {
  server.so.sprk.feed.getPosts({
    auth: ctx.authVerifier.standardOptional,
    handler: async ({ params, auth }) => {
      try {
        const { uris } = params;
        const userDid = auth.credentials.type === "standard"
          ? auth.credentials.iss
          : undefined;

        // Validate input
        if (!uris) {
          return {
            status: 400,
            message: "URIs parameter is required",
          };
        }

        // Ensure uris is an array
        const uriArray = Array.isArray(uris) ? uris : [uris];

        // Check if empty array
        if (uriArray.length === 0) {
          return {
            encoding: "application/json",
            body: { posts: [] } as OutputSchema,
          };
        }

        // Enforce maximum limit
        if (uriArray.length > MAX_POSTS_LIMIT) {
          return {
            status: 400,
            message: `Too many URIs requested. Maximum is ${MAX_POSTS_LIMIT}`,
          };
        }

        // Validate URIs
        const { valid: validUris, invalid: invalidUris } = validateUris(
          uriArray,
        );

        if (invalidUris.length > 0) {
          console.warn(
            `Invalid URIs provided: ${invalidUris.slice(0, 5).join(", ")}${
              invalidUris.length > 5 ? "..." : ""
            }`,
          );
        }

        if (validUris.length === 0) {
          return {
            encoding: "application/json",
            body: { posts: [] } as OutputSchema,
          };
        }

        // Deduplicate URIs while preserving order
        const uniqueUris = deduplicateUris(validUris);

        // Fetch posts from database
        const dbPosts = await ctx.db.models.Post.find({
          uri: { $in: uniqueUris },
        })
          .lean()
          .exec();

        if (dbPosts.length === 0) {
          return {
            encoding: "application/json",
            body: { posts: [] } as OutputSchema,
          };
        }

        // Check for blocked relationships
        const blockedPostUris = await checkBlockedPosts(ctx, dbPosts, userDid);

        // Filter out blocked posts
        const accessiblePosts = dbPosts.filter((post) =>
          !blockedPostUris.has(post.uri)
        );

        if (accessiblePosts.length === 0) {
          return {
            encoding: "application/json",
            body: { posts: [] } as OutputSchema,
          };
        }

        // Sort posts to match the original URI order
        const sortedPosts = sortPostsByUriOrder(accessiblePosts, uniqueUris);

        // Transform posts to PostView format
        const postViews = await transformPostsToPostViews(
          sortedPosts,
          ctx,
          userDid,
        );

        const response: OutputSchema = {
          posts: postViews,
        };

        return {
          encoding: "application/json",
          body: response,
        };
      } catch (error) {
        // Log error for debugging
        console.error("Error in getPosts:", error);

        // Handle specific error cases
        if (error instanceof Error) {
          const message = error.message;

          // MongoDB connection errors
          if (message.includes("connection") || message.includes("timeout")) {
            return {
              status: 503,
              message: "Database temporarily unavailable",
            };
          }

          // Validation errors
          if (message.includes("validation") || message.includes("invalid")) {
            return {
              status: 400,
              message: "Invalid request parameters",
            };
          }

          // Rate limiting or resource errors
          if (message.includes("limit") || message.includes("quota")) {
            return {
              status: 429,
              message: "Rate limit exceeded",
            };
          }
        }

        // Generic server error for unexpected cases
        return {
          status: 500,
          message: "Internal server error",
        };
      }
    },
  });
}
