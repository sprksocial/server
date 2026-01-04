import { mapDefined, noUndefinedVals } from "@atp/common";
import { ResponseType, XrpcClient, XRPCError } from "@atp/xrpc";
import {
  InvalidRequestError,
  ServerTimer,
  serverTimingHeader,
  UpstreamFailureError,
} from "@atp/xrpc-server";
import { AppContext } from "../../../../context.ts";
import {
  Code,
  getServiceEndpoint,
  unpackIdentityServices,
} from "../../../../data-plane/util.ts";
import { FeedItem } from "../../../../hydration/feed.ts";
import { HydrateCtx } from "../../../../hydration/index.ts";
import { Server } from "../../../../lex/index.ts";
import { ids, lexicons } from "../../../../lex/lexicons.ts";
import { isSkeletonReasonRepost } from "../../../../lex/types/so/sprk/feed/defs.ts";
import { QueryParams as GetFeedParams } from "../../../../lex/types/so/sprk/feed/getFeed.ts";
import { OutputSchema as SkeletonOutput } from "../../../../lex/types/so/sprk/feed/getFeedSkeleton.ts";
import {
  createPipeline,
  HydrationFnInput,
  PresentationFnInput,
  RulesFnInput,
  SkeletonFnInput,
} from "../../../../pipeline.ts";
import { resHeaders, SPRK_USER_AGENT } from "../../../util.ts";

type GetIdentityByDidResponse = {
  did: string;
  handle: string | undefined;
  keys: string;
  services: string;
  updated: string;
};

export default function (server: Server, ctx: AppContext) {
  const getFeed = createPipeline(
    skeleton,
    hydration,
    noBlocksOrMutes,
    presentation,
  );
  server.so.sprk.feed.getFeed({
    auth: ctx.authVerifier.standardOptionalParameterized({
      lxmCheck: (method) => {
        return (
          method === ids.SoSprkFeedGetFeedSkeleton ||
          method === ids.SoSprkFeedGetFeed
        );
      },
      skipAudCheck: true,
    }),
    handler: async ({ params, auth, req }) => {
      const viewer = auth.credentials.iss;
      const labelers = ctx.reqLabelers(req);
      const hydrateCtx = await ctx.hydrator.createContext({ viewer, labelers });
      const headers = noUndefinedVals({
        "user-agent": SPRK_USER_AGENT,
        authorization: req.headers.get("authorization") as string,
        "accept-language": req.headers.get("accept-language") as string,
        "x-sprk-topics": req.headers.get("x-sprk-topics") as string,
      });
      // @NOTE feed cursors should not be affected by appview swap
      const {
        timerSkele,
        timerHydr,
        resHeaders: feedResHeaders,
        ...result
      } = await getFeed({ ...params, hydrateCtx, headers }, ctx);

      return {
        encoding: "application/json",
        body: result,
        headers: {
          ...(feedResHeaders ?? {}),
          ...resHeaders({}),
          "server-timing": serverTimingHeader([timerSkele, timerHydr]),
        },
      };
    },
  });
}

const skeleton = async (
  inputs: SkeletonFnInput<Context, Params>,
): Promise<Skeleton> => {
  const { ctx, params } = inputs;
  const timerSkele = new ServerTimer("skele").start();
  const {
    feedItems: algoItems,
    reqId,
    cursor,
    resHeaders,
    ...passthrough
  } = await skeletonFromFeedGen(ctx, params);

  return {
    cursor,
    items: algoItems,
    reqId,
    timerSkele: timerSkele.stop(),
    timerHydr: new ServerTimer("hydr").start(),
    resHeaders,
    passthrough,
  };
};

const hydration = async (
  inputs: HydrationFnInput<Context, Params, Skeleton>,
) => {
  const { ctx, params, skeleton } = inputs;
  const timerHydr = new ServerTimer("hydr").start();
  const hydration = await ctx.hydrator.hydrateFeedItems(
    skeleton.items,
    params.hydrateCtx,
  );
  skeleton.timerHydr = timerHydr.stop();
  return hydration;
};

const noBlocksOrMutes = (inputs: RulesFnInput<Context, Params, Skeleton>) => {
  const { ctx, skeleton, hydration } = inputs;
  skeleton.items = skeleton.items.filter((item) => {
    const bam = ctx.views.feedItemBlocksAndMutes(item, hydration);
    return (
      !bam.authorBlocked &&
      !bam.authorMuted &&
      !bam.originatorBlocked &&
      !bam.originatorMuted
    );
  });

  return skeleton;
};

const presentation = (
  inputs: PresentationFnInput<Context, Params, Skeleton>,
) => {
  const { ctx, skeleton, hydration } = inputs;
  const feed = mapDefined(skeleton.items, (item) => {
    const post = ctx.views.feedViewPost(item, hydration);
    if (!post) return;
    return {
      ...post,
      feedContext: item.feedContext,
    };
  });
  return {
    feed: feed.map((fi) => ({ ...fi, reqId: skeleton.reqId })),
    cursor: skeleton.cursor,
    timerSkele: skeleton.timerSkele,
    timerHydr: skeleton.timerHydr,
    resHeaders: skeleton.resHeaders,
    ...skeleton.passthrough,
  };
};

type Context = AppContext;

type Params = GetFeedParams & {
  hydrateCtx: HydrateCtx;
  headers: Record<string, string>;
};

type Skeleton = {
  items: AlgoResponseItem[];
  reqId?: string;
  passthrough: Record<string, unknown>; // pass through additional items in feedgen response
  resHeaders?: Record<string, string>;
  cursor?: string;
  timerSkele: ServerTimer;
  timerHydr: ServerTimer;
};

const skeletonFromFeedGen = async (
  ctx: Context,
  params: Params,
): Promise<AlgoResponse> => {
  const { feed, headers } = params;
  const found = await ctx.hydrator.feed.getFeedGens([feed], true);
  const feedDid = found.get(feed)?.record.did;
  if (!feedDid) {
    throw new InvalidRequestError("could not find feed");
  }

  let identity: GetIdentityByDidResponse;
  try {
    identity = await ctx.dataplane.identity.getByDid(feedDid);
  } catch (err) {
    if (err === Code.NotFound) {
      throw new InvalidRequestError(`could not resolve identity: ${feedDid}`);
    }
    throw err;
  }

  const services = unpackIdentityServices(identity.services);
  const fgEndpoint = getServiceEndpoint(services, {
    id: "sprk_fg",
    type: "SprkFeedGenerator",
  });
  if (!fgEndpoint) {
    throw new InvalidRequestError(
      `invalid feed generator service details in did document: ${feedDid}`,
    );
  }

  const client = new XrpcClient(fgEndpoint, lexicons);

  let skeleton: SkeletonOutput;
  let resHeaders: Record<string, string> | undefined = undefined;
  try {
    // @TODO currently passthrough auth headers from pds
    const result = await client.call(
      "so.sprk.feed.getFeedSkeleton",
      {
        feed: params.feed,
        // The feedgen is not guaranteed to honor the limit, but we try it.
        limit: params.limit,
        cursor: params.cursor,
      },
      undefined,
      {
        headers,
      },
    );

    skeleton = result.data;

    if (result.data.cursor === params.cursor) {
      // Prevents loops if the custom feed echoes the input cursor back.
      skeleton.cursor = undefined;
    }

    if (result.headers["content-language"]) {
      resHeaders = {
        "content-language": result.headers["content-language"],
      };
    }
  } catch (err) {
    if (typeof (err as { message: string }).message == "string") {
      throw new InvalidRequestError(
        (err as { message: string }).message,
        "UnknownFeed",
      );
    }
    if (err instanceof XRPCError) {
      if (err.status === ResponseType.Unknown) {
        throw new UpstreamFailureError("feed unavailable");
      }
      if (err.status === ResponseType.InvalidResponse) {
        throw new UpstreamFailureError(
          "feed provided an invalid response",
          "InvalidFeedResponse",
        );
      }
    }
    throw err;
  }

  const { feed: feedSkele, ...skele } = skeleton;
  const feedItems = feedSkele.slice(0, params.limit).map((item) => ({
    post: { uri: item.post },
    repost: isSkeletonReasonRepost(item.reason)
      ? { uri: item.reason.repost }
      : undefined,
    feedContext: item.feedContext,
  }));

  return { ...skele, resHeaders, feedItems };
};

export type AlgoResponse = {
  feedItems: AlgoResponseItem[];
  resHeaders?: Record<string, string>;
  cursor?: string;
  reqId?: string;
};

export type AlgoResponseItem = FeedItem & {
  feedContext?: string;
};
