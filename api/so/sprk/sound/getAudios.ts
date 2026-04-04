import { dedupeStrs } from "@atp/common";
import { AppContext } from "../../../../context.ts";
import { HydrateCtx, Hydrator } from "../../../../hydration/index.ts";
import { Server } from "../../../../lex/index.ts";
import { QueryParams } from "../../../../lex/types/so/sprk/sound/getAudios.ts";
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
  const getAudios = createPipeline({
    skeleton,
    hydration,
    rules: noBlocks,
    presentation,
  });
  server.so.sprk.sound.getAudios({
    auth: ctx.authVerifier.standardOptional,
    handler: async ({ params, auth, req }) => {
      const hydrateCtx = await createHydrateCtxFromAuth(ctx, req, auth);

      const results = await getAudios({ ...params, hydrateCtx }, ctx);

      return {
        encoding: "application/json",
        body: results,
        headers: resHeaders({}),
      };
    },
  });
}

const skeleton = (inputs: { params: Params }) => {
  return { audios: dedupeStrs(inputs.params.uris) };
};

const hydration = (inputs: {
  ctx: Context;
  params: Params;
  skeleton: Skeleton;
}) => {
  const { ctx, params, skeleton } = inputs;
  return ctx.hydrator.hydrateSounds(
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
  return { audios };
};

type Context = {
  hydrator: Hydrator;
  views: Views;
};

type Params = QueryParams & { hydrateCtx: HydrateCtx };

type Skeleton = {
  audios: string[];
};
