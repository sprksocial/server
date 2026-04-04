import { AppContext } from "../../../../context.ts";
import { DataPlane } from "../../../../data-plane/index.ts";
import { HydrateCtx, Hydrator } from "../../../../hydration/index.ts";
import { parseString } from "../../../../hydration/util.ts";
import { Server } from "../../../../lex/index.ts";
import { QueryParams } from "../../../../lex/types/so/sprk/actor/searchActors.ts";
import {
  createPipeline,
  filterSkeletonList,
  HydrationFnInput,
  mapSkeletonList,
  PresentationFnInput,
  RulesFnInput,
  SkeletonFnInput,
} from "../../../../pipeline.ts";
import { Views } from "../../../../views/index.ts";
import { createHydrateCtxFromAuth, resHeaders } from "../../../util.ts";

export default function (server: Server, ctx: AppContext) {
  const searchActors = createPipeline({
    skeleton,
    hydration,
    rules: noBlocks,
    presentation,
  });
  server.so.sprk.actor.searchActors({
    auth: ctx.authVerifier.standardOptional,
    handler: async ({ auth, params, req }) => {
      const cleanedQuery = params.q?.trim() ?? "";
      const labelers = ctx.reqLabelers(req);
      if (!cleanedQuery) {
        return {
          encoding: "application/json",
          body: {
            actors: [],
          },
          headers: resHeaders({ labelers }),
        };
      }

      const hydrateCtx = await createHydrateCtxFromAuth(ctx, req, auth);
      const results = await searchActors({
        ...params,
        q: cleanedQuery,
        hydrateCtx,
      }, ctx);
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
  const term = params.q?.trim() ?? "";
  if (!term) {
    return {
      dids: [],
    };
  }

  const res = await ctx.dataplane.search.actors(
    term,
    params.limit,
    params.cursor,
  );
  return {
    dids: res.dids,
    cursor: parseString(res.cursor),
  };
};

const hydration = async (
  inputs: HydrationFnInput<Context, Params, Skeleton>,
) => {
  const { ctx, params, skeleton } = inputs;
  return await ctx.hydrator.hydrateProfiles(skeleton.dids, params.hydrateCtx);
};

const noBlocks = (inputs: RulesFnInput<Context, Params, Skeleton>) => {
  const { ctx, skeleton, hydration } = inputs;
  return filterSkeletonList(
    skeleton,
    "dids",
    (did) => !ctx.views.viewerBlockExists(did, hydration),
  );
};

const presentation = (
  inputs: PresentationFnInput<Context, Params, Skeleton>,
) => {
  const { ctx, skeleton, hydration } = inputs;
  const actors = mapSkeletonList(
    skeleton,
    "dids",
    (did) => ctx.views.profile(did, hydration),
  );
  return {
    actors,
    cursor: skeleton.cursor,
  };
};

type Context = {
  dataplane: DataPlane;
  hydrator: Hydrator;
  views: Views;
};

type Params = QueryParams & { hydrateCtx: HydrateCtx };

type Skeleton = {
  dids: string[];
  hitsTotal?: number;
  cursor?: string;
};
