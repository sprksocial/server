import { InvalidRequestError } from "@atp/xrpc-server";
import { AppContext } from "../../../../context.ts";
import {
  HydrateCtx,
  HydrationState,
} from "../../../../hydration/index.ts";
import { parseString } from "../../../../hydration/util.ts";
import { Server } from "../../../../lex/index.ts";
import { QueryParams, OutputSchema } from "../../../../lex/types/so/sprk/story/getTimeline.ts";
import {
  createPipeline,
  HydrationFnInput,
  PresentationFnInput,
  RulesFnInput,
  SkeletonFnInput,
} from "../../../../pipeline.ts";
import { uriToDid } from "../../../../utils/uris.ts";
import { resHeaders } from "../../../util.ts";

// Constants
const MAX_LIMIT = 100;
const DEFAULT_LIMIT = 50;

export default function (server: Server, ctx: AppContext) {
  const getTimeline = createPipeline(
    skeleton,
    hydration,
    rules,
    presentation,
  );
  server.so.sprk.story.getTimeline({
    auth: ctx.authVerifier.standard,
    handler: async ({ params, auth }) => {
      const viewer = auth.credentials.iss;
      const hydrateCtx = ctx.hydrator.createContext({ viewer });

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

      const result = await getTimeline(
        { ...params, limit, cursor, hydrateCtx: hydrateCtx.copy({ viewer }) },
        ctx,
      );

      const repoRev = await ctx.hydrator.actor.getRepoRevSafe(viewer);

      return {
        encoding: "application/json",
        body: result,
        headers: resHeaders({ repoRev }),
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

  // Hydrate stories
  const stories = await ctx.hydrator.story.getStories(
    skeleton.stories,
    params.hydrateCtx.includeTakedowns || false,
  );

  // Get author DIDs for actor hydration
  const authorDids = [...new Set(
    skeleton.stories.map((uri) => uriToDid(uri)),
  )];

  // Hydrate actors (profiles)
  const actors = await ctx.hydrator.actor.getActors(
    authorDids,
    params.hydrateCtx,
  );

  return {
    stories,
    actors,
  };
};

const rules = (inputs: RulesFnInput<Context, Params, Skeleton>): Skeleton => {
  const { ctx, params, skeleton, hydration } = inputs;
  const viewer = params.hydrateCtx.viewer!;

  // Filter out expired stories (24 hours, except for owner's stories)
  // Note: The dataplane already filters expired stories, but we do an additional
  // check here for stories from the viewer (which shouldn't be filtered)
  const activeStories = skeleton.stories.filter((uri) => {
    const storyInfo = hydration.stories?.get(uri);
    if (!storyInfo) return false;

    // If the authenticated user is the author, don't apply the 24h expiration filter
    const authorDid = uriToDid(uri);
    if (authorDid === viewer) return true;

    // The dataplane already filtered expired stories, so we just check if it exists
    return true;
  });

  // Filter out blocked stories
  const accessibleStories = activeStories.filter((uri) => {
    const authorDid = uriToDid(uri);
    return !ctx.views.viewerBlockExists(authorDid, hydration);
  });

  return { stories: accessibleStories, cursor: skeleton.cursor };
};

const presentation = (
  inputs: PresentationFnInput<Context, Params, Skeleton>,
): OutputSchema => {
  const { ctx, skeleton, hydration } = inputs;
  const storyViews = skeleton.stories
    .map((uri) => ctx.views.story(uri, hydration))
    .filter((view): view is NonNullable<typeof view> => view !== undefined);

  // Group stories by author
  const storiesByAuthor = ctx.views.storiesByAuthor(storyViews);

  return {
    storiesByAuthor,
    ...(skeleton.cursor && { cursor: skeleton.cursor }),
  };
};

type Context = AppContext;

type Params = QueryParams & {
  hydrateCtx: HydrateCtx & { viewer: string };
  limit: number;
};

type Skeleton = {
  stories: string[];
  cursor?: string;
};
