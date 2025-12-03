import { mapDefined } from "@atp/common";
import { decodeBase64, encodeBase64 } from "@std/encoding";
import { AppContext } from "../../../../context.ts";
import {
  HydrateCtx,
  HydrationState,
  Hydrator,
  mergeManyStates,
} from "../../../../hydration/index.ts";
import { Server } from "../../../../lex/index.ts";
import { QueryParams } from "../../../../lex/types/so/sprk/sound/getAudioPosts.ts";
import { createPipeline } from "../../../../pipeline.ts";
import { uriToDid as creatorFromUri } from "../../../../utils/uris.ts";
import { Views } from "../../../../views/index.ts";
import { resHeaders } from "../../../util.ts";
import { InvalidRequestError } from "@atp/xrpc-server";
import { RootFilterQuery } from "mongoose";
import { PostDocument } from "../../../../data-plane/db/models.ts";

export default function (server: Server, ctx: AppContext) {
  const getAudioPosts = createPipeline(
    skeleton,
    hydration,
    noBlocks,
    presentation,
  );
  server.so.sprk.sound.getAudioPosts({
    auth: ctx.authVerifier.standardOptional,
    handler: async ({ params, auth }) => {
      const viewer = auth.credentials.type === "standard"
        ? auth.credentials.iss
        : undefined;
      const hydrateCtx = ctx.hydrator.createContext({ viewer: viewer ?? null });

      const results = await getAudioPosts({ ...params, hydrateCtx }, ctx);

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
  const { uri, limit = 50, cursor } = params;

  const dbAudio = await ctx.db.models.Audio.findOne({
    uri: uri,
  }).exec();

  if (!dbAudio) {
    throw new InvalidRequestError("Audio not found", "NotFound");
  }

  let cursorData: CursorData | undefined;
  if (cursor) {
    try {
      cursorData = parseCursor(cursor);
    } catch {
      throw new InvalidRequestError("The provided cursor is invalid");
    }
  }

  const query: RootFilterQuery<PostDocument> = {
    "sound.uri": uri,
    reply: null,
  };

  if (cursorData) {
    query.$or = [
      { createdAt: { $lt: cursorData.createdAt } },
      { createdAt: cursorData.createdAt, _id: { $lt: cursorData.id } },
    ];
  }

  const posts = await ctx.db.models.Post
    .find(query)
    .sort({ createdAt: -1, _id: -1 })
    .limit(limit + 1);

  const hasMore = posts.length > limit;
  if (hasMore) posts.pop();

  const postUris = posts.map((p) => p.uri);

  let nextCursor: string | undefined;
  if (hasMore && posts.length > 0) {
    const last = posts[posts.length - 1];
    nextCursor = generateCursor(String(last.createdAt), String(last._id));
  }

  return { posts: postUris, audioUri: uri, cursor: nextCursor };
};

const hydration = async (inputs: {
  ctx: Context;
  params: Params;
  skeleton: Skeleton;
}) => {
  const { ctx, params, skeleton } = inputs;
  const [postState, soundState] = await Promise.all([
    ctx.hydrator.hydratePosts(
      skeleton.posts.map((uri) => ({ uri })),
      params.hydrateCtx,
    ),
    ctx.hydrator.hydrateSounds([skeleton.audioUri], params.hydrateCtx),
  ]);
  return mergeManyStates(postState, soundState);
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
  const audio = ctx.views.soundView(skeleton.audioUri, hydration);

  // If audio hydration failed, return stub or empty?
  // The schema likely requires the audio field.
  // If hydration fails, soundView returns undefined.
  // We should probably handle this, but since we checked existence in skeleton, it implies DB record exists.
  // Views handles it.

  return { audio: audio!, posts, cursor: skeleton.cursor };
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
  hydrator: Hydrator;
  views: Views;
};

type Params = QueryParams & { hydrateCtx: HydrateCtx };

type Skeleton = {
  posts: string[];
  audioUri: string;
  cursor?: string;
};
