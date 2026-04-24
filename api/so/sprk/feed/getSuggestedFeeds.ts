import { mapDefined } from "@atp/common";
import { Server } from "@atp/xrpc-server";

import { AppContext } from "../../../../context.ts";
import { parseString } from "../../../../hydration/util.ts";
import * as so from "../../../../lex/so.ts";
import { createHydrateCtxFromAuth, resHeaders } from "../../../util.ts";

export default function (server: Server, ctx: AppContext) {
  server.add(so.sprk.feed.getSuggestedFeeds, {
    auth: ctx.authVerifier.standardOptional,
    handler: async ({ auth, params, req }) => {
      // @NOTE no need to coordinate the cursor for appview swap, as v1 doesn't use the cursor
      const suggestedRes = await ctx.dataplane.feedGens.getSuggestedFeeds(
        params.limit,
        params.cursor,
      );
      const uris = suggestedRes.uris;
      const hydrateCtx = await createHydrateCtxFromAuth(ctx, req, auth);
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
        headers: resHeaders({ labelers: hydrateCtx.labelers }),
      };
    },
  });
}
