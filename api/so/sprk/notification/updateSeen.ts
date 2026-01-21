import { AppContext } from "../../../../context.ts";
import { Server } from "../../../../lex/index.ts";

export default function (server: Server, ctx: AppContext) {
  server.so.sprk.notification.updateSeen({
    auth: ctx.authVerifier.standard,
    handler: async ({ input, auth }) => {
      const viewer = auth.credentials.iss;
      const seenAt = input.body.seenAt;
      // For now we keep separate seen times behind the scenes for priority,
      // but treat them as a single seen time.
      await Promise.all([
        ctx.hydrator.dataplane.notifications.updateNotificationSeen(
          viewer,
          seenAt,
          false,
        ),
        ctx.hydrator.dataplane.notifications.updateNotificationSeen(
          viewer,
          seenAt,
          true,
        ),
      ]);
    },
  });
}
