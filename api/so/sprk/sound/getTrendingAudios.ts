import { Server } from "../../../../lex/index.ts";
import { AppContext } from "../../../../context.ts";
import { transformAudiosToAudioViews } from "../../../../utils/audio-transformer.ts";
import { AudioDocument } from "../../../../data-plane/db/models.ts";

interface AudioAggDoc {
  uri: string;
  createdAt: string | Date;
}
interface BlockDoc {
  authorDid: string;
  subject: string;
}

export default function (server: Server, ctx: AppContext) {
  server.so.sprk.sound.getTrendingAudios({
    auth: ctx.authVerifier.standardOptional,
    handler: async ({ params, auth }) => {
      const { limit = 25, cursor } = params;
      const userDid = auth.credentials.type === "standard"
        ? auth.credentials.iss
        : undefined;

      let skip = 0;
      if (cursor) {
        const parsed = parseInt(cursor, 10);
        if (!isNaN(parsed) && parsed > 0) skip = parsed;
      }

      // Rank by: useCount desc, then createdAt desc
      const docsPage = await ctx.db.models.Audio.find({})
        .sort({ useCount: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();
      const uris = docsPage.map((a) => a.uri);

      // Fetch full audio documents and preserve order
      const docs = await ctx.db.models.Audio.find({ uri: { $in: uris } });
      const byUri = new Map(docs.map((d) => [d.uri, d] as const));
      let audiosOrdered: AudioDocument[] = [];
      for (const uri of uris) {
        const doc = byUri.get(uri);
        if (doc) audiosOrdered.push(doc);
      }

      // Block filtering like other endpoints: when authed, filter out audios authored by blocked accounts
      if (userDid && audiosOrdered.length > 0) {
        const authorDids = [...new Set(audiosOrdered.map((a) => a.authorDid))];
        const [blocking, blockedBy] = await Promise.all([
          ctx.db.models.Block.find({
            authorDid: userDid,
            subject: { $in: authorDids },
          }).lean(),
          ctx.db.models.Block.find({
            authorDid: { $in: authorDids },
            subject: userDid,
          }).lean(),
        ]) satisfies [BlockDoc[], BlockDoc[]];
        const blockedSet = new Set<string>([
          ...blocking.map((b) => b.subject),
          ...blockedBy.map((b) => b.authorDid),
        ]);
        audiosOrdered = audiosOrdered.filter((a) =>
          !blockedSet.has(a.authorDid)
        );
      }

      const views = await transformAudiosToAudioViews(audiosOrdered, ctx);

      let nextCursor: string | undefined;
      if (views.length === limit) {
        nextCursor = (skip + limit).toString();
      }

      const body = {
        audios: views,
        ...(nextCursor ? { cursor: nextCursor } : {}),
      };

      return { encoding: "application/json", body };
    },
  });
}
