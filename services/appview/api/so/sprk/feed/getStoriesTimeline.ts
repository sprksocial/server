import { InvalidRequestError } from "@sprk/xrpc-server";
import { transformStoryToStoryView } from "../../../../utils/story-transformer.ts";
import { Server } from "../../../../lexicon/index.ts";
import { AppContext } from "../../../../main.ts";
import { RootFilterQuery } from "mongoose";
import {
  FollowDocument,
  StoryDocument,
} from "../../../../data-plane/server/index.ts";
import { Buffer } from "node:buffer";
import type { ProfileViewBasic } from "../../../../lexicon/types/so/sprk/actor/defs.ts";
import type * as SoSprkFeedDefs from "../../../../lexicon/types/so/sprk/feed/defs.ts";

export default function (server: Server, ctx: AppContext) {
  server.so.sprk.feed.getStoriesTimeline({
    auth: ctx.authVerifier.standard,
    handler: async ({ params, auth }) => {
      const { limit: limitParam = 50, cursor } = params;
      const userDid = auth.credentials.iss;
      const limit = typeof limitParam === "string"
        ? parseInt(limitParam)
        : limitParam;

      if (isNaN(limit) || limit < 1 || limit > 100) {
        throw new InvalidRequestError(
          "Invalid limit: must be between 1 and 100",
        );
      }

      try {
        // Get accounts that the viewer follows
        const follows = await ctx.db.models.Follow.find({
          authorDid: userDid,
        }).lean();

        if (follows.length === 0) {
          return {
            encoding: "application/json",
            body: {
              storiesByAuthor: [],
            },
          };
        }

        const followedDids = follows.map((follow: FollowDocument) =>
          follow.subject
        );

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
            throw new InvalidRequestError("Invalid cursor format");
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
          stories.map(async (story: StoryDocument) => {
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
            ...a.stories.map((s) => new Date(s.indexedAt).getTime()),
          );
          const latestB = Math.max(
            ...b.stories.map((s) => new Date(s.indexedAt).getTime()),
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

        return {
          encoding: "application/json",
          body: {
            cursor: nextCursor,
            storiesByAuthor,
          },
        };
      } catch (error) {
        if (error instanceof InvalidRequestError) {
          throw error;
        }
        ctx.logger.error("Error fetching stories timeline:", error);
        throw new InvalidRequestError("Failed to fetch stories timeline");
      }
    },
  });
}
