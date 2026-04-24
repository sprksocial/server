import { InvalidRequestError, Server } from "@atp/xrpc-server";

import { AppContext } from "../../../../context.ts";
import { HydrateCtx, HydrationState } from "../../../../hydration/index.ts";
import { parseString } from "../../../../hydration/util.ts";
import * as so from "../../../../lex/so.ts";
import {
  $OutputBody,
  $Params,
} from "../../../../lex/so/sprk/story/getTimeline.ts";
import {
  createPipeline,
  filterSkeletonList,
  HydrationFnInput,
  mapSkeletonList,
  PresentationFnInput,
  RulesFnInput,
  SkeletonFnInput,
} from "../../../../pipeline.ts";
import { uriToDid } from "../../../../utils/uris.ts";
import { createHydrateCtxFromAuth, resHeaders } from "../../../util.ts";

// Constants
const MAX_LIMIT = 100;
const DEFAULT_LIMIT = 50;

export default function (server: Server, ctx: AppContext) {
  const getTimeline = createPipeline({
    skeleton,
    hydration,
    rules,
    presentation,
  });
  server.add(so.sprk.story.getTimeline, {
    auth: ctx.authVerifier.standard,
    handler: async ({ params, auth, req }) => {
      const viewer = auth.credentials.iss;
      const hydrateCtx = await createHydrateCtxFromAuth(
        ctx,
        req,
        auth,
        { viewer },
      );

      const { limit: limitParam = DEFAULT_LIMIT, cursor } = params;

      // Validate and sanitize limit
      const limit = typeof limitParam === "string"
        ? parseInt(limitParam, 10)
        : limitParam;

      if (isNaN(limit) || limit < 1 || limit > MAX_LIMIT) {
        throw new InvalidRequestError(
          `Invalid limit: must be between 1 and ${MAX_LIMIT}`,
        );
      }

      // Parallelize pipeline execution with repoRev fetch
      const [result, repoRev] = await Promise.all([
        getTimeline(
          { ...params, limit, cursor, hydrateCtx: hydrateCtx.copy({ viewer }) },
          ctx,
        ),
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

const skeleton = async (
  inputs: SkeletonFnInput<Context, Params>,
): Promise<Skeleton> => {
  const { ctx, params } = inputs;
  const viewer = params.hydrateCtx.viewer!;

  // Get accounts that the viewer follows
  const followsRes = await ctx.dataplane.follows.getFollows(viewer);
  const followedDids = followsRes.follows.map((f) => f.subjectDid);

  // Include the user's own stories in the timeline
  const timelineDids = [...followedDids, viewer];

  if (timelineDids.length === 0) {
    return { stories: [], cursor: undefined };
  }

  // Get timeline stories from dataplane
  const res = await ctx.dataplane.stories.getTimeline(
    viewer,
    followedDids,
    params.limit,
    params.cursor,
  );

  return {
    stories: res.stories.map((story: { uri: string }) => story.uri),
    cursor: parseString(res.cursor),
  };
};

const hydration = async (
  inputs: HydrationFnInput<Context, Params, Skeleton>,
): Promise<HydrationState> => {
  const { ctx, params, skeleton } = inputs;
  return await ctx.hydrator.hydrateStories(skeleton.stories, params.hydrateCtx);
};

const rules = (inputs: RulesFnInput<Context, Params, Skeleton>): Skeleton => {
  const { ctx, skeleton, hydration } = inputs;

  const activeStories = filterSkeletonList(skeleton, "stories", (uri) => {
    return !!hydration.stories?.get(uri);
  });

  return filterSkeletonList(
    activeStories,
    "stories",
    (uri) => !ctx.views.viewerBlockExists(uriToDid(uri), hydration),
  );
};

const presentation = (
  inputs: PresentationFnInput<Context, Params, Skeleton>,
): $OutputBody => {
  const { ctx, skeleton, hydration } = inputs;
  const storyViews = mapSkeletonList(
    skeleton,
    "stories",
    (uri) => ctx.views.story(uri, hydration),
  );

  // Group stories by author
  const storiesByAuthor = ctx.views.storiesByAuthor(storyViews);

  return {
    storiesByAuthor,
    ...(skeleton.cursor && { cursor: skeleton.cursor }),
  };
};

type Context = AppContext;

type Params = $Params & {
  hydrateCtx: HydrateCtx & { viewer: string };
  limit: number;
};

type Skeleton = {
  stories: string[];
  cursor?: string;
};
