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
    handler: async ({ params, auth }) => {
      const { viewer, includeTakedowns } = ctx.authVerifier.parseCreds(auth);
      const hydrateCtx = ctx.hydrator.createContext({
        viewer,
        includeTakedowns,
      });

      const result = await getAuthorFeed({ ...params, hydrateCtx }, ctx);

      const repoRev = await ctx.hydrator.actor.getRepoRevSafe(viewer);

      return {
        encoding: "application/json",
        body: result,
        headers: resHeaders({
          repoRev,
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
  const [did] = await ctx.hydrator.actor.getDids([params.actor]);
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
    repost: item.repost
      ? { uri: item.repost, cid: item.repostCid || undefined }
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

  if (skeleton.filter === "posts_and_author_threads") {
    // ensure replies are only included if the feed contains all
    // replies up to the thread root (i.e. a complete self-thread.)
    const selfThread = new SelfThreadTracker(skeleton.items, hydration);
    skeleton.items = skeleton.items.filter((item) => {
      return (
        checkBlocksAndMutes(item) &&
        (item.repost || item.authorPinned || selfThread.ok(item.post.uri))
      );
    });
  } else {
    skeleton.items = skeleton.items.filter(checkBlocksAndMutes);
  }

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

class SelfThreadTracker {
  feedUris = new Set<string>();
  cache = new Map<string, boolean>();

  constructor(
    items: FeedItem[],
    private hydration: HydrationState,
  ) {
    items.forEach((item) => {
      if (!item.repost) {
        this.feedUris.add(item.post.uri);
      }
    });
  }

  ok(uri: string, loop = new Set<string>()) {
    // if we've already checked this uri, pull from the cache
    if (this.cache.has(uri)) {
      return this.cache.get(uri) ?? false;
    }
    // loop detection
    if (loop.has(uri)) {
      this.cache.set(uri, false);
      return false;
    } else {
      loop.add(uri);
    }
    // cache through the result
    const result = this._ok(uri);
    this.cache.set(uri, result);
    return result;
  }

  private _ok(uri: string): boolean {
    // must be in the feed to be in a self-thread
    if (!this.feedUris.has(uri)) {
      return false;
    }
    // must be hydratable to be part of self-thread
    const post = this.hydration.posts?.get(uri);
    if (!post) {
      return false;
    }
    return true;
  }
}
