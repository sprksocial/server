import type { AtUriString, CidString, DatetimeString } from "@atp/lex";
import { Server } from "@atp/xrpc-server";

import { AppContext } from "../../../../context.ts";
import { DataPlane } from "../../../../data-plane/index.ts";
import { HydrateCtx, Hydrator } from "../../../../hydration/index.ts";
import { parseString } from "../../../../hydration/util.ts";
import * as so from "../../../../lex/so.ts";
import {
  $OutputBody,
  $Params,
  Like,
} from "../../../../lex/so/sprk/feed/getLikes.ts";
import {
  createPipeline,
  filterSkeletonList,
  type HydrationFnInput,
  mapSkeletonList,
  type PresentationFnInput,
  type RulesFnInput,
  type SkeletonFnInput,
} from "../../../../pipeline.ts";
import { Views } from "../../../../views/index.ts";
import {
  clearlyBadCursor,
  createHydrateCtxFromAuth,
  resHeaders,
} from "../../../util.ts";

export default function (server: Server, ctx: AppContext) {
  const getLikes = createPipeline({
    skeleton,
    hydration,
    rules: noBlocks,
    presentation,
  });

  server.add(so.sprk.feed.getLikes, {
    auth: ctx.authVerifier.standardOptional,
    handler: async ({ params, auth, req }) => {
      const hydrateCtx = await createHydrateCtxFromAuth(ctx, req, auth);
      const result = await getLikes({ ...params, hydrateCtx }, ctx);

      return {
        encoding: "application/json",
        body: result,
        headers: resHeaders({
          labelers: hydrateCtx.labelers,
        }),
      };
    },
  });
}

const skeleton = async (
  input: SkeletonFnInput<Context, Params>,
): Promise<Skeleton> => {
  const { ctx, params } = input;
  const { uri, cid, limit, cursor } = params;

  if (clearlyBadCursor(cursor)) {
    return { uri, cid, likes: [] };
  }

  const likesRes = await ctx.dataplane.likes.bySubject(
    { uri, cid },
    limit,
    cursor,
  );

  return {
    uri,
    cid,
    likes: likesRes.likes ?? [],
    cursor: parseString(likesRes.cursor),
  };
};

const hydration = async (
  input: HydrationFnInput<Context, Params, Skeleton>,
) => {
  const { ctx, params, skeleton } = input;
  return await ctx.hydrator.hydrateProfiles(
    skeleton.likes.map((like) => like.authorDid),
    params.hydrateCtx,
    { includeStories: false },
  );
};

const noBlocks = (input: RulesFnInput<Context, Params, Skeleton>) => {
  const { ctx, hydration, params, skeleton } = input;
  return filterSkeletonList(skeleton, "likes", (like) => {
    if (!ctx.views.profile(like.authorDid, hydration)) {
      return false;
    }
    if (ctx.views.viewerBlockExists(like.authorDid, hydration)) {
      return false;
    }
    return (
      params.hydrateCtx.includeTakedowns ||
      !ctx.views.actorIsNoHosted(like.authorDid, hydration)
    );
  });
};

const presentation = (
  input: PresentationFnInput<Context, Params, Skeleton>,
): $OutputBody => {
  const { ctx, hydration, skeleton } = input;
  const likes = mapSkeletonList(skeleton, "likes", (like): Like | undefined => {
    const actor = ctx.views.profile(like.authorDid, hydration);
    if (!actor) return;
    return {
      indexedAt: like.indexedAt as DatetimeString,
      createdAt: like.createdAt as DatetimeString,
      actor,
    };
  });

  return {
    uri: skeleton.uri as AtUriString,
    cid: skeleton.cid as CidString | undefined,
    cursor: skeleton.cursor,
    likes,
  };
};

type Context = {
  hydrator: Hydrator;
  views: Views;
  dataplane: DataPlane;
};

type Params = $Params & {
  hydrateCtx: HydrateCtx;
};

type LikeSkeletonItem = {
  uri: string;
  cid: string;
  authorDid: string;
  createdAt: string;
  indexedAt: string;
  subject: string;
  subjectCid: string;
};

type Skeleton = {
  uri: string;
  cid?: string;
  likes: LikeSkeletonItem[];
  cursor?: string;
};
