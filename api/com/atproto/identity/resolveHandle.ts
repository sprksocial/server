import type { DidString } from "@atp/lex";
import * as ident from "@atp/syntax";
import { InvalidRequestError, Server } from "@atp/xrpc-server";

import { AppContext } from "../../../../context.ts";
import * as com from "../../../../lex/com.ts";

export default function (server: Server, ctx: AppContext) {
  server.add(com.atproto.identity.resolveHandle, {
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
        body: { did: actor.did as DidString },
      };
    },
  });
}
