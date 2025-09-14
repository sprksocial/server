import { AtUri } from "@atproto/syntax";
import { InvalidRequestError } from "@sprk/xrpc-server";
import { Server } from "../../../../lex/index.ts";
import { AppContext } from "../../../../main.ts";
import { OutputSchema } from "../../../../lex/types/com/atproto/repo/getRecord.ts";
import { jsonStringToLex } from "@atproto/lexicon";

interface TakedownInfo {
  reason: string;
  takenDownBy: string;
  takenDownAt: string;
  warning: string;
}

export default function (server: Server, ctx: AppContext) {
  server.com.atproto.repo.getRecord({
    auth: ctx.authVerifier.optionalStandardOrRole,
    handler: async ({ params, auth }) => {
      const { repo, collection, rkey, cid } = params;
      const { includeTakedowns } = ctx.authVerifier.parseCreds(auth);

      if (!repo || !collection || !rkey) {
        throw new InvalidRequestError("Missing required parameters");
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

      try {
        const record = await ctx.db.models.Record.findOne({ uri }).lean();

        if (!record || (cid && record.cid !== cid)) {
          // For admins, provide more detailed information about what we tried to query
          if (includeTakedowns) {
            ctx.logger.info("Admin record lookup failed", {
              uri,
              collection,
              did,
              rkey,
              cid,
              foundRecord: !!record,
              cidMatch: record ? (cid ? record.cid === cid : true) : false,
            });
          }
          throw new InvalidRequestError(`Could not locate record: ${uri}`);
        }

        // Parse the original record JSON
        const recordValue = jsonStringToLex(record.json);

        // Check if the record is subject to a takedown
        const takedown = await ctx.takedownService.getTakedown(uri);

        // If record is taken down and user is not an admin, deny access
        if (takedown && !includeTakedowns) {
          throw new InvalidRequestError(`Record is taken down: ${uri}`);
        }

        // Format the response according to the output schema
        const response: OutputSchema & { takedown?: TakedownInfo } = {
          uri: uri,
          cid: record.cid,
          value: recordValue,
        };

        // Include takedown info for admins
        if (includeTakedowns && takedown) {
          response.takedown = {
            reason: takedown.reason,
            takenDownBy: takedown.takenDownBy,
            takenDownAt: takedown.takenDownAt,
            warning:
              "This content has been taken down and is only visible to admins",
          };
        }

        return {
          encoding: "application/json",
          body: response,
        };
      } catch (err) {
        if (err instanceof InvalidRequestError) {
          throw err;
        }
        throw new InvalidRequestError(`Error retrieving record: ${uri}`);
      }
    },
  });
}
