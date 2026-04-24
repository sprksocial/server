import { InvalidRequestError, Server } from "@atp/xrpc-server";

import { AppContext } from "../../../../context.ts";
import { DataPlane } from "../../../../data-plane/index.ts";
import { FeedItem } from "../../../../hydration/feed.ts";
import {
  HydrateCtx,
  Hydrator,
  mergeManyStates,
} from "../../../../hydration/index.ts";
import { parseString } from "../../../../hydration/util.ts";
import * as so from "../../../../lex/so.ts";
import { $Params } from "../../../../lex/so/sprk/feed/getActorReposts.ts";
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
  const getActorReposts = createPipeline({
    skeleton,
    hydration,
    rules: noPostBlocks,
    presentation,
  });
  server.add(so.sprk.feed.getActorReposts, {
    auth: ctx.authVerifier.standardOptional,
    handler: async ({ params, auth, req }) => {
      const hydrateCtx = await createHydrateCtxFromAuth(ctx, req, auth);

      const result = await getActorReposts({ ...params, hydrateCtx }, ctx);

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
  if (clearlyBadCursor(cursor)) {
    return { actorDid: "", items: [] };
  }
  const [actorDid] = await ctx.hydrator.actor.getDids([actor]);
  if (!actorDid) {
    throw new InvalidRequestError("Profile not found");
  }

  const repostsRes = await ctx.dataplane.reposts.getActor(
    actorDid,
    limit,
    cursor,
  );

  const items = repostsRes.reposts.map((r) => ({ post: { uri: r.subject } }));

  return {
    actorDid,
    items,
    cursor: parseString(repostsRes.cursor),
  };
};

const hydration = async (inputs: {
  ctx: Context;
  params: Params;
  skeleton: Skeleton;
}) => {
  const { ctx, params, skeleton } = inputs;

  // Build map for bidirectional block checking between actor (reposter) and post authors
  const postAuthorDids = skeleton.items.map((item) =>
    creatorFromUri(item.post.uri)
  );
  const actorToAuthorsMap = new Map<string, string[]>();
  if (skeleton.actorDid && postAuthorDids.length > 0) {
    // Filter out self-reposts (actor reposting their own posts)
    const otherAuthorDids = postAuthorDids.filter((did) =>
      did !== skeleton.actorDid
    );
    if (otherAuthorDids.length > 0) {
      actorToAuthorsMap.set(skeleton.actorDid, otherAuthorDids);
    }
  }

  const [feedItemsState, actorViewerState, actorAuthorBlocks] = await Promise
    .all([
      ctx.hydrator.hydrateFeedItems(skeleton.items, params.hydrateCtx),
      ctx.hydrator.hydrateProfileViewers(
        [skeleton.actorDid],
        params.hydrateCtx,
      ),
      ctx.hydrator.hydrateBidirectionalBlocks(actorToAuthorsMap),
    ]);
  return mergeManyStates(feedItemsState, actorViewerState, {
    bidirectionalBlocks: actorAuthorBlocks,
  });
};

const noPostBlocks = (inputs: RulesFnInput<Context, Params, Skeleton>) => {
  const { ctx, skeleton, hydration } = inputs;

  // Check if viewer is blocking or blocked by the actor (reposter)
  const actorRelationship = hydration.profileViewers?.get(skeleton.actorDid);
  if (actorRelationship?.blocking) {
    throw new InvalidRequestError(
      `Requester has blocked actor: ${skeleton.actorDid}`,
      "BlockedActor",
    );
  }
  if (actorRelationship?.blockedBy) {
    throw new InvalidRequestError(
      `Requester is blocked by actor: ${skeleton.actorDid}`,
      "BlockedByActor",
    );
  }

  // Filter out posts where:
  // - viewer is blocking or blocked by the post author, OR
  // - actor (reposter) is blocking or blocked by the post author
  const actorBlocks = hydration.bidirectionalBlocks?.get(skeleton.actorDid);
  return filterSkeletonList(skeleton, "items", (item) => {
    const creator = creatorFromUri(item.post.uri);
    if (ctx.views.viewerBlockExists(creator, hydration)) {
      return false;
    }
    if (actorBlocks?.get(creator)) {
      return false;
    }
    return true;
  });
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
  actorDid: string;
  items: FeedItem[];
  cursor?: string;
};
