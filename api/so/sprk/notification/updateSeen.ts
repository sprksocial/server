import { Server } from "@atp/xrpc-server";

import { AppContext } from "../../../../context.ts";
import * as so from "../../../../lex/so.ts";

export default function (server: Server, ctx: AppContext) {
  server.add(so.sprk.notification.updateSeen, {
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

      // Reset badge count on iOS devices
      // Fire and forget - don't block the response
      ctx.pushService.sendBadgeReset(viewer).catch((err) => {
        console.error("Failed to send badge reset", { err, viewer });
      });
    },
  });
}
