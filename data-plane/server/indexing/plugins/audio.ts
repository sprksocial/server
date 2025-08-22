import { CID } from "multiformats/cid";
import { AtUri, normalizeDatetimeAlways } from "@atproto/syntax";
import * as lex from "../../../../lex/lexicons.ts";
import * as Audio from "../../../../lex/types/so/sprk/feed/audio.ts";
import { BackgroundQueue } from "../../background.ts";
import { Database } from "../../index.ts";
import { AudioDocument } from "../../models.ts";
import { RecordProcessor } from "../processor.ts";
import { normalizeObject } from "../../../../utils/embed-normalizer.ts";

const lexIds = [lex.ids.SoSprkFeedAudio];
type IndexedAudio = AudioDocument;

const insertFn = async (
  db: Database,
  uri: AtUri,
  cid: CID,
  obj: Audio.Record,
  timestamp: string,
): Promise<IndexedAudio | null> => {
  const audio: Record<string, unknown> = {
    uri: uri.toString(),
    cid: cid.toString(),
    authorDid: uri.host,
    sound: normalizeObject(obj.sound) || null,
    origin: obj.origin ? { uri: obj.origin.uri, cid: obj.origin.cid } : null,
    title: obj.title,
    labels: obj.labels || null,
    details: obj.details || null,
    createdAt: normalizeDatetimeAlways(obj.createdAt),
    indexedAt: timestamp,
  };

  // Use findOneAndUpdate with upsert to handle potential duplicate key errors
  try {
    const insertedAudio = await db.models.Audio.findOneAndUpdate(
      { uri: audio.uri },
      audio,
      { upsert: true, new: true },
    );
    return insertedAudio;
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
): Promise<IndexedAudio | null> => {
  const deleted = await db.models.Audio.findOneAndDelete({
    uri: uri.toString(),
  });
  return deleted;
};

const notifsForDelete = () => {
  return { notifs: [], toDelete: [] };
};

export type PluginType = RecordProcessor<Audio.Record, IndexedAudio>;

export const makePlugin = (
  db: Database,
  background: BackgroundQueue,
): PluginType => {
  return new RecordProcessor(db, background, {
    lexIds,
    insertFn,
    findDuplicate,
    deleteFn,
    notifsForInsert,
    notifsForDelete,
  });
};

export default makePlugin;
