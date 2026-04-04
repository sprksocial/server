import { InvalidRequestError } from "@atp/xrpc-server";
import { ServerConfig } from "../../../../config.ts";
import { AppContext } from "../../../../context.ts";
import { DataPlane } from "../../../../data-plane/index.ts";
import { Code, isDataPlaneError } from "../../../../data-plane/util.ts";
import { HydrateCtx, Hydrator } from "../../../../hydration/index.ts";
import { Server } from "../../../../lex/index.ts";
import { isNotFoundPost } from "../../../../lex/types/app/bsky/feed/defs.ts";
import {
  OutputSchema,
  QueryParams,
} from "../../../../lex/types/so/sprk/feed/getPostThread.ts";
import {
  createPipeline,
  HydrationFnInput,
  PresentationFnInput,
  SkeletonFnInput,
} from "../../../../pipeline.ts";
import { Views } from "../../../../views/index.ts";
import {
  ATPROTO_REPO_REV,
  createHydrateCtxFromAuth,
  resHeaders,
} from "../../../util.ts";

export default function (server: Server, ctx: AppContext) {
  const getPostThread = createPipeline({
    skeleton,
    hydration,
    presentation,
  });
  server.so.sprk.feed.getPostThread({
    auth: ctx.authVerifier.optionalStandardOrRole,
    handler: async ({ params, auth, req, res }) => {
      const hydrateCtx = await createHydrateCtxFromAuth(ctx, req, auth);

      // Start repoRev fetch early so it runs in parallel with the pipeline
      const repoRevPromise = ctx.hydrator.actor.getRepoRevSafe(
        hydrateCtx.viewer,
      );

      let result: OutputSchema;
      try {
        result = await getPostThread({ ...params, hydrateCtx }, ctx);
      } catch (err) {
        const repoRev = await repoRevPromise;
        if (repoRev) {
          res.headers.set(ATPROTO_REPO_REV, repoRev);
        }
        throw err;
      }

      const repoRev = await repoRevPromise;

      return {
        encoding: "application/json",
        body: result,
        headers: resHeaders({
          repoRev,
        }),
      };
    },
  });
}

const skeleton = async (inputs: SkeletonFnInput<Context, Params>) => {
  const { ctx, params } = inputs;
  const anchor = await ctx.hydrator.resolveUri(params.anchor);
  try {
    const res = await ctx.dataplane.threads.getThread(
      anchor,
      params.parentHeight,
      getDepth(ctx, anchor, params),
    );
    return {
      anchor,
      uris: res.uris,
    };
  } catch (err) {
    if (isDataPlaneError(err, Code.NotFound)) {
      return {
        anchor,
        uris: [],
      };
    } else {
      throw err;
    }
  }
};

const hydration = (
  inputs: HydrationFnInput<Context, Params, Skeleton>,
) => {
  const { ctx, params, skeleton } = inputs;
  return ctx.hydrator.hydrateThreadPosts(
    skeleton.uris.map((uri) => ({ uri })),
    params.hydrateCtx,
  );
};

const presentation = (
  inputs: PresentationFnInput<Context, Params, Skeleton>,
) => {
  const { ctx, params, skeleton, hydration } = inputs;
  const thread = ctx.views.thread(skeleton, hydration, {
    depth: getDepth(ctx, skeleton.anchor, params),
  });
  if (isNotFoundPost(thread)) {
    // @TODO technically this could be returned as a NotFoundPost based on lexicon
    throw new InvalidRequestError(
      `Post not found: ${skeleton.anchor}`,
      "NotFound",
    );
  }
  return { thread };
};

type Context = {
  dataplane: DataPlane;
  hydrator: Hydrator;
  views: Views;
  cfg: ServerConfig;
};

type Params = QueryParams & { hydrateCtx: HydrateCtx };

type Skeleton = {
  anchor: string;
  uris: string[];
};

const getDepth = (ctx: Context, anchor: string, params: Params) => {
  let maxDepth = ctx.cfg.maxThreadDepth;
  if (ctx.cfg.bigThreadUris.has(anchor) && ctx.cfg.bigThreadDepth) {
    maxDepth = ctx.cfg.bigThreadDepth;
  }
  return maxDepth ? Math.min(maxDepth, params.depth) : params.depth;
};
