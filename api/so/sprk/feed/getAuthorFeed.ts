import { mapDefined } from "@atp/common";
import { InvalidRequestError } from "@atp/xrpc-server";
import { AppContext } from "../../../../context.ts";
import { DataPlane } from "../../../../data-plane/index.ts";
import { Actor } from "../../../../hydration/actor.ts";
import { FeedItem } from "../../../../hydration/feed.ts";
import {
  HydrateCtx,
  HydrationState,
  Hydrator,
  mergeStates,
} from "../../../../hydration/index.ts";
import { parseString } from "../../../../hydration/util.ts";
import { Server } from "../../../../lex/index.ts";
import { QueryParams } from "../../../../lex/types/so/sprk/feed/getAuthorFeed.ts";
import { createPipeline } from "../../../../pipeline.ts";
import { safePinnedPost, uriToDid } from "../../../../utils/uris.ts";
import { Views } from "../../../../views/index.ts";
import { clearlyBadCursor, resHeaders } from "../../../util.ts";

export default function (server: Server, ctx: AppContext) {
  const getAuthorFeed = createPipeline(
    skeleton,
    hydration,
    noBlocksOrMutedReposts,
    presentation,
  );
  server.so.sprk.feed.getAuthorFeed({
    auth: ctx.authVerifier.optionalStandardOrRole,
    handler: async ({ params, auth, req }) => {
      const { viewer, includeTakedowns } = ctx.authVerifier.parseCreds(auth);
      const labelers = ctx.reqLabelers(req);
      const hydrateCtx = await ctx.hydrator.createContext({
        labelers,
        viewer,
        includeTakedowns,
      });

      // Parallelize pipeline execution with repoRev fetch
      const [result, repoRev] = await Promise.all([
        getAuthorFeed({ ...params, hydrateCtx }, ctx),
        ctx.hydrator.actor.getRepoRevSafe(viewer),
      ]);

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

export const skeleton = async (inputs: {
  ctx: Context;
  params: Params;
}): Promise<Skeleton> => {
  const { ctx, params } = inputs;

  // Skip DID lookup if params.actor is already a DID
  const did = params.actor.startsWith("did:")
    ? params.actor
    : (await ctx.hydrator.actor.getDids([params.actor]))[0];

  if (!did) {
    throw new InvalidRequestError("Profile not found");
  }
  const actors = await ctx.hydrator.actor.getActors([did], {
    includeTakedowns: params.hydrateCtx.includeTakedowns,
  });
  const actor = actors.get(did);
  if (!actor) {
    throw new InvalidRequestError("Profile not found");
  }
  if (clearlyBadCursor(params.cursor)) {
    return { actor, filter: params.filter, items: [] };
  }

  const pinnedPost = safePinnedPost(actor.profile?.pinnedPost);
  const isFirstPageRequest = !params.cursor;
  const shouldInsertPinnedPost = isFirstPageRequest &&
    params.includePins &&
    pinnedPost &&
    uriToDid(pinnedPost.uri) === actor.did;

  const res = await ctx.dataplane.feeds.getAuthorFeed(
    did,
    params.limit,
    params.cursor,
  );

  let items: FeedItem[] = res.items.map((item) => ({
    post: { uri: item.uri, cid: item.cid || undefined },
    reposts: item.repost
      ? [{ uri: item.repost, cid: item.repostCid || undefined }]
      : undefined,
  }));

  if (shouldInsertPinnedPost && pinnedPost) {
    const pinnedItem = {
      post: {
        uri: pinnedPost.uri,
        cid: pinnedPost.cid,
      },
      authorPinned: true,
    };

    items = items.filter((item) => item.post.uri !== pinnedItem.post.uri);
    items.unshift(pinnedItem);
  }

  return {
    actor,
    filter: params.filter,
    items,
    cursor: parseString(res.cursor),
  };
};

const hydration = async (inputs: {
  ctx: Context;
  params: Params;
  skeleton: Skeleton;
}): Promise<HydrationState> => {
  const { ctx, params, skeleton } = inputs;
  const [feedPostState, profileViewerState] = await Promise.all([
    ctx.hydrator.hydrateFeedItems(skeleton.items, params.hydrateCtx),
    ctx.hydrator.hydrateProfileViewers([skeleton.actor.did], params.hydrateCtx),
  ]);
  return mergeStates(feedPostState, profileViewerState);
};

const noBlocksOrMutedReposts = (inputs: {
  ctx: Context;
  skeleton: Skeleton;
  hydration: HydrationState;
}): Skeleton => {
  const { ctx, skeleton, hydration } = inputs;
  const relationship = hydration.profileViewers?.get(skeleton.actor.did);
  if (relationship && relationship.blocking) {
    throw new InvalidRequestError(
      `Requester has blocked actor: ${skeleton.actor.did}`,
      "BlockedActor",
    );
  }
  if (relationship && relationship.blockedBy) {
    throw new InvalidRequestError(
      `Requester is blocked by actor: ${skeleton.actor.did}`,
      "BlockedByActor",
    );
  }

  const checkBlocksAndMutes = (item: FeedItem) => {
    const bam = ctx.views.feedItemBlocksAndMutes(item, hydration);
    return (
      !bam.authorBlocked &&
      !bam.originatorBlocked &&
      (!bam.authorMuted || bam.originatorMuted) // repost of muted content
    );
  };

  skeleton.items = skeleton.items.filter(checkBlocksAndMutes);

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
  return { feed, cursor: skeleton.cursor };
};

type Context = {
  hydrator: Hydrator;
  views: Views;
  dataplane: DataPlane;
};

type Params = QueryParams & {
  hydrateCtx: HydrateCtx;
};

type Skeleton = {
  actor: Actor;
  items: FeedItem[];
  filter: QueryParams["filter"];
  cursor?: string;
};
