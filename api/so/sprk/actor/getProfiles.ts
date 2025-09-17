import { mapDefined } from "@atproto/common";
import { AppContext } from "../../../../main.ts";
import {
  HydrateCtx,
  HydrationState,
  Hydrator,
} from "../../../../hydration/index.ts";
import { Server } from "../../../../lex/index.ts";
import { QueryParams } from "../../../../lex/types/so/sprk/actor/getProfiles.ts";
import { createPipeline, noRules } from "../../../../pipeline.ts";
import { Views } from "../../../../views/index.ts";
import { resHeaders } from "../../../util.ts";

export default function (server: Server, ctx: AppContext) {
  const getProfile = createPipeline(skeleton, hydration, noRules, presentation);
  server.so.sprk.actor.getProfiles({
    auth: ctx.authVerifier.standardOptional,
    handler: async ({ auth, params }) => {
      const { viewer, includeTakedowns } = ctx.authVerifier.parseCreds(auth);
      const hydrateCtx = ctx.hydrator.createContext({
        viewer,
        includeTakedowns,
      });

      const result = await getProfile({ ...params, hydrateCtx }, ctx);

      const repoRev = await ctx.hydrator.actor.getRepoRevSafe(viewer);

      return {
        encoding: "application/json",
        body: result,
        headers: resHeaders({
          repoRev,
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

const presentation = (input: {
  ctx: Context;
  params: Params;
  skeleton: SkeletonState;
  hydration: HydrationState;
}) => {
  const { ctx, skeleton, hydration } = input;
  const profiles = mapDefined(
    skeleton.dids,
    (did) => ctx.views.profileDetailed(did, hydration),
  );
  return { profiles };
};

type Context = {
  hydrator: Hydrator;
  views: Views;
};

type Params = QueryParams & {
  hydrateCtx: HydrateCtx;
};

type SkeletonState = { dids: string[] };
