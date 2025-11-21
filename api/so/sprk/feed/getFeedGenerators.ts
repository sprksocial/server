import { AppContext } from "../../../../context.ts";
import { Server } from "../../../../lex/index.ts";
import { resHeaders } from "../../../util.ts";

export default function (server: Server, ctx: AppContext) {
  server.so.sprk.feed.getFeedGenerators({
    auth: ctx.authVerifier.optionalStandardOrRole,
    handler: async ({ params, auth }) => {
      const { viewer, includeTakedowns } = ctx.authVerifier.parseCreds(auth);
      const hydrateCtx = ctx.hydrator.createContext({
        viewer,
        includeTakedowns,
      });

      // Hydrate feed generators
      const hydrationState = await ctx.hydrator.hydrateFeedGens(params.feeds, hydrateCtx);

      // Create generator views
      const feeds = params.feeds
        .map((uri) => ctx.views.generator(uri, hydrationState))
        .filter((view): view is NonNullable<typeof view> => view !== undefined);

      const repoRev = await ctx.hydrator.actor.getRepoRevSafe(viewer);

      return {
        encoding: "application/json",
        body: { feeds },
        headers: resHeaders({
          repoRev,
        }),
      };
    },
  });
}