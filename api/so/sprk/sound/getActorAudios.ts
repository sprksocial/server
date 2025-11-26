import { mapDefined } from "@atp/common";
import { decodeBase64, encodeBase64 } from "@std/encoding";
import { AppContext } from "../../../../context.ts";
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
import { InvalidRequestError } from "@atp/xrpc-server";

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
  let actorDid = actor;
  if (!actor.startsWith("did:")) {
    try {
      const didDoc = await ctx.idResolver.did.resolveAtprotoData(actor);
      actorDid = didDoc.did;
    } catch {
      throw new InvalidRequestError("Could not resolve actor handle");
    }
  }

  // Parse cursor
  let cursorData: CursorData | undefined;
  if (cursor) {
    try {
      cursorData = parseCursor(cursor);
    } catch {
      throw new InvalidRequestError("The provided cursor is invalid");
    }
  }

  // Build query
  const query: Record<string, unknown> = { authorDid: actorDid };
  if (cursorData) {
    query.$or = [
      { createdAt: { $lt: cursorData.createdAt } },
      { createdAt: cursorData.createdAt, _id: { $lt: cursorData.id } },
    ];
  }

  const audios = await ctx.db.models.Audio.find(query)
    .sort({ createdAt: -1, _id: -1 })
    .limit(limit + 1);

  const hasMore = audios.length > limit;
  if (hasMore) audios.pop();

  const uris = audios.map((a) => a.uri);

  let nextCursor: string | undefined;
  if (hasMore && audios.length > 0) {
    const last = audios[audios.length - 1];
    nextCursor = generateCursor(String(last.createdAt), String(last._id));
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

interface CursorData {
  createdAt: string;
  id: string;
}

function parseCursor(cursor: string): CursorData {
  const decoded = new TextDecoder().decode(decodeBase64(cursor));
  const [createdAt, id] = decoded.split("::");
  if (!createdAt || !id) throw new Error("Invalid cursor format");
  return { createdAt, id };
}

function generateCursor(createdAt: string, id: string): string {
  return encodeBase64(new TextEncoder().encode(`${createdAt}::${id}`));
}

type Context = {
  db: AppContext["db"];
  idResolver: AppContext["idResolver"];
  hydrator: Hydrator;
  views: Views;
};

type Params = QueryParams & { hydrateCtx: HydrateCtx };

type Skeleton = {
  audios: string[];
  cursor?: string;
};
