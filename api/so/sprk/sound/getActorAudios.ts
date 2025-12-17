import { mapDefined } from "@atp/common";
import { InvalidRequestError } from "@atp/xrpc-server";
import { AppContext } from "../../../../context.ts";
import { DataPlane } from "../../../../data-plane/index.ts";
import {
  HydrateCtx,
  HydrationState,
  Hydrator,
} from "../../../../hydration/index.ts";
import { Server } from "../../../../lex/index.ts";
import { QueryParams } from "../../../../lex/types/so/sprk/sound/getActorAudios.ts";
import { createPipeline } from "../../../../pipeline.ts";
import { uriToDid as creatorFromUri } from "../../../../utils/uris.ts";
import { Views } from "../../../../views/index.ts";
import { resHeaders } from "../../../util.ts";

export default function (server: Server, ctx: AppContext) {
  const getActorAudios = createPipeline(
    skeleton,
    hydration,
    noBlocks,
    presentation,
  );
  server.so.sprk.sound.getActorAudios({
    auth: ctx.authVerifier.standardOptional,
    handler: async ({ params, auth }) => {
      const viewer = auth.credentials.type === "standard"
        ? auth.credentials.iss
        : undefined;
      const hydrateCtx = ctx.hydrator.createContext({ viewer: viewer ?? null });

      const results = await getActorAudios({ ...params, hydrateCtx }, ctx);

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
  const { actor, limit = 50, cursor } = params;

  // Resolve handle to DID
  const actorDid = actor.startsWith("did:")
    ? actor
    : (await ctx.hydrator.actor.getDids([actor]))[0];

  if (!actorDid) {
    throw new InvalidRequestError("Could not resolve actor handle");
  }

  const result = await ctx.dataplane.sounds.getActorAudios(
    actorDid,
    limit,
    cursor,
  );

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

const noBlocks = (inputs: {
  ctx: Context;
  skeleton: Skeleton;
  hydration: HydrationState;
}) => {
  const { ctx, skeleton, hydration } = inputs;
  skeleton.audios = skeleton.audios.filter((uri) => {
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
  const audios = mapDefined(
    skeleton.audios,
    (uri) => ctx.views.sound(uri, hydration),
  );
  return { audios, cursor: skeleton.cursor };
};

type Context = {
  dataplane: DataPlane;
  hydrator: Hydrator;
  views: Views;
};

type Params = QueryParams & { hydrateCtx: HydrateCtx };

type Skeleton = {
  audios: string[];
  cursor?: string;
};
