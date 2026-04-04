import { dedupeStrs } from "@atp/common";
import { AppContext } from "../../../../context.ts";
import { HydrateCtx, Hydrator } from "../../../../hydration/index.ts";
import { Server } from "../../../../lex/index.ts";
import { QueryParams } from "../../../../lex/types/so/sprk/feed/getPosts.ts";
import {
  createPipeline,
  filterSkeletonList,
  mapSkeletonList,
  type PresentationFnInput,
  type RulesFnInput,
} from "../../../../pipeline.ts";
import { uriToDid as creatorFromUri } from "../../../../utils/uris.ts";
import { Views } from "../../../../views/index.ts";
import { createHydrateCtxFromAuth, resHeaders } from "../../../util.ts";

export default function (server: Server, ctx: AppContext) {
  const getPosts = createPipeline({
    skeleton,
    hydration,
    rules: noBlocks,
    presentation,
  });
  server.so.sprk.feed.getPosts({
    auth: ctx.authVerifier.standardOptional,
    handler: async ({ params, auth, req }) => {
      const hydrateCtx = await createHydrateCtxFromAuth(ctx, req, auth);

      const results = await getPosts({ ...params, hydrateCtx }, ctx);

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

const skeleton = (inputs: { params: Params }) => {
  return { posts: dedupeStrs(inputs.params.uris) };
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

const noBlocks = (inputs: RulesFnInput<Context, Params, Skeleton>) => {
  const { ctx, skeleton, hydration } = inputs;
  return filterSkeletonList(
    skeleton,
    "posts",
    (uri) => !ctx.views.viewerBlockExists(creatorFromUri(uri), hydration),
  );
};

const presentation = (
  inputs: PresentationFnInput<Context, Params, Skeleton>,
) => {
  const { ctx, skeleton, hydration } = inputs;
  const posts = mapSkeletonList(
    skeleton,
    "posts",
    (uri) => ctx.views.post(uri, hydration),
  );
  return { posts };
};

type Context = {
  hydrator: Hydrator;
  views: Views;
};

type Params = QueryParams & { hydrateCtx: HydrateCtx };

type Skeleton = {
  posts: string[];
};
