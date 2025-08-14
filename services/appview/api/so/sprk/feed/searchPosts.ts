import { Server } from "../../../../lexicon/index.ts";
import { AppContext } from "../../../../main.ts";
import { transformPostsToPostViews } from "../../../../utils/post-transformer.ts";
import * as SoSprkFeedDefs from "../../../../lexicon/types/so/sprk/feed/defs.ts";
import { OutputSchema } from "../../../../lexicon/types/so/sprk/feed/searchPosts.ts";
import { RootFilterQuery } from "mongoose";
import { PostDocument } from "../../../../data-plane/server/models.ts";

// Helper to escape user input for safe RegExp usage
function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export default function (server: Server, ctx: AppContext) {
  server.so.sprk.feed.searchPosts({
    auth: ctx.authVerifier.standardOptional,
    handler: async ({ params, auth }) => {
      const { q, limit, cursor, sort } = params;
      const userDid = auth.credentials.type === "standard"
        ? auth.credentials.iss
        : undefined;

      let skip = 0;
      if (cursor) {
        const parsedCursor = parseInt(cursor, 10);
        if (!isNaN(parsedCursor) && parsedCursor > 0) {
          skip = parsedCursor;
        }
      }

      const escapedQuery = escapeRegExp(q.trim());
      const regex = new RegExp(escapedQuery, "i");

      const query: RootFilterQuery<PostDocument> = {
        reply: { $eq: null },
        $or: [
          { text: regex },
          { "embed.images.alt": regex },
          { "embed.alt": regex },
        ],
      };

      let posts;

      if (sort === "top") {
        // For 'top', we use aggregation to count likes and sort by popularity
        posts = await ctx.db.models.Post.aggregate([
          { $match: query },
          {
            $lookup: {
              from: "likes",
              localField: "uri",
              foreignField: "subject",
              as: "likes",
              pipeline: [
                { $project: { _id: 1 } }, // Only fetch _id for counting
              ],
            },
          },
          {
            $addFields: {
              likeCount: { $size: "$likes" },
            },
          },
          {
            $sort: {
              likeCount: -1,
              createdAt: -1, // Secondary sort by creation date
            },
          },
          { $skip: skip },
          { $limit: limit },
          {
            $project: {
              likes: 0, // Remove the likes array from the result
            },
          },
        ]);
      } else {
        // For 'latest' or default sorting
        const sortOrder: Record<string, 1 | -1> = { createdAt: -1 };

        posts = await ctx.db.models.Post.find(query)
          .sort(sortOrder)
          .skip(skip)
          .limit(limit)
          .lean();
      }

      const postViews = await transformPostsToPostViews(posts, ctx, userDid);

      const filteredPostViews = postViews.filter(
        (v: SoSprkFeedDefs.PostView | null): v is SoSprkFeedDefs.PostView =>
          v !== null,
      );

      let nextCursor: string | undefined;
      if (filteredPostViews.length === limit) {
        nextCursor = (skip + limit).toString();
      }

      return {
        encoding: "application/json",
        body: {
          posts: filteredPostViews,
          cursor: nextCursor,
        } satisfies OutputSchema,
      };
    },
  });
}
