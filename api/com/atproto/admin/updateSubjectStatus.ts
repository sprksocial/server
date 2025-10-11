import { AuthRequiredError, InvalidRequestError } from "@atp/xrpc-server";
import { AppContext } from "../../../../context.ts";
import { Server } from "../../../../lex/index.ts";
import {
  isRepoBlobRef,
  isRepoRef,
} from "../../../../lex/types/com/atproto/admin/defs.ts";
import { isMain as isStrongRef } from "../../../../lex/types/com/atproto/repo/strongRef.ts";

export default function (server: Server, ctx: AppContext) {
  server.com.atproto.admin.updateSubjectStatus({
    auth: ctx.authVerifier.roleOrModService,
    handler: async ({ input, auth }) => {
      const { canPerformTakedown } = ctx.authVerifier.parseCreds(auth);
      if (!canPerformTakedown) {
        throw new AuthRequiredError(
          "Must be a full moderator to update subject state",
        );
      }
      const { subject, takedown } = input.body;
      if (takedown) {
        if (isRepoRef(subject)) {
          if (takedown.applied) {
            await ctx.dataplane.moderation.takedownActor(
              subject.did,
              takedown.ref,
            );
          } else {
            await ctx.dataplane.moderation.untakedownActor(
              subject.did,
            );
          }
        } else if (isStrongRef(subject)) {
          if (takedown.applied) {
            await ctx.dataplane.moderation.takedownRecord(
              subject.uri,
              takedown.ref,
            );
          } else {
            await ctx.dataplane.moderation.untakedownRecord(
              subject.uri,
            );
          }
        } else if (isRepoBlobRef(subject)) {
          if (takedown.applied) {
            await ctx.dataplane.moderation.takedownBlob(
              subject.did,
              subject.cid,
              takedown.ref,
            );
          } else {
            await ctx.dataplane.moderation.untakedownBlob(
              subject.did,
              subject.cid,
            );
          }
        } else {
          throw new InvalidRequestError("Invalid subject");
        }
      }

      return {
        encoding: "application/json",
        body: {
          subject,
          takedown,
        },
      };
    },
  });
}
