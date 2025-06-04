import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { transformStoryToStoryView } from "../../../../utils/story-transformer.ts";
import { authMiddleware } from "../../../../services/auth/middleware.ts";
import { AppContext, AppEnv } from "../../../../main.ts";
import { RootFilterQuery } from "mongoose";
import type { StoryDocument } from "../../../../services/data-plane/server/index.ts";
import { Buffer } from "node:buffer";
import type { ProfileViewBasic } from "../../../../lexicon/types/so/sprk/actor/defs.ts";
import type * as SoSprkFeedDefs from "../../../../lexicon/types/so/sprk/feed/defs.ts";

export const createGetStoriesTimelineRouter = (ctx: AppContext) => {
  const router = new Hono<AppEnv>();

  router.get(
    "/xrpc/so.sprk.feed.getStoriesTimeline",
    authMiddleware,
    async (c) => {
      const limit = parseInt(c.req.query("limit") || "50", 10);
      const cursor = c.req.query("cursor");
      const viewerDid = c.get("did") as string;

      if (isNaN(limit) || limit < 1 || limit > 100) {
        throw new HTTPException(400, {
          message: "Invalid limit: must be between 1 and 100",
        });
      }

      try {
        // Get accounts that the viewer follows
        const follows = await ctx.db.models.Follow.find({
          authorDid: viewerDid,
        }).lean();

        if (follows.length === 0) {
          return c.json({
            storiesByAuthor: [],
          });
        }

        const followedDids = follows.map((follow) => follow.subject);

        const twentyFourHoursAgo = new Date();
        twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

        // Build query to find stories from followed accounts within 24 hours
        const query: RootFilterQuery<StoryDocument> = {
          authorDid: { $in: followedDids },
          indexedAt: { $gte: twentyFourHoursAgo.toISOString() },
        };

        // Parse cursor if provided
        let createdAtCursor;
        let idCursor;

        if (cursor) {
          try {
            const decodedCursor = Buffer.from(cursor, "base64").toString(
              "utf-8",
            );
            const [timestamp, id] = decodedCursor.split("::");
            createdAtCursor = timestamp;
            idCursor = id;
          } catch (_error) {
            throw new HTTPException(400, { message: "Invalid cursor format" });
          }
        }

        // Add cursor-based pagination
        if (createdAtCursor && idCursor) {
          query.$or = [
            { indexedAt: { $lt: createdAtCursor } },
            { indexedAt: createdAtCursor, _id: { $lt: idCursor } },
          ];
        }

        // Get stories from database
        const stories = await ctx.db.models.Story.find(query)
          .sort({ indexedAt: -1, _id: -1 })
          .limit(limit + 1) // Get one extra for cursor
          .lean();

        // Check if we have more results (for cursor)
        const hasMore = stories.length > limit;
        if (hasMore) {
          stories.pop(); // Remove the extra item
        }

        // Transform stories to story views
        const storyViews = await Promise.all(
          stories.map(async (story) => {
            return await transformStoryToStoryView(story, ctx.db);
          }),
        );

        interface AuthorStoryGroup {
          author: ProfileViewBasic;
          stories: SoSprkFeedDefs.StoryView[];
        }

        // Group stories by author
        const storiesGroupedByAuthor = new Map<string, AuthorStoryGroup>();

        for (const storyView of storyViews) {
          const authorDid = storyView.author.did;

          if (!storiesGroupedByAuthor.has(authorDid)) {
            storiesGroupedByAuthor.set(authorDid, {
              author: storyView.author,
              stories: [],
            });
          }

          storiesGroupedByAuthor.get(authorDid)?.stories.push(storyView);
        }

        // Sort stories within each author group from oldest to newest
        const storiesByAuthor = Array.from(storiesGroupedByAuthor.values()).map(
          (group) => ({
            author: group.author,
            stories: group.stories.sort(
              (a, b) =>
                new Date(a.indexedAt).getTime() -
                new Date(b.indexedAt).getTime(),
            ),
          }),
        );

        // Sort author groups by the latest story from each author (newest first)
        storiesByAuthor.sort((a, b) => {
          const latestA = Math.max(
            ...a.stories.map((s) =>
              new Date(s.indexedAt).getTime()
            ),
          );
          const latestB = Math.max(
            ...b.stories.map((s) =>
              new Date(s.indexedAt).getTime()
            ),
          );
          return latestB - latestA;
        });

        // Generate next cursor if there are more results
        let nextCursor;
        if (hasMore && stories.length > 0) {
          const lastStory = stories[stories.length - 1];
          nextCursor = Buffer.from(
            `${lastStory.indexedAt}::${lastStory._id}`,
          ).toString("base64");
        }

        return c.json({
          cursor: nextCursor,
          storiesByAuthor,
        });
      } catch (error) {
        if (error instanceof HTTPException) {
          throw error;
        }

        console.error("Error fetching stories timeline:", error);
        throw new HTTPException(500, {
          message: "Failed to fetch stories timeline",
        });
      }
    },
  );

  return router;
};
