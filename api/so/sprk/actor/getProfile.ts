import { InvalidRequestError } from "@atp/xrpc-server";
import { AppContext } from "../../../../context.ts";
import {
  HydrateCtx,
  HydrationState,
  Hydrator,
} from "../../../../hydration/index.ts";
import { Server } from "../../../../lex/index.ts";
import { QueryParams } from "../../../../lex/types/so/sprk/actor/getProfile.ts";
import { createPipeline } from "../../../../pipeline.ts";
import { Views } from "../../../../views/index.ts";
import { createHydrateCtxFromAuth, resHeaders } from "../../../util.ts";

export default function (server: Server, ctx: AppContext) {
  const getProfile = createPipeline({
    skeleton,
    hydration,
    presentation,
  });
  server.so.sprk.actor.getProfile({
    auth: ctx.authVerifier.optionalStandardOrRole,
    handler: async ({ auth, params, req }) => {
      const hydrateCtx = await createHydrateCtxFromAuth(ctx, req, auth);
      const result = await getProfile({ ...params, hydrateCtx }, ctx);
      const repoRev = await ctx.hydrator.actor.getRepoRevSafe(
        hydrateCtx.viewer,
      );

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

const skeleton = async (input: {
  ctx: Context;
  params: Params;
}): Promise<SkeletonState> => {
  const { ctx, params } = input;
  const [did] = await ctx.hydrator.actor.getDids([params.actor]);
  if (!did) {
    throw new InvalidRequestError("Profile not found");
  }
  return { did };
};

const hydration = (input: {
  ctx: Context;
  params: Params;
  skeleton: SkeletonState;
}) => {
  const { ctx, params, skeleton } = input;
  return ctx.hydrator.hydrateProfilesDetailed(
    [skeleton.did],
    params.hydrateCtx.copy({
      includeActorTakedowns: true,
    }),
  );
};

const presentation = (input: {
  ctx: Context;
  params: Params;
  skeleton: SkeletonState;
  hydration: HydrationState;
}) => {
  const { ctx, params, skeleton, hydration } = input;
  const profile = ctx.views.profileDetailed(skeleton.did, hydration);
  if (!profile) {
    throw new InvalidRequestError("Profile not found");
  } else if (!params.hydrateCtx.includeTakedowns) {
    if (ctx.views.actorIsTakendown(skeleton.did, hydration)) {
      throw new InvalidRequestError(
        "Account has been suspended",
        "AccountTakedown",
      );
    } else if (ctx.views.actorIsDeactivated(skeleton.did, hydration)) {
      throw new InvalidRequestError(
        "Account is deactivated",
        "AccountDeactivated",
      );
    }
  }
  return profile;
};

type Context = {
  hydrator: Hydrator;
  views: Views;
};

type Params = QueryParams & {
  hydrateCtx: HydrateCtx;
};

type SkeletonState = { did: string };
