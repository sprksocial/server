import { mapDefined } from "@atp/common";
import { AppContext } from "../../../../context.ts";
import { Server } from "../../../../lex/index.ts";
import { createHydrateCtxFromAuth, resHeaders } from "../../../util.ts";

export default function (server: Server, ctx: AppContext) {
  server.so.sprk.labeler.getServices({
    auth: ctx.authVerifier.standardOptional,
    handler: async ({ params, auth, req }) => {
      const { dids, detailed } = params;
      const hydrateCtx = await createHydrateCtxFromAuth(ctx, req, auth);
      const hydration = await ctx.hydrator.hydrateLabelers(dids, hydrateCtx);

      const views = mapDefined(dids, (did) => {
        if (detailed) {
          const view = ctx.views.labelerDetailed(did, hydration);
          if (!view) return;
          return {
            ...view,
            $type: "so.sprk.labeler.defs#labelerViewDetailed",
          };
        } else {
          const view = ctx.views.labeler(did, hydration);
          if (!view) return;
          return {
            ...view,
            $type: "so.sprk.labeler.defs#labelerView",
          };
        }
      });

      return {
        encoding: "application/json",
        body: {
          views,
        },
        headers: resHeaders({ labelers: hydrateCtx.labelers }),
      };
    },
  });
}
