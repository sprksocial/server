import { Server } from "@atp/xrpc-server";

import { ServerConfig } from "../../../../config.ts";
import { AppContext } from "../../../../context.ts";
import { DataPlane } from "../../../../data-plane/index.ts";
import { HydrateCtx, Hydrator } from "../../../../hydration/index.ts";
import { parseString } from "../../../../hydration/util.ts";
import * as so from "../../../../lex/so.ts";
import { $Params } from "../../../../lex/so/sprk/feed/searchPosts.ts";
import {
  createPipeline,
  filterSkeletonList,
  HydrationFnInput,
  mapSkeletonList,
  PresentationFnInput,
  RulesFnInput,
  SkeletonFnInput,
} from "../../../../pipeline.ts";
import { uriToDid as creatorFromUri } from "../../../../utils/uris.ts";
import { Views } from "../../../../views/index.ts";
import { createHydrateCtxFromAuth, resHeaders } from "../../../util.ts";

export default function (server: Server, ctx: AppContext) {
  const searchPosts = createPipeline({
    skeleton,
    hydration,
    rules: noBlocksOrTagged,
    presentation,
  });
  server.add(so.sprk.feed.searchPosts, {
    auth: ctx.authVerifier.standardOptional,
    handler: async ({ auth, params, req }) => {
      const hydrateCtx = await createHydrateCtxFromAuth(ctx, req, auth);
      const results = await searchPosts(
        { ...params, hydrateCtx },
        ctx,
      );
      return {
        encoding: "application/json",
        body: results,
        headers: resHeaders({
          labelers: hydrateCtx.labelers,
        }),
      };
    },
  });
}

const skeleton = async (inputs: SkeletonFnInput<Context, Params>) => {
  const { ctx, params } = inputs;
  const res = await ctx.dataplane.search.posts(
    params.q,
    params.limit,
    params.cursor,
  );
  return {
    posts: res.uris,
    cursor: parseString(res.cursor),
  };
};

const hydration = async (
  inputs: HydrationFnInput<Context, Params, Skeleton>,
) => {
  const { ctx, params, skeleton } = inputs;
  return await ctx.hydrator.hydratePosts(
    skeleton.posts.map((uri) => ({ uri })),
    params.hydrateCtx,
    undefined,
  );
};

const noBlocksOrTagged = (inputs: RulesFnInput<Context, Params, Skeleton>) => {
  const { ctx, params, skeleton, hydration } = inputs;

  return filterSkeletonList(skeleton, "posts", (uri) => {
    const post = hydration.posts?.get(uri);
    if (!post) return false;

    const creator = creatorFromUri(uri);
    const isPostByViewer = creator === params.hydrateCtx.viewer;

    // Cases to always show.
    if (isPostByViewer) return true;

    // Cases to never show.
    if (ctx.views.viewerBlockExists(creator, hydration)) return false;
    return true;
  });
};

const presentation = (
  inputs: PresentationFnInput<Context, Params, Skeleton>,
) => {
  const { ctx, skeleton, hydration } = inputs;
  const posts = mapSkeletonList(skeleton, "posts", (uri) => {
    const post = hydration.posts?.get(uri);
    if (!post) return;

    return ctx.views.post(uri, hydration);
  });
  return {
    posts,
    cursor: skeleton.cursor,
    hitsTotal: skeleton.hitsTotal,
  };
};

type Context = {
  cfg: ServerConfig;
  dataplane: DataPlane;
  hydrator: Hydrator;
  views: Views;
};

type Params = $Params & {
  hydrateCtx: HydrateCtx;
};

type Skeleton = {
  posts: string[];
  hitsTotal?: number;
  cursor?: string;
};
