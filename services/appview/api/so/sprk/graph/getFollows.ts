import { Server } from "../../../../lexicon/index.ts";
import { FollowDocument } from "../../../../data-plane/server/models.ts";
import { AppContext } from "../../../../main.ts";
import { ensureValidDid, isValidHandle } from "@atproto/syntax";
import { RootFilterQuery } from "mongoose";
import { XRPCError } from "@sprk/xrpc-server";
import { OutputSchema } from "../../../../lexicon/types/so/sprk/graph/getFollows.ts";
import { getProfileView } from "../../../../utils/profile-helper.ts";

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

      const actorPref = await ctx.db.models.UserPreference.findOne({
        userDid: actorDid,
      });
      const actorFollowMode = actorPref?.followMode || "sprk";

      // Build query
      const query: RootFilterQuery<FollowDocument> = {
        authorDid: actorDid,
        type: actorFollowMode,
      };

      if (cursor) {
        query._id = { $gt: cursor };
      }

      // Get follows with pagination
      const follows = await ctx.db.models.Follow.find(query)
        .sort({ _id: 1 })
        .limit(limit)
        .lean();

      // Get next cursor
      const nextCursor = follows.length === limit
        ? follows[follows.length - 1]._id.toString()
        : undefined;

      // Get profile views for each follow
      const profileViews = await Promise.all(
        follows.map((follow: FollowDocument) =>
          getProfileView(ctx, follow.subject, viewerDid)
        ),
      );

      // Get subject profile if it exists
      const subjectProfileView = await getProfileView(ctx, actorDid, viewerDid);

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
