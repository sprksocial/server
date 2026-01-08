import { mapDefined } from "@atp/common";
import { InvalidRequestError } from "@atp/xrpc-server";
import { AppContext } from "../../../../context.ts";
import { DataPlane } from "../../../../data-plane/index.ts";
import { FeedItem } from "../../../../hydration/feed.ts";
import {
  HydrateCtx,
  HydrationState,
  Hydrator,
  mergeManyStates,
} from "../../../../hydration/index.ts";
import { parseString } from "../../../../hydration/util.ts";
import { Server } from "../../../../lex/index.ts";
import { QueryParams } from "../../../../lex/types/so/sprk/feed/getActorLikes.ts";
import { createPipeline } from "../../../../pipeline.ts";
import { uriToDid as creatorFromUri } from "../../../../utils/uris.ts";
import { Views } from "../../../../views/index.ts";
import { clearlyBadCursor, resHeaders } from "../../../util.ts";

export default function (server: Server, ctx: AppContext) {
  const getActorReposts = createPipeline(
    skeleton,
    hydration,
    noPostBlocks,
    presentation,
  );
  server.so.sprk.feed.getActorReposts({
    auth: ctx.authVerifier.standardOptional,
    handler: async ({ params, auth, req }) => {
      const viewer = auth.credentials.iss;
      const labelers = ctx.reqLabelers(req);
      const hydrateCtx = await ctx.hydrator.createContext({ labelers, viewer });

      const result = await getActorReposts({ ...params, hydrateCtx }, ctx);

      const repoRev = await ctx.hydrator.actor.getRepoRevSafe(viewer);

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

const noPostBlocks = (inputs: {
  ctx: Context;
  skeleton: Skeleton;
  hydration: HydrationState;
}) => {
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
  skeleton.items = skeleton.items.filter((item) => {
    const creator = creatorFromUri(item.post.uri);
    // Check viewer <-> post author blocks
    if (ctx.views.viewerBlockExists(creator, hydration)) {
      return false;
    }
    // Check actor (reposter) <-> post author blocks
    if (actorBlocks?.get(creator)) {
      return false;
    }
    return true;
  });
  return skeleton;
};

const presentation = (inputs: {
  ctx: Context;
  skeleton: Skeleton;
  hydration: HydrationState;
}) => {
  const { ctx, skeleton, hydration } = inputs;
  const feed = mapDefined(
    skeleton.items,
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

type Params = QueryParams & { hydrateCtx: HydrateCtx };

type Skeleton = {
  actorDid: string;
  items: FeedItem[];
  cursor?: string;
};
