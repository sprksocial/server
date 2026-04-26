import { InvalidRequestError, Server } from "@atp/xrpc-server";

import { AppContext } from "../../../../context.ts";
import { HydrateCtx, Hydrator } from "../../../../hydration/index.ts";
import { $Params } from "../../../../lex/so/sprk/graph/getKnownFollowers.ts";
import * as so from "../../../../lex/so.ts";
import {
  createPipeline,
  filterSkeletonList,
  HydrationFnInput,
  mapSkeletonList,
  PresentationFnInput,
  RulesFnInput,
  SkeletonFnInput,
} from "../../../../pipeline.ts";
import { Views } from "../../../../views/index.ts";
import {
  clearlyBadCursor,
  createHydrateCtxFromAuth,
  resHeaders,
} from "../../../util.ts";

export default function (server: Server, ctx: AppContext) {
  const getKnownFollowers = createPipeline({
    skeleton,
    hydration,
    rules: noBlocks,
    presentation,
  });
  server.add(so.sprk.graph.getKnownFollowers, {
    auth: ctx.authVerifier.standard,
    handler: async ({ params, auth, req }) => {
      const viewer = auth.credentials.iss;
      const hydrateCtx = await createHydrateCtxFromAuth(
        ctx,
        req,
        auth,
        { viewer },
      );

      const result = await getKnownFollowers(
        { ...params, hydrateCtx: hydrateCtx.copy({ viewer }) },
        ctx,
      );

      return {
        encoding: "application/json",
        body: result,
        headers: resHeaders({ labelers: hydrateCtx.labelers }),
      };
    },
  });
}

const skeleton = async (
  input: SkeletonFnInput<Context, Params>,
): Promise<SkeletonState> => {
  const { params, ctx } = input;
  const [subjectDid] = await ctx.hydrator.actor.getDidsDefined([params.actor]);
  if (!subjectDid) {
    throw new InvalidRequestError(`Actor not found: ${params.actor}`);
  }
  if (clearlyBadCursor(params.cursor)) {
    return { subjectDid, knownFollowers: [], cursor: undefined };
  }

  const res = await ctx.hydrator.dataplane.follows.getFollowsFollowing(
    params.hydrateCtx.viewer,
    [subjectDid],
  );
  const result = res.results.at(0);
  const knownFollowers = result ? result.dids.slice(0, params.limit ?? 50) : [];

  return {
    subjectDid,
    knownFollowers,
    cursor: undefined,
  };
};

const hydration = (
  input: HydrationFnInput<Context, Params, SkeletonState>,
) => {
  const { ctx, params, skeleton } = input;
  return ctx.hydrator.hydrateProfiles(
    [skeleton.subjectDid, ...skeleton.knownFollowers],
    params.hydrateCtx,
  );
};

const noBlocks = (input: RulesFnInput<Context, Params, SkeletonState>) => {
  const { ctx, hydration, skeleton } = input;
  return filterSkeletonList(skeleton, "knownFollowers", (did) => {
    return !ctx.views.viewerBlockExists(did, hydration);
  });
};

const presentation = (
  input: PresentationFnInput<Context, Params, SkeletonState>,
) => {
  const { ctx, hydration, params, skeleton } = input;
  const isNoHosted = (did: string) => ctx.views.actorIsNoHosted(did, hydration);

  const subject = ctx.views.profile(skeleton.subjectDid, hydration);
  if (
    !subject ||
    (!params.hydrateCtx.includeTakedowns && isNoHosted(skeleton.subjectDid))
  ) {
    throw new InvalidRequestError(`Actor not found: ${params.actor}`);
  }

  const followers = mapSkeletonList(skeleton, "knownFollowers", (did) => {
    if (!params.hydrateCtx.includeTakedowns && isNoHosted(did)) {
      return;
    }
    return ctx.views.profile(did, hydration);
  });

  return { subject, followers, cursor: undefined };
};

type Context = {
  hydrator: Hydrator;
  views: Views;
};

type Params = $Params & {
  hydrateCtx: HydrateCtx & { viewer: string };
};

type SkeletonState = {
  subjectDid: string;
  knownFollowers: string[];
  cursor?: string;
};
