import { Cid } from "@atp/lex";
import { AtUri, normalizeDatetimeAlways } from "@atp/syntax";
import * as fm from "../../../lex/fm.ts";
import { BackgroundQueue } from "../../background.ts";
import { Database } from "../../db/index.ts";
import { AudioDocument, MediaRef } from "../../db/models.ts";
import { RecordProcessor } from "../processor.ts";

const schema = fm.plyr.track.main;
type PlyrTrackRecord = fm.plyr.track.Main;
type IndexedAudio = AudioDocument;

const insertFn = async (
  db: Database,
  uri: AtUri,
  cid: Cid,
  obj: PlyrTrackRecord,
  timestamp: string,
): Promise<IndexedAudio | null> => {
  if (obj.supportGate || !obj.audioBlob) {
    return null;
  }

  const audio: Omit<AudioDocument, "actor" | "useCount"> = {
    uri: uri.toString(),
    cid: cid.toString(),
    authorDid: uri.host,
    sound: obj.audioBlob as unknown as MediaRef,
    title: obj.title,
    details: {
      artist: obj.artist,
      title: obj.title,
    },
    createdAt: normalizeDatetimeAlways(obj.createdAt),
    indexedAt: timestamp,
  };

  const insertedAudio = await db.models.Audio.findOneAndUpdate(
    { uri: uri.toString() },
    { $set: audio, $setOnInsert: { useCount: 0 } },
    { upsert: true, returnDocument: "after", includeResultMetadata: false },
  );
  return insertedAudio;
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

export type PluginType = RecordProcessor<typeof schema, IndexedAudio>;

export const makePlugin = (
  db: Database,
  background: BackgroundQueue,
): PluginType => {
  return new RecordProcessor(db, background, {
    schema,
    insertFn,
    findDuplicate,
    deleteFn,
    notifsForInsert,
    notifsForDelete,
  });
};

export default makePlugin;
