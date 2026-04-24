import {
  AuthRequiredError,
  InvalidRequestError,
  Server,
} from "@atp/xrpc-server";

import { AppContext } from "../../../../context.ts";
import * as com from "../../../../lex/com.ts";
import {
  repoBlobRef,
  repoRef,
} from "../../../../lex/com/atproto/admin/defs.ts";
import { main as strongRef } from "../../../../lex/com/atproto/repo/strongRef.ts";
import type { $InputBody } from "../../../../lex/com/atproto/admin/updateSubjectStatus.ts";

type Subject = $InputBody["subject"];
type RepoRefSubject = Extract<
  Subject,
  { $type: "com.atproto.admin.defs#repoRef" }
>;
type StrongRefSubject = Extract<
  Subject,
  { $type: "com.atproto.repo.strongRef" }
>;
type RepoBlobRefSubject = Extract<
  Subject,
  { $type: "com.atproto.admin.defs#repoBlobRef" }
>;

const isRepoRef = (subject: Subject): subject is RepoRefSubject =>
  repoRef.isTypeOf(subject as Record<string, unknown>);

const isStrongRef = (subject: Subject): subject is StrongRefSubject =>
  strongRef.isTypeOf(subject as Record<string, unknown>);

const isRepoBlobRef = (subject: Subject): subject is RepoBlobRefSubject =>
  repoBlobRef.isTypeOf(subject as Record<string, unknown>);

export default function (server: Server, ctx: AppContext) {
  server.add(com.atproto.admin.updateSubjectStatus, {
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
