import { dedupeStrs, mapDefined } from "@atproto/common";
import { AppContext } from "../../../../main.ts";
import {
  HydrateCtx,
  HydrationState,
  Hydrator,
} from "../../../../hydration/index.ts";
import { Server } from "../../../../lex/index.ts";
import { QueryParams } from "../../../../lex/types/so/sprk/feed/getPosts.ts";
import { createPipeline } from "../../../../pipeline.ts";
import { uriToDid as creatorFromUri } from "../../../../utils/uris.ts";
import { Views } from "../../../../views/index.ts";
import { resHeaders } from "../../../util.ts";

export default function (server: Server, ctx: AppContext) {
  const getPosts = createPipeline(skeleton, hydration, noBlocks, presentation);
  server.so.sprk.feed.getPosts({
    auth: ctx.authVerifier.standardOptional,
    handler: async ({ params, auth }) => {
      const viewer = auth.credentials.iss;
      const hydrateCtx = ctx.hydrator.createContext({ viewer });

      const results = await getPosts({ ...params, hydrateCtx }, ctx);

      return {
        encoding: "application/json",
        body: results,
        headers: resHeaders({}),
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
