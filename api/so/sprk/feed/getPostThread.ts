import { Server } from "@atp/xrpc-server";

import { ServerConfig } from "../../../../config.ts";
import { AppContext } from "../../../../context.ts";
import { DataPlane } from "../../../../data-plane/index.ts";
import { Code, isDataPlaneError } from "../../../../data-plane/util.ts";
import { HydrateCtx, Hydrator } from "../../../../hydration/index.ts";
import * as so from "../../../../lex/so.ts";
import {
  $OutputBody,
  $Params,
} from "../../../../lex/so/sprk/feed/getPostThread.ts";
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
  getThreadDepth,
  resHeaders,
} from "../../../util.ts";

export default function (server: Server, ctx: AppContext) {
  const getPostThread = createPipeline({
    skeleton,
    hydration,
    presentation,
  });
  server.add(so.sprk.feed.getPostThread, {
    auth: ctx.authVerifier.optionalStandardOrRole,
    handler: async ({ params, auth, req, res }) => {
      const hydrateCtx = await createHydrateCtxFromAuth(ctx, req, auth);

      // Start repoRev fetch early so it runs in parallel with the pipeline
      const repoRevPromise = ctx.hydrator.actor.getRepoRevSafe(
        hydrateCtx.viewer,
      );

      let result: $OutputBody;
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
  const depth = params.depth ?? 6;
  try {
    const res = await ctx.dataplane.threads.getThread(
      anchor,
      params.parentHeight,
      getThreadDepth({
        anchor,
        depth,
        maxThreadDepth: ctx.cfg.maxThreadDepth,
        bigThreadUris: ctx.cfg.bigThreadUris,
        bigThreadDepth: ctx.cfg.bigThreadDepth,
      }),
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
    depth: getThreadDepth({
      anchor: skeleton.anchor,
      depth: params.depth ?? 6,
      maxThreadDepth: ctx.cfg.maxThreadDepth,
      bigThreadUris: ctx.cfg.bigThreadUris,
      bigThreadDepth: ctx.cfg.bigThreadDepth,
    }),
  });
  return { thread };
};

type Context = {
  dataplane: DataPlane;
  hydrator: Hydrator;
  views: Views;
  cfg: ServerConfig;
};

type Params = $Params & { hydrateCtx: HydrateCtx };

type Skeleton = {
  anchor: string;
  uris: string[];
};
