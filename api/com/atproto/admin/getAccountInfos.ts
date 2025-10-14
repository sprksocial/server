import { mapDefined } from "@atp/common";
import { INVALID_HANDLE } from "@atp/syntax";
import { AppContext } from "../../../../context.ts";
import { Server } from "../../../../lex/index.ts";

export default function (server: Server, ctx: AppContext) {
  server.com.atproto.admin.getAccountInfos({
    auth: ctx.authVerifier.optionalStandardOrRole,
    handler: async ({ params, auth }) => {
      const { dids } = params;
      const { includeTakedowns } = ctx.authVerifier.parseCreds(auth);

      const actors = await ctx.hydrator.actor.getActors(dids, {
        includeTakedowns: true,
      });

      const infos = mapDefined(dids, (did) => {
        const info = actors.get(did);
        if (!info) return;
        if (info.takedownRef && !includeTakedowns) return;
        const profileRecord = !info.profileTakedownRef || includeTakedowns
          ? info.profile
          : undefined;

        return {
          did,
          handle: info.handle ?? INVALID_HANDLE,
          relatedRecords: profileRecord ? [profileRecord] : undefined,
          indexedAt: (info.sortedAt ?? new Date(0)).toISOString(),
        };
      });

      return {
        encoding: "application/json",
        body: {
          infos,
        },
      };
    },
  });
}
