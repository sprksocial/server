import { Server } from "@atp/xrpc-server";

import { AppContext } from "../../../../context.ts";
import { DataPlane } from "../../../../data-plane/index.ts";
import { HydrateCtx, Hydrator } from "../../../../hydration/index.ts";
import * as so from "../../../../lex/so.ts";
import { $Params } from "../../../../lex/so/sprk/sound/getTrendingAudios.ts";
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
  const getTrendingAudios = createPipeline({
    skeleton,
    hydration,
    rules: noBlocks,
    presentation,
  });
  server.add(so.sprk.sound.getTrendingAudios, {
    auth: ctx.authVerifier.standardOptional,
    handler: async ({ params, auth, req }) => {
      const hydrateCtx = await createHydrateCtxFromAuth(ctx, req, auth);

      const results = await getTrendingAudios({ ...params, hydrateCtx }, ctx);

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
  const { limit = 25, cursor } = params;

  const result = await ctx.dataplane.sounds.getTrendingAudios(limit, cursor);

  return {
    audios: result.audios.map((a: { uri: string }) => a.uri),
    cursor: result.cursor,
  };
};

const hydration = (inputs: {
  ctx: Context;
  params: Params;
  skeleton: Skeleton;
}) => {
  const { ctx, params, skeleton } = inputs;
  return ctx.hydrator.hydrateSounds(skeleton.audios, params.hydrateCtx);
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
