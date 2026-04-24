import { mapDefined } from "@atp/common";
import type { DatetimeString, HandleString, UnknownObject } from "@atp/lex";
import { INVALID_HANDLE } from "@atp/syntax";
import { Server } from "@atp/xrpc-server";

import { AppContext } from "../../../../context.ts";
import * as com from "../../../../lex/com.ts";
import type { $OutputBody } from "../../../../lex/com/atproto/admin/getAccountInfos.ts";

export default function (server: Server, ctx: AppContext) {
  server.add(com.atproto.admin.getAccountInfos, {
    auth: ctx.authVerifier.optionalStandardOrRole,
    handler: async ({ params, auth }) => {
      const { dids } = params;
      const { includeTakedowns } = ctx.authVerifier.parseCreds(auth);

      const actors = await ctx.hydrator.actor.getActors(dids, {
        includeTakedowns: true,
      });

      const infos: $OutputBody["infos"] = mapDefined(dids, (did) => {
        const info = actors.get(did);
        if (!info) return;
        if (info.takedownRef && !includeTakedowns) return;
        const profileRecord = !info.profileTakedownRef || includeTakedowns
          ? info.profile
          : undefined;

        return {
          did,
          handle: (info.handle ?? INVALID_HANDLE) as HandleString,
          relatedRecords: profileRecord
            ? [profileRecord as UnknownObject]
            : undefined,
          indexedAt: (info.sortedAt ?? new Date(0))
            .toISOString() as DatetimeString,
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
