import { mapDefined } from "@atp/common";
import { AppContext } from "../../../../context.ts";
import { Server } from "@atp/xrpc-server";
import * as so from "../../../../lex/so.ts";
import { createHydrateCtxFromAuth, resHeaders } from "../../../util.ts";

export default function (server: Server, ctx: AppContext) {
  server.add(so.sprk.labeler.getServices, {
    auth: ctx.authVerifier.standardOptional,
    handler: async ({ params, auth, req }) => {
      const { dids, detailed } = params;
      const hydrateCtx = await createHydrateCtxFromAuth(ctx, req, auth);
      const hydration = await ctx.hydrator.hydrateLabelers(dids, hydrateCtx);

      const views = mapDefined(dids, (did) => {
        if (detailed) {
          return ctx.views.labelerDetailed(did, hydration);
        } else {
          return ctx.views.labeler(did, hydration);
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
