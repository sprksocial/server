import { CID } from "multiformats/cid";
import { AtUri, normalizeDatetimeAlways } from "@atp/syntax";
import * as lex from "../../../lex/lexicons.ts";
import * as Music from "../../../lex/types/so/sprk/feed/music.ts";
import { BackgroundQueue } from "../../background.ts";
import { Database } from "../../db/index.ts";
import { MusicDocument } from "../../db/models.ts";
import { RecordProcessor } from "../processor.ts";
import { normalizeObject } from "../../../utils/embed-normalizer.ts";

const lexId = lex.ids.SoSprkFeedMusic;
type IndexedMusic = MusicDocument;

const insertFn = async (
  db: Database,
  uri: AtUri,
  cid: CID,
  obj: Music.Record,
  timestamp: string,
): Promise<IndexedMusic | null> => {
  const music = {
    uri: uri.toString(),
    cid: cid.toString(),
    authorDid: uri.host,
    sound: normalizeObject(obj.sound?.ref) || null,
    title: obj.title,
    author: obj.author,
    releaseDate: obj.releaseDate,
    album: obj.album || null,
    recordLabel: obj.recordLabel || null,
    cover: normalizeObject(obj.cover?.ref) || null,
    text: obj.text || null,
    copyright: obj.copyright || null,
    facets: obj.facets || [],
    labels: obj.labels || null,
    tags: obj.tags || [],
    createdAt: normalizeDatetimeAlways(obj.createdAt),
    indexedAt: timestamp,
  };

  // Use findOneAndUpdate with upsert to handle potential duplicate key errors
  try {
    const insertedMusic = await db.models.Music.findOneAndUpdate(
      { uri: music.uri },
      music,
      { upsert: true, new: true },
    );
    return insertedMusic;
  } catch (err) {
    // Handle duplicate key errors gracefully
    const mongoError = err as { code?: number };
    if (mongoError.code === 11000) {
      return null; // Silently skip duplicates
    }
    throw err;
  }
};

const findDuplicate = (): AtUri | null => {
  return null;
};

const notifsForInsert = () => {
  return [];
};

const deleteFn = async (
  db: Database,
  uri: AtUri,
): Promise<IndexedMusic | null> => {
  const deleted = await db.models.Music.findOneAndDelete({
    uri: uri.toString(),
  });
  return deleted;
};

const notifsForDelete = () => {
  return { notifs: [], toDelete: [] };
};

export type PluginType = RecordProcessor<Music.Record, IndexedMusic>;

export const makePlugin = (
  db: Database,
  background: BackgroundQueue,
): PluginType => {
  return new RecordProcessor(db, background, {
    lexId,
    insertFn,
    findDuplicate,
    deleteFn,
    notifsForInsert,
    notifsForDelete,
  });
};

export default makePlugin;
