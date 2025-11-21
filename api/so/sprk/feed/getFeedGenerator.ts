import { AppContext } from "../../../../context.ts";
import { Server } from "../../../../lex/index.ts";
import { resHeaders } from "../../../util.ts";

export default function (server: Server, ctx: AppContext) {
  server.so.sprk.feed.getFeedGenerator({
    auth: ctx.authVerifier.optionalStandardOrRole,
    handler: async ({ params, auth }) => {
      const { viewer, includeTakedowns } = ctx.authVerifier.parseCreds(auth);
      const hydrateCtx = ctx.hydrator.createContext({
        viewer,
        includeTakedowns,
      });

      // Hydrate feed generator
      const hydrationState = await ctx.hydrator.hydrateFeedGens(
        [params.feed],
        hydrateCtx,
      );

      // Create generator view
      const view = ctx.views.generator(params.feed, hydrationState);

      if (!view) {
        throw new Error("Feed generator not found");
      }

      // For now, assume online and valid
      // In a real implementation, you might check service health
      const isOnline = true;
      const isValid = true;

      const repoRev = await ctx.hydrator.actor.getRepoRevSafe(viewer);

      return {
        encoding: "application/json",
        body: {
          view,
          isOnline,
          isValid,
        },
        headers: resHeaders({
          repoRev,
        }),
      };
    },
  });
}
