import { dedupeStrs, mapDefined } from "@atp/common";
import { AppContext } from "../../../../context.ts";
import {
  HydrateCtx,
  HydrationState,
  Hydrator,
} from "../../../../hydration/index.ts";
import { Server } from "../../../../lex/index.ts";
import {
  OutputSchema,
  QueryParams,
} from "../../../../lex/types/so/sprk/story/getStories.ts";
import {
  createPipeline,
  HydrationFnInput,
  PresentationFnInput,
  RulesFnInput,
  SkeletonFnInput,
} from "../../../../pipeline.ts";
import { uriToDid } from "../../../../utils/uris.ts";
import { Views } from "../../../../views/index.ts";
import { resHeaders } from "../../../util.ts";

// Constants
const MAX_STORIES_LIMIT = 25;
const MAX_URI_LENGTH = 3000;

// Helper function to validate URIs
function validateUris(uris: string[]): { valid: string[]; invalid: string[] } {
  const valid: string[] = [];
  const invalid: string[] = [];

  for (const uri of uris) {
    if (typeof uri !== "string" || uri.length === 0) {
      invalid.push(uri);
      continue;
    }

    if (uri.length > MAX_URI_LENGTH) {
      invalid.push(uri);
      continue;
    }

    // Basic AT-URI validation
    if (!uri.startsWith("at://")) {
      invalid.push(uri);
      continue;
    }

    valid.push(uri);
  }

  return { valid, invalid };
}

export default function (server: Server, ctx: AppContext) {
  const getStories = createPipeline(skeleton, hydration, rules, presentation);
  server.so.sprk.story.getStories({
    auth: ctx.authVerifier.standardOptional,
    handler: async ({ params, auth }) => {
      const viewer = auth.credentials.type === "standard"
        ? auth.credentials.iss
        : null;
      const hydrateCtx = ctx.hydrator.createContext({ viewer });

      // Validate input
      if (!params.uris) {
        return {
          status: 400,
          message: "URIs parameter is required",
        };
      }

      // Ensure uris is an array
      const uriArray = Array.isArray(params.uris) ? params.uris : [params.uris];

      // Check if empty array
      if (uriArray.length === 0) {
        return {
          encoding: "application/json",
          body: { stories: [] } as OutputSchema,
        };
      }

      // Enforce maximum limit
      if (uriArray.length > MAX_STORIES_LIMIT) {
        return {
          status: 400,
          message: `Too many URIs requested. Maximum is ${MAX_STORIES_LIMIT}`,
        };
      }

      // Validate URIs
      const { valid: validUris, invalid: invalidUris } = validateUris(uriArray);

      if (invalidUris.length > 0) {
        console.warn(
          `Invalid story URIs provided: ${invalidUris.slice(0, 5).join(", ")}${
            invalidUris.length > 5 ? "..." : ""
          }`,
        );
      }

      if (validUris.length === 0) {
        return {
          encoding: "application/json",
          body: { stories: [] } as OutputSchema,
        };
      }

      const result = await getStories(
        { ...params, uris: validUris, hydrateCtx, viewer: viewer || null },
        ctx,
      );

      return {
        encoding: "application/json",
        body: result,
        headers: resHeaders({}),
      };
    },
  });
}

const skeleton = (inputs: SkeletonFnInput<Context, Params>): Skeleton => {
  const { params } = inputs;
  // Deduplicate URIs while preserving order
  const uniqueUris = dedupeStrs(params.uris);
  return { stories: uniqueUris };
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
  const authorDids = [
    ...new Set(
      skeleton.stories.map((uri) => uriToDid(uri)),
    ),
  ];

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
  const viewer = params.viewer;

  // Filter out expired stories (24 hours, except for owner's stories)
  const activeStories = skeleton.stories.filter((uri) => {
    const storyInfo = hydration.stories?.get(uri);
    if (!storyInfo) return false;

    // If the authenticated user is the author, don't apply the 24h expiration filter
    const authorDid = uriToDid(uri);
    if (viewer && authorDid === viewer) return true;

    // Check if story is expired (older than 24 hours)
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);
    const storyDate = storyInfo.indexedAt;
    return storyDate >= twentyFourHoursAgo;
  });

  // Filter out blocked stories
  const accessibleStories = activeStories.filter((uri) => {
    const authorDid = uriToDid(uri);
    return !ctx.views.viewerBlockExists(authorDid, hydration);
  });

  return { stories: accessibleStories };
};

const presentation = (
  inputs: PresentationFnInput<Context, Params, Skeleton>,
): OutputSchema => {
  const { ctx, skeleton, hydration } = inputs;
  const storyViews = mapDefined(
    skeleton.stories,
    (uri) => ctx.views.story(uri, hydration),
  );

  return { stories: storyViews };
};

type Context = {
  hydrator: Hydrator;
  views: Views;
};

type Params = QueryParams & {
  hydrateCtx: HydrateCtx;
  viewer: string | null;
};

type Skeleton = {
  stories: string[];
};
