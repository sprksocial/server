import { Server } from "../../../../lex/index.ts";
import { AppContext } from "../../../../main.ts";
import { transformPostsToPostViews } from "../../../../utils/post-transformer.ts";
import { decodeBase64, encodeBase64 } from "jsr:@std/encoding";
import { transformAudioToAudioView } from "../../../../utils/audio-transformer.ts";
import { RootFilterQuery } from "mongoose";
import { PostDocument } from "../../../../data-plane/server/models.ts";

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
  server.so.sprk.sound.getAudioPosts({
    auth: ctx.authVerifier.standardOptional,
    handler: async ({ params, auth }) => {
      try {
        const { uri, limit = 50, cursor } = params;
        const userDid = auth.credentials.type === "standard"
          ? auth.credentials.iss
          : undefined;

        let cursorData: CursorData | undefined;
        if (cursor) {
          try {
            cursorData = parseCursor(cursor);
          } catch {
            return { status: 400, message: "The provided cursor is invalid" };
          }
        }

        const dbAudio = await ctx.db.models.Audio.findOne({
          uri: uri,
        })
          .lean()
          .exec();

        if (!dbAudio) {
          return { status: 404, message: "Audio not found" };
        }

        const audioView = await transformAudioToAudioView(dbAudio, ctx);

        const query: RootFilterQuery<PostDocument> = {
          "sound.uri": uri,
          reply: null,
        };

        if (cursorData) {
          query.$or = [
            { createdAt: { $lt: cursorData.createdAt } },
            { createdAt: cursorData.createdAt, _id: { $lt: cursorData.id } },
          ];
        }

        const posts = await ctx.db.models.Post
          .find(query)
          .sort({ createdAt: -1, _id: -1 })
          .limit(limit + 1)
          .lean();

        const hasMore = posts.length > limit;
        if (hasMore) posts.pop();

        // Block relationships: filter out posts by authors blocked by or blocking user
        if (userDid && posts.length > 0) {
          const authorDids = [...new Set(posts.map((p) => p.authorDid))];
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
          const blockedAuthorDids = new Set<string>([
            ...userBlocking.map((b) => b.subject),
            ...userBlocked.map((b) => b.authorDid),
          ]);
          for (let i = posts.length - 1; i >= 0; i--) {
            if (blockedAuthorDids.has(posts[i].authorDid)) posts.splice(i, 1);
          }
        }

        const postViews = await transformPostsToPostViews(posts, ctx, userDid);

        let nextCursor: string | undefined;
        if (hasMore && posts.length > 0) {
          const last = posts[posts.length - 1];
          nextCursor = generateCursor(String(last.createdAt), String(last._id));
        }

        const body = {
          audio: audioView,
          posts: postViews,
          ...(nextCursor ? { cursor: nextCursor } : {}),
        };
        return { encoding: "application/json", body };
      } catch (error) {
        console.error("Unexpected error in getAudioPosts:", error);
        return { status: 500, message: "Internal server error" };
      }
    },
  });
}
