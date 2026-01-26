import { AppContext } from "../../../../context.ts";
import { Server } from "../../../../lex/index.ts";

export default function (server: Server, ctx: AppContext) {
  server.so.sprk.notification.registerPush({
    auth: ctx.authVerifier.standard,
    handler: async ({ input, auth }) => {
      const viewer = auth.credentials.iss;
      await ctx.dataplane.pushTokens.upsert({
        did: viewer,
        token: input.body.token,
        platform: input.body.platform as "ios" | "android" | "web",
        appId: input.body.appId,
        serviceDid: input.body.serviceDid,
      });
    },
  });
}
