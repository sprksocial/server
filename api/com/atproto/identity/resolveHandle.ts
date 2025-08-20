import * as ident from "@atproto/syntax";
import { InvalidRequestError } from "@sprk/xrpc-server";
import { Server } from "../../../../lex/index.ts";
import { AppContext } from "../../../../main.ts";

export default function (server: Server, ctx: AppContext) {
  server.com.atproto.identity.resolveHandle({
    handler: async ({ params }) => {
      const { handle } = params;
      if (!handle) {
        throw new InvalidRequestError("Missing handle");
      }

      const normalizedHandle = ident.normalizeHandle(handle);
      const actor = await ctx.db.models.Actor.findOne({
        handle: normalizedHandle,
      });
      if (!actor) {
        throw new InvalidRequestError("Unable to resolve handle");
      }

      return {
        encoding: "application/json",
        body: { did: actor.did },
      };
    },
  });
}
