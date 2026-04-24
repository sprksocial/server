import { Cid } from "@atp/lex";
import { AtUri, normalizeDatetimeAlways } from "@atp/syntax";
import * as so from "../../../lex/so.ts";
import { BackgroundQueue } from "../../background.ts";
import { Database } from "../../db/index.ts";
import { LabelerDocument } from "../../db/models.ts";
import { RecordProcessor } from "../processor.ts";

const schema = so.sprk.labeler.service.main;
type LabelerRecord = so.sprk.labeler.service.Main;
type IndexedLabeler = LabelerDocument;

const insertFn = async (
  db: Database,
  uri: AtUri,
  cid: Cid,
  obj: LabelerRecord,
  timestamp: string,
): Promise<IndexedLabeler | null> => {
  if (uri.rkey !== "self") return null;

  const labeler = {
    uri: uri.toString(),
    cid: cid.toString(),
    authorDid: uri.host,
    createdAt: normalizeDatetimeAlways(obj.createdAt),
    indexedAt: timestamp,
  };

  const insertedLabeler = await db.models.Labeler.findOneAndUpdate(
    { uri: labeler.uri },
    { $set: labeler },
    { upsert: true, returnDocument: "after" },
  );
  return insertedLabeler;
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
): Promise<IndexedLabeler | null> => {
  const deleted = await db.models.Labeler.findOneAndDelete({
    uri: uri.toString(),
  });
  return deleted;
};

const notifsForDelete = () => {
  return { notifs: [], toDelete: [] };
};

export type PluginType = RecordProcessor<typeof schema, IndexedLabeler>;

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
