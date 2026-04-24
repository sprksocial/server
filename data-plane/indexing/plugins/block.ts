import { Cid } from "@atp/lex";
import { AtUri, normalizeDatetimeAlways } from "@atp/syntax";
import * as so from "../../../lex/so.ts";
import { BackgroundQueue } from "../../background.ts";
import { Database } from "../../db/index.ts";
import { BlockDocument } from "../../db/models.ts";
import { RecordProcessor } from "../processor.ts";

const schema = so.sprk.graph.block.main;
type BlockRecord = so.sprk.graph.block.Main;
type IndexedBlock = BlockDocument;

const insertFn = async (
  db: Database,
  uri: AtUri,
  cid: Cid,
  obj: BlockRecord,
  timestamp: string,
): Promise<IndexedBlock | null> => {
  const block = {
    uri: uri.toString(),
    cid: cid.toString(),
    authorDid: uri.host,
    subject: obj.subject,
    createdAt: normalizeDatetimeAlways(obj.createdAt),
    indexedAt: timestamp,
  };

  const insertedBlock = await db.models.Block.findOneAndUpdate(
    { uri: block.uri },
    { $set: block },
    { upsert: true, returnDocument: "after" },
  );
  return insertedBlock;
};

const findDuplicate = async (
  db: Database,
  uri: AtUri,
  obj: BlockRecord,
): Promise<AtUri | null> => {
  const found = await db.models.Block.findOne({
    authorDid: uri.host,
    subject: obj.subject,
  }).select("uri").lean();
  return found ? new AtUri(found.uri) : null;
};

const notifsForInsert = () => {
  return [];
};

const deleteFn = async (
  db: Database,
  uri: AtUri,
): Promise<IndexedBlock | null> => {
  const deleted = await db.models.Block.findOneAndDelete({
    uri: uri.toString(),
  });
  return deleted;
};

const notifsForDelete = () => {
  return { notifs: [], toDelete: [] };
};

export type PluginType = RecordProcessor<typeof schema, IndexedBlock>;

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
