import { dedupeStrs } from "@atp/common";
import { InvalidRequestError, Server } from "@atp/xrpc-server";

import { AppContext } from "../../../../context.ts";
import {
  HydrateCtx,
  HydrationState,
  Hydrator,
} from "../../../../hydration/index.ts";
import * as so from "../../../../lex/so.ts";
import {
  $OutputBody,
  $Params,
} from "../../../../lex/so/sprk/story/getStories.ts";
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
import { Views } from "../../../../views/index.ts";
import { createHydrateCtxFromAuth, resHeaders } from "../../../util.ts";

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
  const getStories = createPipeline({
    skeleton,
    hydration,
    rules,
    presentation,
  });
  server.add(so.sprk.story.getStories, {
    auth: ctx.authVerifier.standardOptional,
    handler: async ({ params, auth, req }) => {
      const hydrateCtx = await createHydrateCtxFromAuth(ctx, req, auth);

      // Ensure uris is an array
      const uriArray = Array.isArray(params.uris) ? params.uris : [params.uris];

      // Check if empty array
      if (uriArray.length === 0) {
        return {
          encoding: "application/json",
          body: { stories: [] } as $OutputBody,
        };
      }

      // Enforce maximum limit
      if (uriArray.length > MAX_STORIES_LIMIT) {
        throw new InvalidRequestError(
          `Too many URIs requested. Maximum is ${MAX_STORIES_LIMIT}`,
        );
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
          body: { stories: [] } as $OutputBody,
        };
      }

      const result = await getStories(
        {
          ...params,
          uris: validUris as $Params["uris"],
          hydrateCtx,
          viewer: hydrateCtx.viewer,
        },
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
  return await ctx.hydrator.hydrateStories(skeleton.stories, params.hydrateCtx);
};

const rules = (inputs: RulesFnInput<Context, Params, Skeleton>): Skeleton => {
  const { ctx, skeleton, hydration } = inputs;

  const activeStories = filterSkeletonList(skeleton, "stories", (uri) => {
    const storyInfo = hydration.stories?.get(uri);
    if (!storyInfo) return false;

    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);
    return storyInfo.indexedAt >= twentyFourHoursAgo;
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

  return { stories: storyViews };
};

type Context = {
  hydrator: Hydrator;
  views: Views;
};

type Params = $Params & {
  hydrateCtx: HydrateCtx;
  viewer: string | null;
};

type Skeleton = {
  stories: string[];
};
