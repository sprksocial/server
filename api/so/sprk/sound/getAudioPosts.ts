import { InvalidRequestError, Server } from "@atp/xrpc-server";

import { AppContext } from "../../../../context.ts";
import { DataPlane } from "../../../../data-plane/index.ts";
import {
  HydrateCtx,
  Hydrator,
  mergeManyStates,
} from "../../../../hydration/index.ts";
import * as so from "../../../../lex/so.ts";
import { $Params } from "../../../../lex/so/sprk/sound/getAudioPosts.ts";
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
  const getAudioPosts = createPipeline({
    skeleton,
    hydration,
    rules: noBlocks,
    presentation,
  });
  server.add(so.sprk.sound.getAudioPosts, {
    auth: ctx.authVerifier.standardOptional,
    handler: async ({ params, auth, req }) => {
      const hydrateCtx = await createHydrateCtxFromAuth(ctx, req, auth);

      const results = await getAudioPosts({ ...params, hydrateCtx }, ctx);

      return {
        encoding: "application/json",
        body: results,
        headers: resHeaders({ labelers: hydrateCtx.labelers }),
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

const noBlocks = (inputs: RulesFnInput<Context, Params, Skeleton>) => {
  const { ctx, skeleton, hydration } = inputs;
  return filterSkeletonList(
    skeleton,
    "posts",
    (uri) => !ctx.views.viewerBlockExists(creatorFromUri(uri), hydration),
  );
};

const presentation = (
  inputs: PresentationFnInput<Context, Params, Skeleton>,
) => {
  const { ctx, skeleton, hydration } = inputs;
  const posts = mapSkeletonList(
    skeleton,
    "posts",
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

type Params = $Params & { hydrateCtx: HydrateCtx };

type Skeleton = {
  posts: string[];
  audioUri: string;
  cursor?: string;
};
