import { mapDefined } from "@atp/common";
import { AppContext } from "../../../../context.ts";
import { parseString } from "../../../../hydration/util.ts";
import { Server } from "../../../../lex/index.ts";
import { resHeaders } from "../../../util.ts";

export default function (server: Server, ctx: AppContext) {
  server.so.sprk.feed.getSuggestedFeeds({
    auth: ctx.authVerifier.standardOptional,
    handler: async ({ auth, params, req }) => {
      const viewer = auth.credentials.iss;

      // @NOTE no need to coordinate the cursor for appview swap, as v1 doesn't use the cursor
      const suggestedRes = await ctx.dataplane.feedGens.getSuggestedFeeds(
        params.limit,
        params.cursor,
      );
      const uris = suggestedRes.uris;
      const labelers = ctx.reqLabelers(req);
      const hydrateCtx = await ctx.hydrator.createContext({ viewer, labelers });
      const hydration = await ctx.hydrator.hydrateFeedGens(uris, hydrateCtx);
      const feedViews = mapDefined(
        uris,
        (uri) => ctx.views.feedGenerator(uri, hydration),
      );

      return {
        encoding: "application/json",
        body: {
          feeds: feedViews,
          cursor: parseString(suggestedRes.cursor),
        },
        headers: resHeaders({}),
      };
    },
  });
}
