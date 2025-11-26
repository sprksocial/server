import { mapDefined } from "@atp/common";
import { AppContext } from "../../../../context.ts";
import {
  HydrateCtx,
  HydrationState,
  Hydrator,
} from "../../../../hydration/index.ts";
import { Server } from "../../../../lex/index.ts";
import { QueryParams } from "../../../../lex/types/so/sprk/feed/searchPosts.ts";
import { createPipeline } from "../../../../pipeline.ts";
import { uriToDid as creatorFromUri } from "../../../../utils/uris.ts";
import { Views } from "../../../../views/index.ts";
import { resHeaders } from "../../../util.ts";
import { RootFilterQuery } from "mongoose";
import { PostDocument } from "../../../../data-plane/db/models.ts";

// Helper to escape user input for safe RegExp usage
function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export default function (server: Server, ctx: AppContext) {
  const searchPosts = createPipeline(
    skeleton,
    hydration,
    noBlocks,
    presentation,
  );
  server.so.sprk.feed.searchPosts({
    auth: ctx.authVerifier.standardOptional,
    handler: async ({ params, auth }) => {
      const viewer = auth.credentials.type === "standard"
        ? auth.credentials.iss
        : undefined;
      const hydrateCtx = ctx.hydrator.createContext({ viewer: viewer ?? null });

      const results = await searchPosts({ ...params, hydrateCtx }, ctx);

      return {
        encoding: "application/json",
        body: results,
        headers: resHeaders({}),
      };
    },
  });
}

const skeleton = async (inputs: {
  ctx: AppContext;
  params: Params;
}) => {
  const { ctx, params } = inputs;
  const { q, limit = 25, cursor, sort } = params;

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

  let posts: { uri: string }[];

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
          uri: 1,
        },
      },
    ]);
  } else {
    // For 'latest' or default sorting
    const sortOrder: Record<string, 1 | -1> = { createdAt: -1 };

    posts = await ctx.db.models.Post.find(query)
      .select("uri")
      .sort(sortOrder)
      .skip(skip)
      .limit(limit)
      .lean();
  }

  const uris = posts.map((p) => p.uri);

  let nextCursor: string | undefined;
  if (uris.length === limit) {
    nextCursor = (skip + limit).toString();
  }

  return { posts: uris, cursor: nextCursor };
};

const hydration = (inputs: {
  ctx: Context;
  params: Params;
  skeleton: Skeleton;
}) => {
  const { ctx, params, skeleton } = inputs;
  return ctx.hydrator.hydratePosts(
    skeleton.posts.map((uri) => ({ uri })),
    params.hydrateCtx,
  );
};

const noBlocks = (inputs: {
  ctx: Context;
  skeleton: Skeleton;
  hydration: HydrationState;
}) => {
  const { ctx, skeleton, hydration } = inputs;
  skeleton.posts = skeleton.posts.filter((uri) => {
    const creator = creatorFromUri(uri);
    return !ctx.views.viewerBlockExists(creator, hydration);
  });
  return skeleton;
};

const presentation = (inputs: {
  ctx: Context;
  params: Params;
  skeleton: Skeleton;
  hydration: HydrationState;
}) => {
  const { ctx, skeleton, hydration } = inputs;
  const posts = mapDefined(
    skeleton.posts,
    (uri) => ctx.views.post(uri, hydration),
  );
  return { posts, cursor: skeleton.cursor };
};

type Context = {
  db: AppContext["db"];
  hydrator: Hydrator;
  views: Views;
};

type Params = QueryParams & { hydrateCtx: HydrateCtx };

type Skeleton = {
  posts: string[];
  cursor?: string;
};
