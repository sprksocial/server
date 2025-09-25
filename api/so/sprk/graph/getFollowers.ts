import { Server } from "../../../../lex/index.ts";
import { AppContext } from "../../../../main.ts";
import { FollowDocument } from "../../../../data-plane/db/models.ts";
import { ensureValidDid, isValidHandle } from "@atp/syntax";
import { RootFilterQuery } from "mongoose";
import { XRPCError } from "@atp/xrpc-server";
import { OutputSchema } from "../../../../lex/types/so/sprk/graph/getFollowers.ts";
import {
  getProfileView,
  getProfileViews,
} from "../../../../utils/profile-helper.ts";

export default function (server: Server, ctx: AppContext) {
  server.so.sprk.graph.getFollowers({
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
        subject: actorDid,
      };

      if (cursor) {
        query._id = { $gt: cursor };
      }

      // Get followers with pagination and subject profile concurrently
      const [followers, subjectProfileView] = await Promise.all([
        ctx.db.models.Follow.find(query)
          .sort({ _id: 1 })
          .limit(limit)
          .lean(),
        getProfileView(ctx, actorDid, viewerDid),
      ]);

      // Get next cursor
      const nextCursor = followers.length === limit
        ? followers[followers.length - 1]._id.toString()
        : undefined;

      // Extract follower DIDs and batch fetch profile views
      const followerDids = followers.map((follow: FollowDocument) =>
        follow.authorDid
      );
      const profileViews = await getProfileViews(ctx, followerDids, viewerDid);

      const res = {
        encoding: "application/json",
        body: {
          subject: subjectProfileView,
          followers: profileViews,
          cursor: nextCursor,
        } satisfies OutputSchema,
      } as const;

      return res;
    },
  });
}
