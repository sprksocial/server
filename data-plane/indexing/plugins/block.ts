import { CID } from "multiformats/cid";
import { AtUri, normalizeDatetimeAlways } from "@atp/syntax";
import * as lex from "../../../lex/lexicons.ts";
import * as Block from "../../../lex/types/app/bsky/graph/block.ts";
import { BackgroundQueue } from "../../background.ts";
import { Database } from "../../db/index.ts";
import { BlockDocument } from "../../db/models.ts";
import { RecordProcessor } from "../processor.ts";

const lexId = lex.ids.AppBskyGraphBlock;
type IndexedBlock = BlockDocument;

const insertFn = async (
  db: Database,
  uri: AtUri,
  cid: CID,
  obj: Block.Record,
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

  // Check if block already exists by URI
  const existingBlockByUri = await db.models.Block.findOne({ uri: block.uri })
    .lean();
  if (existingBlockByUri) {
    return null; // Block already indexed
  }

  // Check if a block with same authorDid+subject already exists
  const existingBlockByComposite = await db.models.Block.findOne({
    authorDid: block.authorDid,
    subject: block.subject,
  }).lean();
  if (existingBlockByComposite) {
    return null; // Block with same author+subject already exists
  }

  // Insert the new block
  try {
    const insertedBlock = new db.models.Block(block);
    await insertedBlock.save();
    return insertedBlock;
  } catch (err) {
    // Handle duplicate key errors gracefully
    const mongoError = err as { code?: number };
    if (mongoError.code === 11000) {
      return null; // Silently skip duplicates
    }
    throw err;
  }
};

const findDuplicate = async (
  db: Database,
  uri: AtUri,
  obj: Block.Record,
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

export type PluginType = RecordProcessor<Block.Record, IndexedBlock>;

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
