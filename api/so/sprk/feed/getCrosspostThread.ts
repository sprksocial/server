import type { AtUriString, CidString, DatetimeString } from "@atp/lex";
import { InvalidRequestError, Server } from "@atp/xrpc-server";

import { ServerConfig } from "../../../../config.ts";
import { AppContext } from "../../../../context.ts";
import { DataPlane } from "../../../../data-plane/index.ts";
import { CrosspostThreadItem } from "../../../../data-plane/routes/crosspost-threads.ts";
import { Code, isDataPlaneError } from "../../../../data-plane/util.ts";
import {
  HydrateCtx,
  HydrationState,
  Hydrator,
  PostBlock,
} from "../../../../hydration/index.ts";
import { HydrationMap } from "../../../../hydration/util.ts";
import * as so from "../../../../lex/so.ts";
import {
  $OutputBody,
  $Params,
  ThreadItem,
} from "../../../../lex/so/sprk/feed/getCrosspostThread.ts";
import { createPipeline } from "../../../../pipeline.ts";
import { uriToDid } from "../../../../utils/uris.ts";
import { Views } from "../../../../views/index.ts";
import {
  ATPROTO_REPO_REV,
  createHydrateCtxFromAuth,
  getThreadDepth,
  resHeaders,
} from "../../../util.ts";

export default function (server: Server, ctx: AppContext) {
  const getCrosspostThread = createPipeline({
    skeleton,
    hydration,
    presentation,
  });

  server.add(so.sprk.feed.getCrosspostThread, {
    auth: ctx.authVerifier.optionalStandardOrRole,
    handler: async ({ params, auth, req, res }) => {
      const hydrateCtx = await createHydrateCtxFromAuth(ctx, req, auth);

      const repoRevPromise = ctx.hydrator.actor.getRepoRevSafe(
        hydrateCtx.viewer,
      );
      let result: $OutputBody;
      try {
        result = await getCrosspostThread({ ...params, hydrateCtx }, ctx);
      } catch (err) {
        const repoRev = await repoRevPromise;
        if (repoRev) {
          res.headers.set(ATPROTO_REPO_REV, repoRev);
        }
        throw err;
      }

      const repoRev = await repoRevPromise;
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

const skeleton = async (
  inputs: { ctx: Context; params: Params },
): Promise<Skeleton> => {
  const { ctx, params } = inputs;
  const anchor = await ctx.hydrator.resolveUri(params.anchor);
  const depth = params.depth ?? 6;
  const limit = params.limit ?? 50;

  try {
    const result = await ctx.dataplane.crosspostThread.getThread(
      anchor,
      params.parentHeight,
      getThreadDepth({
        anchor,
        depth,
        maxThreadDepth: ctx.cfg.maxThreadDepth,
        bigThreadUris: ctx.cfg.bigThreadUris,
        bigThreadDepth: ctx.cfg.bigThreadDepth,
      }),
      params.sort,
      { includeTakedowns: !!params.hydrateCtx.includeTakedowns },
    );
    const anchorFound = result.items.some((item) => item.uri === anchor);
    const page = paginateThreadItems(result.items, limit, params.cursor);
    return {
      anchor,
      anchorFound,
      items: page.items,
      cursor: page.cursor,
    };
  } catch (err) {
    if (isDataPlaneError(err, Code.NotFound)) {
      return {
        anchor,
        anchorFound: false,
        items: [],
      };
    }
    throw err;
  }
};

const hydration = async (
  inputs: {
    ctx: Context;
    params: Params;
    skeleton: Skeleton;
  },
) => {
  const { ctx, params, skeleton } = inputs;
  const authorDids = skeleton.items.map((item) => item.authorDid);
  const profileStatePromise = ctx.hydrator.hydrateProfilesBasic(
    authorDids,
    params.hydrateCtx,
  );
  if (params.hydrateCtx.include3pBlocks) {
    return await profileStatePromise;
  }
  const [profileState, postBlocks] = await Promise.all([
    profileStatePromise,
    hydrateCrosspostPostBlocks(ctx.hydrator, skeleton.items),
  ]);
  return {
    ...profileState,
    postBlocks,
  };
};

const presentation = (
  inputs: {
    ctx: Context;
    skeleton: Skeleton;
    hydration: HydrationState;
  },
): $OutputBody => {
  const { ctx, skeleton, hydration } = inputs;

  if (!skeleton.anchorFound) {
    throw new InvalidRequestError(
      `Post not found: ${skeleton.anchor}`,
      "NotFound",
    );
  }

  const thread = skeleton.items.map((item) => {
    return {
      $type: "so.sprk.feed.getCrosspostThread#threadItem",
      uri: item.uri as AtUriString,
      depth: item.depth,
      value: toThreadValue(ctx, hydration, item),
    } as ThreadItem;
  });

  return skeleton.cursor ? { thread, cursor: skeleton.cursor } : { thread };
};

const toThreadValue = (
  ctx: Context,
  hydration: HydrationState,
  item: CrosspostThreadItem,
): ThreadItem["value"] => {
  if (!hydration.ctx?.include3pBlocks) {
    const blockInfo = hydration.postBlocks?.get(item.uri) ?? undefined;
    if (blockInfo && (blockInfo.parent || blockInfo.root)) {
      return ctx.views.blockedPost(item.uri, item.authorDid, hydration);
    }
  }

  if (ctx.views.viewerBlockExists(item.authorDid, hydration)) {
    return ctx.views.blockedPost(item.uri, item.authorDid, hydration);
  }

  const author = ctx.views.profileBasic(item.authorDid, hydration);
  if (!author) {
    return ctx.views.notFoundPost(item.uri);
  }

  const record = JSON.parse(JSON.stringify(item.record)) as Record<
    string,
    unknown
  >;

  if (item.kind === "post") {
    return {
      $type: "so.sprk.feed.defs#threadViewPost",
      post: {
        $type: "so.sprk.feed.defs#postView",
        uri: item.uri as AtUriString,
        cid: item.cid as CidString,
        author,
        record,
        replyCount: item.replyCount,
        repostCount: item.repostCount,
        likeCount: item.likeCount,
        indexedAt: item.indexedAt as DatetimeString,
      },
    };
  }

  return {
    $type: "so.sprk.feed.defs#threadViewPost",
    post: {
      $type: "so.sprk.feed.defs#replyView",
      uri: item.uri as AtUriString,
      cid: item.cid as CidString,
      author,
      record,
      replyCount: item.replyCount,
      likeCount: item.likeCount,
      indexedAt: item.indexedAt as DatetimeString,
    },
  };
};

const parseThreadCursor = (cursor?: string): number => {
  if (!cursor) {
    return 0;
  }
  if (!/^[0-9a-z]+$/i.test(cursor)) {
    throw new InvalidRequestError("Malformed cursor");
  }
  const offset = parseInt(cursor, 36);
  if (!Number.isInteger(offset) || offset < 0) {
    throw new InvalidRequestError("Malformed cursor");
  }
  return offset;
};

const paginateThreadItems = (
  items: CrosspostThreadItem[],
  limit: number,
  cursor?: string,
): { items: CrosspostThreadItem[]; cursor?: string } => {
  const start = parseThreadCursor(cursor);
  const pageSize = Number.isInteger(limit) && limit > 0 ? limit : 50;
  if (start >= items.length) {
    return { items: [] };
  }
  const end = Math.min(start + pageSize, items.length);
  const nextCursor = end < items.length ? end.toString(36) : undefined;
  return { items: items.slice(start, end), cursor: nextCursor };
};

type RelationshipPair = [didA: string, didB: string];
type PostBlockPairs = {
  parent?: RelationshipPair;
  root?: RelationshipPair;
};
type ReplyRef = { uri?: unknown };
type ReplyInfo = {
  parent?: ReplyRef;
  root?: ReplyRef;
};

const hydrateCrosspostPostBlocks = async (
  hydrator: Hydrator,
  items: CrosspostThreadItem[],
) => {
  const postBlocks = new HydrationMap<PostBlock>();
  const postBlocksPairs = new Map<string, PostBlockPairs>();
  const relationships: RelationshipPair[] = [];

  for (const item of items) {
    const creator = item.authorDid;
    const pairs: PostBlockPairs = {};
    const replyInfo = getReplyInfo(item.record);

    const parentUri = getRefUri(replyInfo?.parent);
    const parentDid = parentUri ? uriToDid(parentUri) : undefined;
    if (parentDid && parentDid !== creator) {
      const pair: RelationshipPair = [creator, parentDid];
      relationships.push(pair);
      pairs.parent = pair;
    }

    const rootUri = getRefUri(replyInfo?.root);
    const rootDid = rootUri ? uriToDid(rootUri) : undefined;
    if (rootDid && rootDid !== creator) {
      const pair: RelationshipPair = [creator, rootDid];
      relationships.push(pair);
      pairs.root = pair;
    }

    postBlocksPairs.set(item.uri, pairs);
  }

  const blocks = relationships.length > 0
    ? await hydrator.hydrateBidirectionalBlocks(pairsToMap(relationships))
    : undefined;

  for (const [uri, { parent, root }] of postBlocksPairs) {
    postBlocks.set(uri, {
      embed: false,
      parent: !!parent && !!blocks?.get(parent[0])?.get(parent[1]),
      root: !!root && !!blocks?.get(root[0])?.get(root[1]),
    });
  }

  return postBlocks;
};

const getReplyInfo = (
  record: Record<string, unknown>,
): ReplyInfo | undefined => {
  const reply = record.reply;
  return isObject(reply) ? (reply as ReplyInfo) : undefined;
};

const getRefUri = (ref: ReplyRef | undefined): string | undefined => {
  if (!ref || !isObject(ref)) {
    return undefined;
  }
  return typeof ref.uri === "string" ? ref.uri : undefined;
};

const pairsToMap = (pairs: RelationshipPair[]): Map<string, string[]> => {
  const map = new Map<string, string[]>();
  for (const [source, target] of pairs) {
    const targets = map.get(source) ?? [];
    targets.push(target);
    map.set(source, targets);
  }
  return map;
};

const isObject = (value: unknown): value is Record<string, unknown> => {
  return !!value && typeof value === "object";
};

type Context = {
  dataplane: DataPlane;
  hydrator: Hydrator;
  views: Views;
  cfg: ServerConfig;
};

type Params = $Params & { hydrateCtx: HydrateCtx };

type Skeleton = {
  anchor: string;
  anchorFound: boolean;
  items: CrosspostThreadItem[];
  cursor?: string;
};
