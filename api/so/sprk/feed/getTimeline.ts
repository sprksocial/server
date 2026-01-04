import { mapDefined } from "@atp/common";
import { AppContext } from "../../../../context.ts";
import { DataPlane } from "../../../../data-plane/index.ts";
import { FeedItem } from "../../../../hydration/feed.ts";
import {
  HydrateCtx,
  HydrationState,
  Hydrator,
} from "../../../../hydration/index.ts";
import { parseString } from "../../../../hydration/util.ts";
import { Server } from "../../../../lex/index.ts";
import { QueryParams } from "../../../../lex/types/so/sprk/feed/getTimeline.ts";
import { createPipeline } from "../../../../pipeline.ts";
import { Views } from "../../../../views/index.ts";
import { clearlyBadCursor, resHeaders } from "../../../util.ts";

export default function (server: Server, ctx: AppContext) {
  const getTimeline = createPipeline(
    skeleton,
    hydration,
    noBlocksOrMutes,
    presentation,
  );
  server.so.sprk.feed.getTimeline({
    auth: ctx.authVerifier.standard,
    handler: async ({ params, auth, req }) => {
      const viewer = auth.credentials.iss;
      const labelers = ctx.reqLabelers(req);
      const hydrateCtx = await ctx.hydrator.createContext({ viewer, labelers });

      // Parallelize pipeline execution with repoRev fetch
      const [result, repoRev] = await Promise.all([
        getTimeline(
          { ...params, hydrateCtx: hydrateCtx.copy({ viewer }) },
          ctx,
        ),
        ctx.hydrator.actor.getRepoRevSafe(viewer),
      ]);

      return {
        encoding: "application/json",
        body: result,
        headers: resHeaders({
          repoRev,
          labelers: hydrateCtx.labelers,
        }),
      };
    },
  });
}

export const skeleton = async (inputs: {
  ctx: Context;
  params: Params;
}): Promise<Skeleton> => {
  const { ctx, params } = inputs;
  if (clearlyBadCursor(params.cursor)) {
    return { items: [] };
  }
  const res = await ctx.dataplane.feeds.getTimeline(
    params.hydrateCtx.viewer,
    params.limit,
    params.cursor,
  );

  return {
    items: res.items.map((item) => ({
      post: { uri: item.uri, cid: item.cid || undefined },
      repost: item.repost
        ? { uri: item.repost, cid: item.repostCid || undefined }
        : undefined,
    })),
    cursor: parseString(res.cursor),
  };
};

const hydration = (inputs: {
  ctx: Context;
  params: Params;
  skeleton: Skeleton;
}): Promise<HydrationState> => {
  const { ctx, params, skeleton } = inputs;
  return ctx.hydrator.hydrateFeedItems(skeleton.items, params.hydrateCtx);
};

const noBlocksOrMutes = (inputs: {
  ctx: Context;
  skeleton: Skeleton;
  hydration: HydrationState;
}): Skeleton => {
  const { ctx, skeleton, hydration } = inputs;
  skeleton.items = skeleton.items.filter((item) => {
    const bam = ctx.views.feedItemBlocksAndMutes(item, hydration);
    return !bam.authorBlocked &&
      !bam.authorMuted &&
      !bam.originatorBlocked &&
      !bam.originatorMuted;
  });
  return skeleton;
};

const presentation = (inputs: {
  ctx: Context;
  skeleton: Skeleton;
  hydration: HydrationState;
}) => {
  const { ctx, skeleton, hydration } = inputs;
  const feed = mapDefined(
    skeleton.items,
    (item) => ctx.views.feedViewPost(item, hydration),
  );
  return { feed, cursor: skeleton.cursor };
};

type Context = {
  hydrator: Hydrator;
  views: Views;
  dataplane: DataPlane;
};

type Params = QueryParams & { hydrateCtx: HydrateCtx & { viewer: string } };

type Skeleton = {
  items: FeedItem[];
  cursor?: string;
};
