import type * as SoSprkSoundDefs from "../lex/types/so/sprk/sound/defs.ts";
import { AudioDocument } from "../data-plane/db/models.ts";
import { AppContext } from "../context.ts";
import { createProfileViewBasic } from "./profile-helper.ts";
import type { Label } from "../lex/types/com/atproto/label/defs.ts";

// Transform a single DB audio to AudioView format
export async function transformAudioToAudioView(
  audio: AudioDocument,
  ctx: AppContext,
  usageCount?: number,
): Promise<SoSprkSoundDefs.AudioView> {
  const authorView = await createProfileViewBasic(audio.authorDid, ctx);

  const labels = audio.labels
    ? Array.isArray(audio.labels) ? (audio.labels as Label[]) : undefined
    : undefined;
  const details = audio.details ? { ...audio.details } : undefined;

  const record = {
    title: audio.title,
    origin: audio.origin ?? undefined,
    sound: audio.sound ?? undefined,
    labels: audio.labels ?? undefined,
    createdAt: audio.createdAt,
  } as Record<string, unknown>;

  const audioCid = audio.sound.ref.$link;
  const audioUrl = `https://media.sprk.so/sound/${
    encodeURIComponent(audio.authorDid)
  }/${encodeURIComponent(audioCid)}`;

  return {
    uri: audio.uri,
    cid: audio.cid,
    author: authorView,
    title: audio.title,
    coverArt: authorView.avatar ?? "",
    record,
    useCount: usageCount ?? 0,
    details,
    indexedAt: audio.indexedAt,
    audio: audioUrl,
    labels,
  };
}

// Batch transform DB audios to AudioView format
export async function transformAudiosToAudioViews(
  audios: AudioDocument[],
  ctx: AppContext,
): Promise<SoSprkSoundDefs.AudioView[]> {
  if (audios.length === 0) return [];

  // Prefetch authors
  const authorDids = [...new Set(audios.map((a) => a.authorDid))];
  const authors = await Promise.all(
    authorDids.map((did) => createProfileViewBasic(did, ctx)),
  );
  const authorsMap = new Map(authors.map((a) => [a.did, a]));

  // Usage count: how many posts reference this audio record
  const audioUris = audios.map((a) => a.uri);
  const usageAgg = await ctx.db.models.Post.aggregate([
    { $match: { "sound.uri": { $in: audioUris } } },
    { $group: { _id: "$sound.uri", count: { $sum: 1 } } },
  ]);
  const usageMap = new Map<string, number>(
    usageAgg.map((u: { _id: string; count: number }) => [u._id, u.count]),
  );

  return audios.map((audio) => {
    const labels = audio.labels
      ? Array.isArray(audio.labels) ? (audio.labels as Label[]) : undefined
      : undefined;

    const details = audio.details ? { ...audio.details } : undefined;

    const record = {
      title: audio.title,
      origin: audio.origin ?? undefined,
      sound: audio.sound ?? undefined,
      labels: audio.labels ?? undefined,
      details: audio.details ?? undefined,
      createdAt: audio.createdAt,
    } satisfies Record<string, unknown>;

    const coverArt = authorsMap.get(audio.authorDid)?.avatar ?? "";

    const audioCid = audio.sound.ref.$link;
    const audioUrl = `https://media.sprk.so/sound/${
      encodeURIComponent(audio.authorDid)
    }/${encodeURIComponent(audioCid)}`;

    return {
      uri: audio.uri,
      cid: audio.cid,
      author: authorsMap.get(audio.authorDid)!,
      title: audio.title,
      coverArt,
      record,
      useCount: usageMap.get(audio.uri) ?? 0,
      details,
      indexedAt: audio.indexedAt,
      audio: audioUrl,
      labels,
    } satisfies SoSprkSoundDefs.AudioView;
  });
}
