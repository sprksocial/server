import { HTTPException } from "hono/http-exception";
import { AppContext } from "../../../../main.ts";
import { Server } from "../../../../lexicon/index.ts";
import type * as ComAtprotoAdminDefs from "../../../../lexicon/types/com/atproto/admin/defs.ts";
import type * as ComAtprotoRepoStrongRef from "../../../../lexicon/types/com/atproto/repo/strongRef.ts";
import { AuthRequiredError } from "@sprk/xrpc-server";

export default function (server: Server, ctx: AppContext) {
  server.com.atproto.admin.updateSubjectStatus({
    auth: ctx.authVerifier.optionalStandardOrRole,
    handler: async ({ input, auth }) => {
      const { subject, takedown } = input.body;
      if (!takedown || typeof takedown.applied !== "boolean") {
        throw new HTTPException(400, { message: "Invalid takedown status" });
      }

      const { canPerformTakedown } = ctx.authVerifier.parseCreds(auth);
      if (!canPerformTakedown) {
        throw new AuthRequiredError("Requires admin privileges");
      }

      try {
        if (subject.$type === "com.atproto.admin.defs#repoRef") {
          const repoRef = subject as ComAtprotoAdminDefs.RepoRef;
          if (!repoRef.did) {
            throw new HTTPException(400, {
              message: "DID is required for repo takedowns",
            });
          }

          if (takedown.applied) {
            await ctx.takedownService.takedownRepo({
              did: repoRef.did,
              reason: "Moderation action",
              adminDid: auth.credentials.type === "standard"
                ? auth.credentials.iss
                : "admin",
              ref: takedown.ref,
            });
            await ctx.takedownService.updateRepoTakedownApplied(
              repoRef.did,
              takedown.applied,
            );
          } else {
            await ctx.takedownService.removeRepoTakedown(repoRef.did);
          }
        } else if (subject.$type === "com.atproto.admin.defs#recordRef") {
          const recordRef = subject as ComAtprotoRepoStrongRef.Main;
          if (!recordRef.uri || !recordRef.cid) {
            throw new HTTPException(400, {
              message: "URI and CID are required for record takedowns",
            });
          }

          if (takedown.applied) {
            await ctx.takedownService.takedownContent({
              targetUri: recordRef.uri,
              targetCid: recordRef.cid,
              reason: "Moderation action",
              adminDid: auth.credentials.type === "standard"
                ? auth.credentials.iss
                : "admin",
            });
            await ctx.takedownService.updateTakedownApplied(
              recordRef.uri,
              takedown.applied,
            );
          } else {
            await ctx.takedownService.removeTakedown(recordRef.uri);
          }
        } else if (subject.$type === "com.atproto.admin.defs#repoBlobRef") {
          const repoBlobRef = subject as ComAtprotoAdminDefs.RepoBlobRef;
          if (!repoBlobRef.did || !repoBlobRef.cid) {
            throw new HTTPException(400, {
              message: "DID and CID are required for blob takedowns",
            });
          }

          if (takedown.applied) {
            await ctx.takedownService.takedownBlob({
              did: repoBlobRef.did,
              cid: repoBlobRef.cid,
              reason: "Moderation action",
              adminDid: auth.credentials.type === "standard"
                ? auth.credentials.iss
                : "admin",
              ref: takedown.ref,
            });
            await ctx.takedownService.updateBlobTakedownApplied(
              repoBlobRef.did,
              repoBlobRef.cid,
              takedown.applied,
            );
          } else {
            await ctx.takedownService.removeBlobTakedown(
              repoBlobRef.did,
              repoBlobRef.cid,
            );
          }
        } else {
          throw new HTTPException(400, {
            message: `Unsupported subject type: ${subject.$type}`,
          });
        }

        return {
          encoding: "application/json",
          body: {
            subject,
            takedown: takedown.applied ? takedown : undefined,
          },
        };
      } catch (err) {
        if (err instanceof HTTPException) throw err;
        throw new HTTPException(500, { message: "Internal server error" });
      }
    },
  });
}
