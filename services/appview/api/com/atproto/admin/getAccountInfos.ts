import { AppContext } from "../../../../main.ts";
import { mapDefined } from "@atproto/common";
import { INVALID_HANDLE } from "@atproto/syntax";
import { Server } from "../../../../lexicon/index.ts";
import { AuthRequiredError } from "@sprk/xrpc-server";

export default function (server: Server, ctx: AppContext) {
  server.com.atproto.admin.getAccountInfos({
    auth: ctx.authVerifier.optionalStandardOrRole,
    handler: async ({ params, auth }) => {
      const { dids } = params;

      const { includeTakedowns } = ctx.authVerifier.parseCreds(auth);
      if (!includeTakedowns) {
        throw new AuthRequiredError("Requires admin privileges");
      }

      const infos = await Promise.all(mapDefined(dids, async (did) => {
        const info = await ctx.db.models.Actor.findOne({ did });
        if (!info) return;
        const profileRecord = await ctx.db.models.Profile.findOne({
          authorDid: did,
        });
        const profileObj = profileRecord
          ? { ...profileRecord.toJSON(), _id: undefined, __v: undefined }
          : undefined;

        return {
          $type: "com.atproto.admin.defs#accountView" as const,
          did,
          handle: info.handle ?? INVALID_HANDLE,
          relatedRecords: profileObj ? [profileObj] : undefined,
          indexedAt: info.indexedAt,
        };
      }));

      return {
        encoding: "application/json",
        body: {
          infos: infos.filter((info): info is NonNullable<typeof info> =>
            info != null
          ),
        },
      };
    },
  });
}
