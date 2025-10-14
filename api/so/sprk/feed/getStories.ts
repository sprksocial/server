import { Server } from "../../../../lex/index.ts";
import { AppContext } from "../../../../context.ts";
import { OutputSchema } from "../../../../lex/types/so/sprk/feed/getStories.ts";
import { transformStoriesToStoryViews } from "../../../../utils/story-transformer.ts";
import { StoryDocument } from "../../../../data-plane/db/models.ts";

// Constants
const MAX_STORIES_LIMIT = 25;
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
async function checkBlockedStories(
  ctx: AppContext,
  stories: StoryDocument[],
  userDid?: string,
): Promise<Set<string>> {
  if (!userDid || stories.length === 0) {
    return new Set();
  }

  const authorDids = [...new Set(stories.map((s) => s.authorDid))];

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

  // Return URIs of stories from blocked authors
  return new Set(
    stories
      .filter((s) => blockedAuthorDids.has(s.authorDid))
      .map((s) => s.uri),
  );
}

// Helper function to sort stories by original URI order
function sortStoriesByUriOrder(
  stories: StoryDocument[],
  originalUris: string[],
): StoryDocument[] {
  const storyMap = new Map(stories.map((story) => [story.uri, story]));
  const sortedStories: StoryDocument[] = [];

  for (const uri of originalUris) {
    const story = storyMap.get(uri);
    if (story) {
      sortedStories.push(story);
    }
  }

  return sortedStories;
}

function filterExpiredStories(
  stories: StoryDocument[],
  ownerDid?: string,
): StoryDocument[] {
  const twentyFourHoursAgo = new Date();
  twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

  return stories.filter((story) => {
    // If the authenticated user is the author, not apply the 24h expiration filter
    if (ownerDid && story.authorDid === ownerDid) return true;
    const storyDate = new Date(story.indexedAt);
    return storyDate >= twentyFourHoursAgo;
  });
}

export default function (server: Server, ctx: AppContext) {
  server.so.sprk.feed.getStories({
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
            body: { stories: [] } as OutputSchema,
          };
        }

        // Enforce maximum limit
        if (uriArray.length > MAX_STORIES_LIMIT) {
          return {
            status: 400,
            message: `Too many URIs requested. Maximum is ${MAX_STORIES_LIMIT}`,
          };
        }

        // Validate URIs
        const { valid: validUris, invalid: invalidUris } = validateUris(
          uriArray,
        );

        if (invalidUris.length > 0) {
          console.warn(
            `Invalid story URIs provided: ${
              invalidUris.slice(0, 5).join(", ")
            }${invalidUris.length > 5 ? "..." : ""}`,
          );
        }

        if (validUris.length === 0) {
          return {
            encoding: "application/json",
            body: { stories: [] } as OutputSchema,
          };
        }

        // Deduplicate URIs while preserving order
        const uniqueUris = deduplicateUris(validUris);

        // Fetch stories from database with optimized query
        const dbStories = await ctx.db.models.Story.find({
          uri: { $in: uniqueUris },
        })
          .exec();

        if (dbStories.length === 0) {
          return {
            encoding: "application/json",
            body: { stories: [] } as OutputSchema,
          };
        }

        // Filter out expired stories (older than 24 hours)
        const activeStories = filterExpiredStories(dbStories, userDid);

        if (activeStories.length === 0) {
          return {
            encoding: "application/json",
            body: { stories: [] } as OutputSchema,
          };
        }

        // Check for blocked relationships
        const blockedStoryUris = await checkBlockedStories(
          ctx,
          activeStories,
          userDid,
        );

        // Filter out blocked stories
        const accessibleStories = activeStories.filter((story) =>
          !blockedStoryUris.has(story.uri)
        );

        if (accessibleStories.length === 0) {
          return {
            encoding: "application/json",
            body: { stories: [] } as OutputSchema,
          };
        }

        // Sort stories to match the original URI order
        const sortedStories = sortStoriesByUriOrder(
          accessibleStories,
          uniqueUris,
        );

        // Transform stories to StoryView format using batch transformer
        const storyViews = await transformStoriesToStoryViews(
          sortedStories,
          ctx,
        );

        const response: OutputSchema = {
          stories: storyViews,
        };

        return {
          encoding: "application/json",
          body: response,
        };
      } catch (error) {
        // Log error for debugging
        console.error("Error in getStories:", error);

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
