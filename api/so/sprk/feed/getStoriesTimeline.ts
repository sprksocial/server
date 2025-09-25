import { InvalidRequestError } from "@atp/xrpc-server";
import { Server } from "../../../../lex/index.ts";
import { AppContext } from "../../../../main.ts";
import { transformStoriesToStoryViews } from "../../../../utils/story-transformer.ts";
import { decodeBase64, encodeBase64 } from "@std/encoding";
import type { ProfileViewBasic } from "../../../../lex/types/so/sprk/actor/defs.ts";
import type * as SoSprkFeedDefs from "../../../../lex/types/so/sprk/feed/defs.ts";

// Constants
const MAX_LIMIT = 100;
const DEFAULT_LIMIT = 50;
const STORIES_EXPIRY_HOURS = 24;

interface CursorData {
  indexedAt: string;
  id: string;
}

interface AuthorStoryGroup {
  author: ProfileViewBasic;
  stories: SoSprkFeedDefs.StoryView[];
}

// Helper function to parse cursor
function parseCursor(cursor: string): CursorData {
  try {
    const decodedCursor = new TextDecoder().decode(decodeBase64(cursor));
    const [timestamp, id] = decodedCursor.split("::");

    if (!timestamp || !id) {
      throw new Error("Invalid cursor format");
    }

    return { indexedAt: timestamp, id };
  } catch {
    throw new InvalidRequestError("Invalid cursor format");
  }
}

// Helper function to generate cursor
function generateCursor(indexedAt: string, id: string): string {
  return encodeBase64(
    new TextEncoder().encode(`${indexedAt}::${id}`),
  );
}

// Helper function to get follows with caching optimization
async function getUserFollows(
  ctx: AppContext,
  userDid: string,
): Promise<string[]> {
  const follows = await ctx.db.models.Follow.find({
    authorDid: userDid,
  })
    .select("subject")
    .lean()
    .exec();

  return follows.map((follow) => follow.subject);
}

// Batch check blocked relationships for all authors
async function batchCheckBlockedAuthors(
  ctx: AppContext,
  authorDids: string[],
  userDid: string,
): Promise<Set<string>> {
  if (authorDids.length === 0) {
    return new Set();
  }

  // Single query to get all block relationships
  const [userBlocking, userBlocked] = await Promise.all([
    ctx.db.models.Block.find({
      authorDid: userDid,
      subject: { $in: authorDids },
    }).select("subject").lean(),
    ctx.db.models.Block.find({
      authorDid: { $in: authorDids },
      subject: userDid,
    }).select("authorDid").lean(),
  ]);

  const blockedAuthorDids = new Set([
    ...userBlocking.map((b) => b.subject),
    ...userBlocked.map((b) => b.authorDid),
  ]);

  return blockedAuthorDids;
}

// Build optimized query for stories
function buildStoriesQuery(
  followedDids: string[],
  cursor?: CursorData,
): Record<string, unknown> {
  const twentyFourHoursAgo = new Date();
  twentyFourHoursAgo.setHours(
    twentyFourHoursAgo.getHours() - STORIES_EXPIRY_HOURS,
  );

  const query: Record<string, unknown> = {
    authorDid: { $in: followedDids },
    indexedAt: { $gte: twentyFourHoursAgo.toISOString() },
  };

  // Add cursor-based pagination
  if (cursor) {
    query.$or = [
      { indexedAt: { $lt: cursor.indexedAt } },
      { indexedAt: cursor.indexedAt, _id: { $lt: cursor.id } },
    ];
  }

  return query;
}

// Efficiently group stories by author with proper sorting
function groupStoriesByAuthor(
  storyViews: SoSprkFeedDefs.StoryView[],
): SoSprkFeedDefs.StoriesByAuthor[] {
  if (storyViews.length === 0) {
    return [];
  }

  // Use Map for efficient grouping
  const storiesGroupedByAuthor = new Map<string, AuthorStoryGroup>();

  for (const storyView of storyViews) {
    const authorDid = storyView.author.did;

    if (!storiesGroupedByAuthor.has(authorDid)) {
      storiesGroupedByAuthor.set(authorDid, {
        author: storyView.author,
        stories: [],
      });
    }

    storiesGroupedByAuthor.get(authorDid)!.stories.push(storyView);
  }

  // Convert to array and sort stories within each group
  const storiesByAuthor = Array.from(storiesGroupedByAuthor.values()).map(
    (group) => ({
      author: group.author,
      stories: group.stories.sort(
        (a, b) =>
          new Date(a.indexedAt).getTime() - new Date(b.indexedAt).getTime(),
      ),
    }),
  );

  // Sort author groups by the latest story from each author (newest first)
  storiesByAuthor.sort((a, b) => {
    const latestA = Math.max(
      ...a.stories.map((s) => new Date(s.indexedAt).getTime()),
    );
    const latestB = Math.max(
      ...b.stories.map((s) => new Date(s.indexedAt).getTime()),
    );
    return latestB - latestA;
  });

  return storiesByAuthor;
}

export default function (server: Server, ctx: AppContext) {
  server.so.sprk.feed.getStoriesTimeline({
    auth: ctx.authVerifier.standard,
    handler: async ({ params, auth }) => {
      const { limit: limitParam = DEFAULT_LIMIT, cursor } = params;
      const userDid = auth.credentials.iss;

      // Validate and sanitize limit
      const limit = typeof limitParam === "string"
        ? parseInt(limitParam, 10)
        : limitParam;

      if (isNaN(limit) || limit < 1 || limit > MAX_LIMIT) {
        throw new InvalidRequestError(
          `Invalid limit: must be between 1 and ${MAX_LIMIT}`,
        );
      }

      // Parse cursor if provided
      let cursorData: CursorData | undefined;
      if (cursor) {
        cursorData = parseCursor(cursor);
      }

      // Get accounts that the viewer follows (with optimization)
      const followedDids = await getUserFollows(ctx, userDid);

      if (followedDids.length === 0) {
        return {
          encoding: "application/json",
          body: {
            storiesByAuthor: [],
          },
        };
      }

      // Build optimized query
      const query = buildStoriesQuery(followedDids, cursorData);

      // Get stories from database with optimized query
      const stories = await ctx.db.models.Story.find(query)
        .sort({ indexedAt: -1, _id: -1 })
        .limit(limit + 1) // Get one extra for hasMore check
        .lean()
        .exec();

      if (stories.length === 0) {
        return {
          encoding: "application/json",
          body: {
            storiesByAuthor: [],
          },
        };
      }

      // Check if we have more results (for cursor)
      const hasMore = stories.length > limit;
      if (hasMore) {
        stories.pop(); // Remove the extra item
      }

      // Get all unique author DIDs for batch block checking
      const authorDids = [
        ...new Set(stories.map((story) => story.authorDid)),
      ];

      // Batch check all block relationships
      const blockedAuthorDids = await batchCheckBlockedAuthors(
        ctx,
        authorDids,
        userDid,
      );

      // Filter out stories from blocked authors
      const accessibleStories = stories.filter(
        (story) => !blockedAuthorDids.has(story.authorDid),
      );

      if (accessibleStories.length === 0) {
        return {
          encoding: "application/json",
          body: {
            storiesByAuthor: [],
          },
        };
      }

      // Transform stories to story views using batch transformer
      const storyViews = await transformStoriesToStoryViews(
        accessibleStories,
        ctx,
      );

      // Group stories by author efficiently
      const storiesByAuthor = groupStoriesByAuthor(storyViews);

      // Generate next cursor if there are more results
      let nextCursor: string | undefined;
      if (hasMore && accessibleStories.length > 0) {
        const lastStory = accessibleStories[accessibleStories.length - 1];
        nextCursor = generateCursor(
          lastStory.indexedAt,
          String(lastStory._id),
        );
      }

      const response = {
        storiesByAuthor,
        ...(nextCursor && { cursor: nextCursor }),
      };

      return {
        encoding: "application/json",
        body: response,
      };
    },
  });
}
