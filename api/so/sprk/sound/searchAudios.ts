import { Server } from "@atp/xrpc-server";

import { AppContext } from "../../../../context.ts";
import { DataPlane } from "../../../../data-plane/index.ts";
import { HydrateCtx, Hydrator } from "../../../../hydration/index.ts";
import { parseString } from "../../../../hydration/util.ts";
import * as so from "../../../../lex/so.ts";
import { $Params } from "../../../../lex/so/sprk/sound/searchAudios.ts";
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
  const searchAudios = createPipeline({
    skeleton,
    hydration,
    rules: noBlocks,
    presentation,
  });

  server.add(so.sprk.sound.searchAudios, {
    auth: ctx.authVerifier.standardOptional,
    handler: async ({ auth, params, req }) => {
      const cleanedQuery = params.q.trim();
      const labelers = ctx.reqLabelers(req);
      if (!cleanedQuery) {
        return {
          encoding: "application/json",
          body: {
            audios: [],
          },
          headers: resHeaders({ labelers }),
        };
      }

      const hydrateCtx = await createHydrateCtxFromAuth(ctx, req, auth);

      const results = await searchAudios({
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
  const result = await ctx.dataplane.sounds.searchAudios(
    params.q,
    params.limit,
    params.cursor,
  );

  return {
    audios: result.audios.map((audio) => audio.uri),
    cursor: parseString(result.cursor),
  };
};

const hydration = async (
  inputs: HydrationFnInput<Context, Params, Skeleton>,
) => {
  const { ctx, params, skeleton } = inputs;
  return await ctx.hydrator.hydrateSounds(
    skeleton.audios,
    params.hydrateCtx,
  );
};

const noBlocks = (inputs: RulesFnInput<Context, Params, Skeleton>) => {
  const { ctx, skeleton, hydration } = inputs;
  return filterSkeletonList(
    skeleton,
    "audios",
    (uri) => !ctx.views.viewerBlockExists(creatorFromUri(uri), hydration),
  );
};

const presentation = (
  inputs: PresentationFnInput<Context, Params, Skeleton>,
) => {
  const { ctx, skeleton, hydration } = inputs;
  const audios = mapSkeletonList(
    skeleton,
    "audios",
    (uri) => ctx.views.sound(uri, hydration),
  );
  return { audios, cursor: skeleton.cursor };
};

type Context = {
  dataplane: DataPlane;
  hydrator: Hydrator;
  views: Views;
};

type Params = $Params & { hydrateCtx: HydrateCtx };

type Skeleton = {
  audios: string[];
  cursor?: string;
};
