import { Server } from "../../../../lex/index.ts";
import { FollowDocument } from "../../../../data-plane/db/models.ts";
import { AppContext } from "../../../../main.ts";
import { ensureValidDid, isValidHandle } from "@atp/syntax";
import { RootFilterQuery } from "mongoose";
import { XRPCError } from "@atp/xrpc-server";
import { OutputSchema } from "../../../../lex/types/so/sprk/graph/getFollows.ts";
import {
  getProfileView,
  getProfileViews,
} from "../../../../utils/profile-helper.ts";

export default function (server: Server, ctx: AppContext) {
  server.so.sprk.graph.getFollows({
    auth: ctx.authVerifier.standardOptional,
    handler: async ({ params, auth }) => {
      const { actor } = params;
      const limit = params.limit;
      const cursor = params.cursor;
      const viewerDid = auth.credentials.type === "standard"
        ? auth.credentials.iss
        : undefined;

      let actorDid;

      if (isValidHandle(actor)) {
        const actorDidDoc = await ctx.resolver.resolveHandleToDidDoc(actor);
        actorDid = actorDidDoc.did;
      } else {
        try {
          ensureValidDid(actor);
          actorDid = actor;
        } catch (error) {
          ctx.logger.warn(
            "Failed to ensure valid DID",
            { did: actor, error: (error as Error).message },
          );
          throw new XRPCError(400, "Invalid actor DID");
        }
      }

      const query: RootFilterQuery<FollowDocument> = {
        authorDid: actorDid,
      };

      if (cursor) {
        query._id = { $gt: cursor };
      }

      // Get follows with pagination and subject profile concurrently
      const [follows, subjectProfileView] = await Promise.all([
        ctx.db.models.Follow.find(query)
          .sort({ _id: 1 })
          .limit(limit)
          .lean(),
        getProfileView(ctx, actorDid, viewerDid),
      ]);

      // Get next cursor
      const nextCursor = follows.length === limit
        ? follows[follows.length - 1]._id.toString()
        : undefined;

      // Extract follow subject DIDs and batch fetch profile views
      const followSubjectDids = follows.map((follow: FollowDocument) =>
        follow.subject
      );
      const profileViews = await getProfileViews(
        ctx,
        followSubjectDids,
        viewerDid,
      );

      const res = {
        encoding: "application/json",
        body: {
          subject: subjectProfileView,
          follows: profileViews,
          cursor: nextCursor,
        } satisfies OutputSchema,
      } as const;

      return res;
    },
  });
}
