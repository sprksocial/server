import { CID } from "multiformats/cid";
import { AtUri, normalizeDatetimeAlways } from "@atp/syntax";
import * as lex from "../../../lex/lexicons.ts";
import * as Labeler from "../../../lex/types/so/sprk/labeler/service.ts";
import { BackgroundQueue } from "../../background.ts";
import { Database } from "../../db/index.ts";
import { LabelerDocument } from "../../db/models.ts";
import { RecordProcessor } from "../processor.ts";

const lexId = lex.ids.SoSprkLabelerService;
type IndexedLabeler = LabelerDocument;

const insertFn = async (
  db: Database,
  uri: AtUri,
  cid: CID,
  obj: Labeler.Record,
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

export type PluginType = RecordProcessor<Labeler.Record, IndexedLabeler>;

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
