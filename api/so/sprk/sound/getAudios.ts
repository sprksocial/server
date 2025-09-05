import { Server } from "../../../../lex/index.ts";
import { AppContext } from "../../../../main.ts";
import { transformAudiosToAudioViews } from "../../../../utils/audio-transformer.ts";
import { AudioDocument } from "../../../../data-plane/db/models.ts";

// Constants
const MAX_URI_LENGTH = 3000;

// Helper function to validate URIs
function validateUris(uris: string[]): { valid: string[]; invalid: string[] } {
  const valid: string[] = [];
  const invalid: string[] = [];

  for (const uri of uris) {
    if (typeof uri !== "string" || uri.length === 0) {
      invalid.push(uri);
      continue;
    }

    if (uri.length > MAX_URI_LENGTH) {
      invalid.push(uri);
      continue;
    }

    if (!uri.startsWith("at://")) {
      invalid.push(uri);
      continue;
    }

    valid.push(uri);
  }

  return { valid, invalid };
}

// Helper function to deduplicate URIs while preserving order
function deduplicateUris(uris: string[]): string[] {
  const seen = new Set<string>();
  return uris.filter((uri) => {
    if (seen.has(uri)) return false;
    seen.add(uri);
    return true;
  });
}

// Helper function to check for blocked relationships
async function checkBlockedAudios(
  ctx: AppContext,
  audios: AudioDocument[],
  userDid?: string,
): Promise<Set<string>> {
  if (!userDid || audios.length === 0) return new Set();

  const authorDids = [...new Set(audios.map((a) => a.authorDid))];

  const [userBlocking, userBlocked] = await Promise.all([
    ctx.db.models.Block.find({
      authorDid: userDid,
      subject: { $in: authorDids },
    }).lean(),
    ctx.db.models.Block.find({
      authorDid: { $in: authorDids },
      subject: userDid,
    }).lean(),
  ]);

  const blockedAuthorDids = new Set([
    ...userBlocking.map((b) => b.subject),
    ...userBlocked.map((b) => b.authorDid),
  ]);

  return new Set(
    audios.filter((a) => blockedAuthorDids.has(a.authorDid)).map((a) => a.uri),
  );
}

// Helper function to sort audios by original URI order
function sortAudiosByUriOrder(
  audios: AudioDocument[],
  originalUris: string[],
): AudioDocument[] {
  const map = new Map(audios.map((a) => [a.uri, a] as const));
  const sorted: AudioDocument[] = [];
  for (const uri of originalUris) {
    const audio = map.get(uri);
    if (audio) sorted.push(audio);
  }
  return sorted;
}

export default function (server: Server, ctx: AppContext) {
  server.so.sprk.sound.getAudios({
    auth: ctx.authVerifier.standardOptional,
    handler: async ({ params, auth }) => {
      try {
        const { uris } = params;
        const userDid = auth.credentials.type === "standard"
          ? auth.credentials.iss
          : undefined;

        const { valid: validUris, invalid: invalidUris } = validateUris(
          uris,
        );
        if (invalidUris.length > 0) {
          console.warn(
            `Invalid URIs provided: ${invalidUris.slice(0, 5).join(", ")}${
              invalidUris.length > 5 ? "..." : ""
            }`,
          );
        }
        if (validUris.length === 0) {
          return {
            encoding: "application/json",
            body: { audios: [] },
          };
        }

        const uniqueUris = deduplicateUris(validUris);

        const dbAudios = await ctx.db.models.Audio.find({
          uri: { $in: uniqueUris },
        })
          .lean()
          .exec();

        if (dbAudios.length === 0) {
          return {
            encoding: "application/json",
            body: { audios: [] },
          };
        }

        const blockedAudioUris = await checkBlockedAudios(
          ctx,
          dbAudios,
          userDid,
        );
        const accessibleAudios = dbAudios.filter((a) =>
          !blockedAudioUris.has(a.uri)
        );
        if (accessibleAudios.length === 0) {
          return {
            encoding: "application/json",
            body: { audios: [] },
          };
        }

        const sorted = sortAudiosByUriOrder(accessibleAudios, uniqueUris);
        const views = await transformAudiosToAudioViews(sorted, ctx);

        const response = { audios: views };
        return { encoding: "application/json", body: response };
      } catch (error) {
        console.error("Error in getAudios:", error);
        if (error instanceof Error) {
          const message = error.message;
          if (message.includes("connection") || message.includes("timeout")) {
            return { status: 503, message: "Database temporarily unavailable" };
          }
          if (message.includes("validation") || message.includes("invalid")) {
            return { status: 400, message: "Invalid request parameters" };
          }
          if (message.includes("limit") || message.includes("quota")) {
            return { status: 429, message: "Rate limit exceeded" };
          }
        }
        return { status: 500, message: "Internal server error" };
      }
    },
  });
}
