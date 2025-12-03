import { mapDefined } from "@atp/common";
import { AppContext } from "../../../../context.ts";
import {
  HydrateCtx,
  HydrationState,
  Hydrator,
} from "../../../../hydration/index.ts";
import { Server } from "../../../../lex/index.ts";
import { QueryParams } from "../../../../lex/types/so/sprk/sound/getTrendingAudios.ts";
import { createPipeline } from "../../../../pipeline.ts";
import { uriToDid as creatorFromUri } from "../../../../utils/uris.ts";
import { Views } from "../../../../views/index.ts";
import { resHeaders } from "../../../util.ts";

export default function (server: Server, ctx: AppContext) {
  const getTrendingAudios = createPipeline(
    skeleton,
    hydration,
    noBlocks,
    presentation,
  );
  server.so.sprk.sound.getTrendingAudios({
    auth: ctx.authVerifier.standardOptional,
    handler: async ({ params, auth }) => {
      const viewer = auth.credentials.type === "standard"
        ? auth.credentials.iss
        : undefined;
      const hydrateCtx = ctx.hydrator.createContext({ viewer: viewer ?? null });

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

  let skip = 0;
  if (cursor) {
    const parsed = parseInt(cursor, 10);
    if (!isNaN(parsed) && parsed > 0) skip = parsed;
  }

  const docsPage = await ctx.db.models.Audio.find({})
    .sort({ useCount: -1, createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const uris = docsPage.map((a) => a.uri);

  let nextCursor: string | undefined;
  if (uris.length === limit) {
    nextCursor = (skip + limit).toString();
  }

  return { audios: uris, cursor: nextCursor };
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
    (uri) => ctx.views.soundView(uri, hydration),
  );
  return { audios, cursor: skeleton.cursor };
};

type Context = {
  db: AppContext["db"];
  hydrator: Hydrator;
  views: Views;
};

type Params = QueryParams & { hydrateCtx: HydrateCtx };

type Skeleton = {
  audios: string[];
  cursor?: string;
};
