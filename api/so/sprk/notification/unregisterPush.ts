import { AppContext } from "../../../../context.ts";
import { Server } from "../../../../lex/index.ts";

export default function (server: Server, ctx: AppContext) {
  server.so.sprk.notification.unregisterPush({
    auth: ctx.authVerifier.standard,
    handler: async ({ input, auth }) => {
      const viewer = auth.credentials.iss;
      await ctx.dataplane.pushTokens.delete(viewer, input.body.token);
    },
  });
}
