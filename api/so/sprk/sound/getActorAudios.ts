import { Server } from "../../../../lex/index.ts";
import { AppContext } from "../../../../main.ts";
import { transformAudiosToAudioViews } from "../../../../utils/audio-transformer.ts";
import { decodeBase64, encodeBase64 } from "@std/encoding";

interface CursorData {
  createdAt: string;
  id: string;
}

function parseCursor(cursor: string): CursorData {
  try {
    const decoded = new TextDecoder().decode(decodeBase64(cursor));
    const [createdAt, id] = decoded.split("::");
    if (!createdAt || !id) throw new Error("Invalid cursor format");
    return { createdAt, id };
  } catch {
    throw new Error("Invalid cursor format");
  }
}

function generateCursor(createdAt: string, id: string): string {
  return encodeBase64(new TextEncoder().encode(`${createdAt}::${id}`));
}

export default function (server: Server, ctx: AppContext) {
  server.so.sprk.sound.getActorAudios({
    auth: ctx.authVerifier.standardOptional,
    handler: async ({ params, auth }) => {
      try {
        const { actor, limit = 50, cursor } = params;
        const userDid = auth.credentials.type === "standard"
          ? auth.credentials.iss
          : undefined;

        // Resolve handle to DID if necessary
        let actorDid = actor;
        if (!actor.startsWith("did:")) {
          try {
            const didDoc = await ctx.resolver.resolveHandleToDidDoc(actor);
            actorDid = didDoc.did;
          } catch (err) {
            console.error("Failed to resolve handle:", err);
            return { status: 400, message: "Could not resolve actor handle" };
          }
        }

        // Block checks when authed
        if (userDid) {
          const [blockedByActor, blockingActor] = await Promise.all([
            ctx.db.models.Block.findOne({
              authorDid: actorDid,
              subject: userDid,
            }).lean(),
            ctx.db.models.Block.findOne({
              authorDid: userDid,
              subject: actorDid,
            }).lean(),
          ]);
          if (blockedByActor) {
            return {
              status: 400,
              error: "BlockedByActor" as const,
              message: "The requesting account is blocked by the actor",
            };
          }
          if (blockingActor) {
            return {
              status: 400,
              error: "BlockedActor" as const,
              message: "The requesting account has blocked the actor",
            };
          }
        }

        // Parse cursor
        let cursorData: CursorData | undefined;
        if (cursor) {
          try {
            cursorData = parseCursor(cursor);
          } catch {
            return { status: 400, message: "The provided cursor is invalid" };
          }
        }

        // Build query with keyset pagination
        const query: Record<string, unknown> = { authorDid: actorDid };
        if (cursorData) {
          query.$or = [
            { createdAt: { $lt: cursorData.createdAt } },
            { createdAt: cursorData.createdAt, _id: { $lt: cursorData.id } },
          ];
        }

        const audios = await ctx.db.models.Audio.find(query)
          .sort({ createdAt: -1, _id: -1 })
          .limit(limit + 1);

        const hasMore = audios.length > limit;
        if (hasMore) audios.pop();

        const audioViews = await transformAudiosToAudioViews(audios, ctx);

        let nextCursor: string | undefined;
        if (hasMore && audios.length > 0) {
          const last = audios[audios.length - 1];
          nextCursor = generateCursor(String(last.createdAt), String(last._id));
        }

        const body = {
          audios: audioViews,
          ...(nextCursor ? { cursor: nextCursor } : {}),
        };

        return { encoding: "application/json", body };
      } catch (error) {
        console.error("Unexpected error in getActorAudios:", error);
        if (error instanceof Error) {
          const msg = error.message.toLowerCase();
          if (msg.includes("cursor")) {
            return { status: 400, message: "The provided cursor is invalid" };
          }
          if (msg.includes("limit")) {
            return { status: 400, message: "Limit must be between 1 and 100" };
          }
        }
        return { status: 500, message: "Internal server error" };
      }
    },
  });
}
