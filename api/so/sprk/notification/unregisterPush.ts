import { Server } from "@atp/xrpc-server";

import { AppContext } from "../../../../context.ts";
import * as so from "../../../../lex/so.ts";

export default function (server: Server, ctx: AppContext) {
  server.add(so.sprk.notification.unregisterPush, {
    auth: ctx.authVerifier.standard,
    handler: async ({ input, auth }) => {
      const viewer = auth.credentials.iss;
      await ctx.dataplane.pushTokens.delete(viewer, input.body.token);
    },
  });
}
