import { mapDefined } from "@atp/common";
import { InvalidRequestError } from "@atp/xrpc-server";
import { AppContext } from "../../../../context.ts";
import { DataPlane } from "../../../../data-plane/index.ts";
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

  // Check if audio exists
  const audio = await ctx.dataplane.sounds.getAudio(uri);
  if (!audio) {
    throw new InvalidRequestError("Audio not found", "NotFound");
  }

  const result = await ctx.dataplane.sounds.getAudioPosts(uri, limit, cursor);

  return { posts: result.posts, audioUri: uri, cursor: result.cursor };
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
  const audio = ctx.views.sound(skeleton.audioUri, hydration);

  return { audio: audio!, posts, cursor: skeleton.cursor };
};

type Context = {
  dataplane: DataPlane;
  hydrator: Hydrator;
  views: Views;
};

type Params = QueryParams & { hydrateCtx: HydrateCtx };

type Skeleton = {
  posts: string[];
  audioUri: string;
  cursor?: string;
};
