import { InvalidRequestError } from "@atp/xrpc-server";
import { mapDefined } from "@atp/common";
import { AppContext } from "../../../../context.ts";
import { HydrateCtx, HydrationState } from "../../../../hydration/index.ts";
import { parseString } from "../../../../hydration/util.ts";
import { Server } from "../../../../lex/index.ts";
import {
  OutputSchema,
  QueryParams,
} from "../../../../lex/types/so/sprk/story/getArchive.ts";
import {
  createPipeline,
  HydrationFnInput,
  PresentationFnInput,
  RulesFnInput,
  SkeletonFnInput,
} from "../../../../pipeline.ts";
import { uriToDid } from "../../../../utils/uris.ts";
import { resHeaders } from "../../../util.ts";

const MAX_LIMIT = 100;
const DEFAULT_LIMIT = 50;

export default function (server: Server, ctx: AppContext) {
  const getArchive = createPipeline(skeleton, hydration, rules, presentation);
  server.so.sprk.story.getArchive({
    auth: ctx.authVerifier.standard,
    handler: async ({ params, auth, req }) => {
      const { includeTakedowns } = ctx.authVerifier.parseCreds(auth);
      const viewer = auth.credentials.iss;
      const labelers = ctx.reqLabelers(req);
      const hydrateCtx = await ctx.hydrator.createContext({
        viewer,
        labelers,
        includeTakedowns,
      });

      const { limit: limitParam = DEFAULT_LIMIT, cursor } = params;
      const limit = typeof limitParam === "string"
        ? parseInt(limitParam, 10)
        : limitParam;

      if (isNaN(limit) || limit < 1 || limit > MAX_LIMIT) {
        throw new InvalidRequestError(
          `Invalid limit: must be between 1 and ${MAX_LIMIT}`,
        );
      }

      const [result, repoRev] = await Promise.all([
        getArchive(
          {
            ...params,
            limit,
            cursor,
            hydrateCtx: hydrateCtx.copy({ viewer, includeTakedowns }),
          },
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
  const res = await ctx.dataplane.stories.getArchive(
    viewer,
    params.limit,
    params.cursor,
    params.hydrateCtx.includeTakedowns || false,
  );

  return {
    stories: res.stories.map((story) => story.uri),
    cursor: parseString(res.cursor),
  };
};

const hydration = async (
  inputs: HydrationFnInput<Context, Params, Skeleton>,
): Promise<HydrationState> => {
  const { ctx, params, skeleton } = inputs;
  const authorDids = [...new Set(skeleton.stories.map((uri) => uriToDid(uri)))];

  const [stories, actors] = await Promise.all([
    ctx.hydrator.story.getArchivedStories(
      skeleton.stories,
      params.hydrateCtx.includeTakedowns || false,
    ),
    ctx.hydrator.actor.getActors(authorDids, params.hydrateCtx),
  ]);

  return {
    stories,
    actors,
  };
};

const rules = (inputs: RulesFnInput<Context, Params, Skeleton>): Skeleton => {
  const { skeleton, hydration } = inputs;
  const availableStories = skeleton.stories.filter((uri) => {
    return Boolean(hydration.stories?.get(uri));
  });
  return { stories: availableStories, cursor: skeleton.cursor };
};

const presentation = (
  inputs: PresentationFnInput<Context, Params, Skeleton>,
): OutputSchema => {
  const { ctx, skeleton, hydration } = inputs;
  const storyViews = mapDefined(skeleton.stories, (uri) => {
    return ctx.views.story(uri, hydration);
  });
  return {
    stories: storyViews,
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
