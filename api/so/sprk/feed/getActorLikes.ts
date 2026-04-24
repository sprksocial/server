import { InvalidRequestError, Server } from "@atp/xrpc-server";

import { AppContext } from "../../../../context.ts";
import { DataPlane } from "../../../../data-plane/index.ts";
import { FeedItem } from "../../../../hydration/feed.ts";
import { HydrateCtx, Hydrator } from "../../../../hydration/index.ts";
import { parseString } from "../../../../hydration/util.ts";
import * as so from "../../../../lex/so.ts";
import { $Params } from "../../../../lex/so/sprk/feed/getActorLikes.ts";
import {
  createPipeline,
  filterSkeletonList,
  mapSkeletonList,
  type PresentationFnInput,
  type RulesFnInput,
} from "../../../../pipeline.ts";
import { uriToDid as creatorFromUri } from "../../../../utils/uris.ts";
import { Views } from "../../../../views/index.ts";
import {
  clearlyBadCursor,
  createHydrateCtxFromAuth,
  resHeaders,
} from "../../../util.ts";

export default function (server: Server, ctx: AppContext) {
  const getActorLikes = createPipeline({
    skeleton,
    hydration,
    rules: noPostBlocks,
    presentation,
  });
  server.add(so.sprk.feed.getActorLikes, {
    auth: ctx.authVerifier.standardOptional,
    handler: async ({ params, auth, req }) => {
      const hydrateCtx = await createHydrateCtxFromAuth(ctx, req, auth);

      const result = await getActorLikes({ ...params, hydrateCtx }, ctx);

      const repoRev = await ctx.hydrator.actor.getRepoRevSafe(
        hydrateCtx.viewer,
      );

      return {
        encoding: "application/json",
        body: result,
        headers: resHeaders({
          repoRev,
          labelers: hydrateCtx.labelers,
        }),
      };
    },
  });
}

const skeleton = async (inputs: {
  ctx: Context;
  params: Params;
}): Promise<Skeleton> => {
  const { ctx, params } = inputs;
  const { actor, limit, cursor } = params;
  const viewer = params.hydrateCtx.viewer;
  if (clearlyBadCursor(cursor)) {
    return { items: [] };
  }
  const [actorDid] = await ctx.hydrator.actor.getDids([actor]);
  if (!actorDid || !viewer || viewer !== actorDid) {
    throw new InvalidRequestError("Profile not found");
  }

  const likesRes = await ctx.dataplane.likes.getActor(actorDid, limit, cursor);

  const items = likesRes.likes.map((l) => ({ post: { uri: l.subject } }));

  return {
    items,
    cursor: parseString(likesRes.cursor),
  };
};

const hydration = async (inputs: {
  ctx: Context;
  params: Params;
  skeleton: Skeleton;
}) => {
  const { ctx, params, skeleton } = inputs;
  return await ctx.hydrator.hydrateFeedItems(skeleton.items, params.hydrateCtx);
};

const noPostBlocks = (inputs: RulesFnInput<Context, Params, Skeleton>) => {
  const { ctx, skeleton, hydration } = inputs;
  return filterSkeletonList(
    skeleton,
    "items",
    (item) =>
      !ctx.views.viewerBlockExists(creatorFromUri(item.post.uri), hydration),
  );
};

const presentation = (
  inputs: PresentationFnInput<Context, Params, Skeleton>,
) => {
  const { ctx, skeleton, hydration } = inputs;
  const feed = mapSkeletonList(
    skeleton,
    "items",
    (item) => ctx.views.feedViewPost(item, hydration),
  );
  return {
    feed,
    cursor: skeleton.cursor,
  };
};

type Context = {
  hydrator: Hydrator;
  views: Views;
  dataplane: DataPlane;
};

type Params = $Params & { hydrateCtx: HydrateCtx };

type Skeleton = {
  items: FeedItem[];
  cursor?: string;
};
