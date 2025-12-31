import { mapDefined } from "@atp/common";
import { AppContext } from "../../../../context.ts";
import { HydrateCtx, Hydrator } from "../../../../hydration/index.ts";
import { Server } from "../../../../lex/index.ts";
import { QueryParams } from "../../../../lex/types/so/sprk/graph/getBlocks.ts";
import {
  createPipeline,
  HydrationFnInput,
  noRules,
  PresentationFnInput,
  SkeletonFnInput,
} from "../../../../pipeline.ts";
import { Views } from "../../../../views/index.ts";
import { clearlyBadCursor, resHeaders } from "../../../util.ts";

export default function (server: Server, ctx: AppContext) {
  const getBlocks = createPipeline(skeleton, hydration, noRules, presentation);
  server.so.sprk.graph.getBlocks({
    auth: ctx.authVerifier.standard,
    handler: async ({ params, auth, req }) => {
      const viewer = auth.credentials.iss;
      const labelers = ctx.reqLabelers(req);
      const hydrateCtx = await ctx.hydrator.createContext({ labelers, viewer });
      const result = await getBlocks(
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

const skeleton = async (input: SkeletonFnInput<Context, Params>) => {
  const { params, ctx } = input;
  if (clearlyBadCursor(params.cursor)) {
    return { blockedDids: [] };
  }
  const { blockUris, cursor } = await ctx.hydrator.dataplane.blocks.getBlocks(
    params.hydrateCtx.viewer,
    params.limit,
    params.cursor,
  );
  const blocks = await ctx.hydrator.graph.getBlocks(blockUris);
  const blockedDids = mapDefined(
    blockUris,
    (uri) => blocks.get(uri)?.record.subject,
  );
  return {
    blockedDids,
    cursor: cursor || undefined,
  };
};

const hydration = (
  input: HydrationFnInput<Context, Params, SkeletonState>,
) => {
  const { ctx, params, skeleton } = input;
  return ctx.hydrator.hydrateProfiles(skeleton.blockedDids, params.hydrateCtx);
};

const presentation = (
  input: PresentationFnInput<Context, Params, SkeletonState>,
) => {
  const { ctx, hydration, skeleton } = input;
  const { blockedDids, cursor } = skeleton;
  const blocks = mapDefined(blockedDids, (did) => {
    return ctx.views.profile(did, hydration);
  });
  return { blocks, cursor };
};

type Context = {
  hydrator: Hydrator;
  views: Views;
};

type Params = QueryParams & {
  hydrateCtx: HydrateCtx & { viewer: string };
};

type SkeletonState = {
  blockedDids: string[];
  cursor?: string;
};
