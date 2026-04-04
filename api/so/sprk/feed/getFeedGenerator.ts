import { AppContext } from "../../../../context.ts";
import { Server } from "../../../../lex/index.ts";
import { createHydrateCtxFromAuth, resHeaders } from "../../../util.ts";

export default function (server: Server, ctx: AppContext) {
  server.so.sprk.feed.getFeedGenerator({
    auth: ctx.authVerifier.optionalStandardOrRole,
    handler: async ({ params, auth, req }) => {
      const hydrateCtx = await createHydrateCtxFromAuth(ctx, req, auth);

      // Parallelize hydration with repoRev fetch
      const [hydrationState, repoRev] = await Promise.all([
        ctx.hydrator.hydrateFeedGens([params.feed], hydrateCtx),
        ctx.hydrator.actor.getRepoRevSafe(hydrateCtx.viewer),
      ]);

      // Create generator view
      const view = ctx.views.generator(params.feed, hydrationState);

      if (!view) {
        throw new Error(`Feed generator not found: ${params.feed}`);
      }

      // For now, assume online and valid
      // In a real implementation, you might check service health
      const isOnline = true;
      const isValid = true;

      return {
        encoding: "application/json",
        body: {
          view,
          isOnline,
          isValid,
        },
        headers: resHeaders({
          repoRev,
          labelers: hydrateCtx.labelers,
        }),
      };
    },
  });
}
