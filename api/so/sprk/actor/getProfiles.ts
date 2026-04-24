import { Server } from "@atp/xrpc-server";

import { AppContext } from "../../../../context.ts";
import { HydrateCtx, Hydrator } from "../../../../hydration/index.ts";
import * as so from "../../../../lex/so.ts";
import { $Params } from "../../../../lex/so/sprk/actor/getProfiles.ts";
import {
  createPipeline,
  mapSkeletonList,
  type PresentationFnInput,
  type SkeletonFnInput,
} from "../../../../pipeline.ts";
import { Views } from "../../../../views/index.ts";
import { createHydrateCtxFromAuth, resHeaders } from "../../../util.ts";

export default function (server: Server, ctx: AppContext) {
  const getProfile = createPipeline({
    skeleton,
    hydration,
    presentation,
  });
  server.add(so.sprk.actor.getProfiles, {
    auth: ctx.authVerifier.standardOptional,
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

const skeleton = async (
  input: SkeletonFnInput<Context, Params>,
): Promise<SkeletonState> => {
  const { ctx, params } = input;
  const dids = await ctx.hydrator.actor.getDidsDefined(params.actors);
  return { dids };
};

const hydration = (input: {
  ctx: Context;
  params: Params;
  skeleton: SkeletonState;
}) => {
  const { ctx, params, skeleton } = input;
  return ctx.hydrator.hydrateProfilesDetailed(skeleton.dids, params.hydrateCtx);
};

const presentation = (
  input: PresentationFnInput<Context, Params, SkeletonState>,
) => {
  const { ctx, skeleton, hydration } = input;
  const profiles = mapSkeletonList(
    skeleton,
    "dids",
    (did) => ctx.views.profileDetailed(did, hydration),
  );
  return { profiles };
};

type Context = {
  hydrator: Hydrator;
  views: Views;
};

type Params = $Params & {
  hydrateCtx: HydrateCtx;
};

type SkeletonState = { dids: string[] };
