import { AppContext } from "../../../../context.ts";
import { Server } from "../../../../lex/index.ts";
import { createHydrateCtxFromAuth, resHeaders } from "../../../util.ts";

export default function (server: Server, ctx: AppContext) {
  server.so.sprk.feed.getFeedGenerators({
    auth: ctx.authVerifier.optionalStandardOrRole,
    handler: async ({ params, auth, req }) => {
      const hydrateCtx = await createHydrateCtxFromAuth(ctx, req, auth);

      // Parallelize hydration with repoRev fetch
      const [hydrationState, repoRev] = await Promise.all([
        ctx.hydrator.hydrateFeedGens(params.feeds, hydrateCtx),
        ctx.hydrator.actor.getRepoRevSafe(hydrateCtx.viewer),
      ]);

      // Create generator views
      const feeds = params.feeds
        .map((uri) => ctx.views.generator(uri, hydrationState))
        .filter((view): view is NonNullable<typeof view> => view !== undefined);

      return {
        encoding: "application/json",
        body: { feeds },
        headers: resHeaders({
          repoRev,
          labelers: hydrateCtx.labelers,
        }),
      };
    },
  });
}
