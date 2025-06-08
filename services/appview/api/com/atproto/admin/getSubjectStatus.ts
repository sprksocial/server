import { AppContext } from "../../../../main.ts";
import { Server } from "../../../../lexicon/index.ts";
import { AuthRequiredError, XRPCError } from "@sprk/xrpc-server";

export default function (server: Server, ctx: AppContext) {
  server.com.atproto.admin.getSubjectStatus({
    auth: ctx.authVerifier.optionalStandardOrRole,
    handler: async ({ params, auth }) => {
      const { did, uri, blob } = params;

      const { includeTakedowns } = ctx.authVerifier.parseCreds(auth);
      if (!includeTakedowns) {
        throw new AuthRequiredError("Requires admin privileges");
      }

      let subject: { $type: string } & Record<string, string>;
      let takedown: { applied: boolean; ref: string | undefined } | undefined;

      if (did) {
        const actor = await ctx.db.models.Actor.findOne({ did });
        const repoTakedown = await ctx.db.models.RepoTakedown.findOne({
          subjectDid: did,
        });
        if (!actor) {
          throw new XRPCError(404, "NotFound", "Actor not found");
        }
        subject = {
          $type: "com.atproto.admin.defs#repoRef",
          did: actor.did,
        };
        if (repoTakedown) {
          takedown = {
            applied: repoTakedown.applied,
            ref: repoTakedown.ref || undefined,
          };
        }
      } else if (uri) {
        const record = (await ctx.db.models.Profile.findOne({ uri })) ??
          (await ctx.db.models.Post.findOne({ uri })) ??
          (await ctx.db.models.Audio.findOne({ uri }));
        const recordTakedown = await ctx.db.models.Takedown.findOne({
          subjectUri: uri,
        });
        if (!record) {
          throw new XRPCError(404, "NotFound", "Record not found");
        }
        subject = {
          $type: "com.atproto.admin.defs#recordRef",
          uri: record.uri,
          cid: record.cid,
        };
        if (recordTakedown) {
          takedown = {
            applied: recordTakedown.applied,
            ref: recordTakedown.ref || undefined,
          };
        }
      } else if (blob) {
        const blobRecord = (await ctx.db.models.Profile.findOne({ blob })) ??
          (await ctx.db.models.Post.findOne({ blob })) ??
          (await ctx.db.models.Audio.findOne({ blob }));
        if (!blobRecord) {
          throw new XRPCError(404, "NotFound", "Blob record not found");
        }
        subject = {
          $type: "com.atproto.admin.defs#repoBlobRef",
          did: blobRecord.authorDid,
          cid: blobRecord.cid,
          recordUri: blobRecord.uri,
        };
        const blobTakedown = await ctx.db.models.BlobTakedown.findOne({
          subjectDid: blobRecord.authorDid,
          subjectCid: blobRecord.cid,
        });
        if (blobTakedown) {
          takedown = {
            applied: blobTakedown.applied,
            ref: blobTakedown.ref || undefined,
          };
        }
      } else {
        throw new XRPCError(
          400,
          "InvalidRequest",
          "Must provide did, uri, or blob",
        );
      }

      return {
        encoding: "application/json",
        body: { subject, takedown },
      };
    },
  });
}
