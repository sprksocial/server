import { AtUri } from "@atproto/syntax";
import { InvalidRequestError } from "@sprk/xrpc-server";
import { Hono } from "hono";

import { optionalAuthMiddleware } from "../../../../services/auth/middleware.ts";
import { AppContext, AppEnv } from "../../../../main.ts";
import { OutputSchema } from "../../../../lexicon/types/com/atproto/repo/getRecord.ts";

interface TakedownInfo {
  reason: string;
  takenDownBy: string;
  takenDownAt: string;
  warning: string;
}

export const createGetRecordRouter = (ctx: AppContext) => {
  const router = new Hono<AppEnv>();

  router.get(
    "/xrpc/com.atproto.repo.getRecord",
    optionalAuthMiddleware,
    async (c) => {
      const { repo, collection, rkey, cid } = c.req.query();
      const isAdmin = c.get("isAdmin") as boolean | undefined;

      if (!repo || !collection || !rkey) {
        return c.json({ error: "Missing required parameters" }, 400);
      }

      // Resolve the handle to DID if needed
      let did;
      try {
        if (repo.startsWith("did:")) {
          did = repo;
        } else {
          // Assume it's a handle
          const didDoc = await ctx.resolver.resolveHandleToDidDoc(repo);
          did = didDoc.did;
        }
      } catch {
        throw new InvalidRequestError(`Could not find repo: ${repo}`);
      }

      if (!did) {
        throw new InvalidRequestError(`Could not find repo: ${repo}`);
      }

      // Create the URI
      const uri = AtUri.make(did, collection, rkey).toString();

      // Get the record based on the collection type
      try {
        let record = null;

        // Check which collection to query based on the NSID
        if (collection.includes("post") || collection.endsWith("post")) {
          record = await ctx.db.models.Post.findOne({ uri }).lean();
        } else if (collection.includes("repost")) {
          record = await ctx.db.models.Repost.findOne({ uri }).lean();
        } else if (collection.includes("like")) {
          record = await ctx.db.models.Like.findOne({ uri }).lean();
        } else if (collection.includes("look")) {
          record = await ctx.db.models.Look.findOne({ uri }).lean();
        } else if (collection.includes("profile")) {
          record = await ctx.db.models.Profile.findOne({ authorDid: did })
            .lean();
        } else if (collection.includes("follow")) {
          record = await ctx.db.models.Follow.findOne({ uri }).lean();
        } else if (collection.includes("block")) {
          record = await ctx.db.models.Block.findOne({ uri }).lean();
        }

        if (!record || (cid && record.cid !== cid)) {
          // For admins, provide more detailed information about what we tried to query
          if (isAdmin) {
            ctx.logger.info({
              uri,
              collection,
              did,
              rkey,
              cid,
              foundRecord: !!record,
              cidMatch: record ? (cid ? record.cid === cid : true) : false,
            }, "Admin record lookup failed");
          }
          throw new InvalidRequestError(`Could not locate record: ${uri}`);
        }

        // Check if the record is subject to a takedown
        const takedown = await ctx.takedownService.getTakedown(uri);

        // If record is taken down and user is not an admin, deny access
        if (takedown && !isAdmin) {
          throw new InvalidRequestError(`Record is taken down: ${uri}`);
        }

        // Format the response according to the output schema
        const response: OutputSchema & { takedown?: TakedownInfo } = {
          uri: uri,
          cid: record.cid,
          value: record,
        };

        // Include takedown info for admins
        if (isAdmin && takedown) {
          response.takedown = {
            reason: takedown.reason,
            takenDownBy: takedown.takenDownBy,
            takenDownAt: takedown.takenDownAt,
            warning:
              "This content has been taken down and is only visible to admins",
          };
        }

        return c.json(response);
      } catch (err) {
        if (err instanceof InvalidRequestError) {
          throw err;
        }
        throw new InvalidRequestError(`Error retrieving record: ${uri}`);
      }
    },
  );

  return router;
};

export default (ctx: AppContext) => createGetRecordRouter(ctx);
