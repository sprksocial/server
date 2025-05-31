import * as ident from "@atproto/syntax";
import { InvalidRequestError } from "@atproto/xrpc-server";
import { AppContext } from "../../../../main.ts";
import { Hono } from "hono";

export const createResolveHandleRouter = (ctx: AppContext) => {
  const router = new Hono();

  router.get("/xrpc/com.atproto.identity.resolveHandle", async (c) => {
    if (!c.req.query("handle")) {
      throw new InvalidRequestError("Missing handle");
    }

    const handle = ident.normalizeHandle(c.req.query("handle")!);

    const actor = await ctx.db.models.Actor.findOne({ handle });
    if (!actor) {
      throw new InvalidRequestError("Unable to resolve handle");
    }

    return c.json({ did: actor.did });
  });

  return router;
};
