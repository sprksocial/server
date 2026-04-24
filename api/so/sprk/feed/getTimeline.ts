import { Server } from "@atp/xrpc-server";

import { AppContext } from "../../../../context.ts";
import { DataPlane } from "../../../../data-plane/index.ts";
import { FeedItem } from "../../../../hydration/feed.ts";
import {
  HydrateCtx,
  HydrationState,
  Hydrator,
} from "../../../../hydration/index.ts";
import { parseString } from "../../../../hydration/util.ts";
import * as so from "../../../../lex/so.ts";
import { $Params } from "../../../../lex/so/sprk/feed/getTimeline.ts";
import {
  createPipeline,
  filterSkeletonList,
  mapSkeletonList,
} from "../../../../pipeline.ts";
import { Views } from "../../../../views/index.ts";
import {
  clearlyBadCursor,
  createHydrateCtxFromAuth,
  resHeaders,
} from "../../../util.ts";

export default function (server: Server, ctx: AppContext) {
  const getTimeline = createPipeline({
    skeleton,
    hydration,
    rules: noBlocksOrMutes,
    presentation,
  });
  server.add(so.sprk.feed.getTimeline, {
    auth: ctx.authVerifier.standard,
    handler: async ({ params, auth, req }) => {
      const viewer = auth.credentials.iss;
      const hydrateCtx = await createHydrateCtxFromAuth(
        ctx,
        req,
        auth,
        { viewer },
      );

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
  return filterSkeletonList(skeleton, "items", (item) => {
    const bam = ctx.views.feedItemBlocksAndMutes(item, hydration);
    return !bam.authorBlocked &&
      !bam.authorMuted;
  });
};

const presentation = (inputs: {
  ctx: Context;
  skeleton: Skeleton;
  hydration: HydrationState;
}) => {
  const { ctx, skeleton, hydration } = inputs;
  const feed = mapSkeletonList(
    skeleton,
    "items",
    (item) => ctx.views.feedViewPost(item, hydration),
  );
  return { feed, cursor: skeleton.cursor };
};

type Context = {
  hydrator: Hydrator;
  views: Views;
  dataplane: DataPlane;
};

type Params = $Params & { hydrateCtx: HydrateCtx & { viewer: string } };

type Skeleton = {
  items: FeedItem[];
  cursor?: string;
};
