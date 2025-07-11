import { CID } from "multiformats/cid";
import { AtUri, normalizeDatetimeAlways } from "@atproto/syntax";
import * as lex from "../../../../lexicon/lexicons.ts";
import * as FeedGenerator from "../../../../lexicon/types/app/bsky/feed/generator.ts";
import { BackgroundQueue } from "../../background.ts";
import { Database, GeneratorDocument } from "../../index.ts";
import { RecordProcessor } from "../processor.ts";
import { normalizeObject } from "../../../../utils/embed-normalizer.ts";

const lexIds = [lex.ids.AppBskyFeedGenerator];
type IndexedFeedGenerator = GeneratorDocument;

const insertFn = async (
  db: Database,
  uri: AtUri,
  cid: CID,
  obj: FeedGenerator.Record,
  timestamp: string,
): Promise<IndexedFeedGenerator | null> => {
  const generator = {
    uri: uri.toString(),
    cid: cid.toString(),
    authorDid: uri.host,
    did: obj.did,
    displayName: obj.displayName,
    description: obj.description || null,
    descriptionFacets: obj.descriptionFacets || null,
    avatar: normalizeObject(obj.avatar) || null,
    acceptsInteractions: obj.acceptsInteractions || null,
    labels: null, // Will be populated by label processing
    contentMode: null, // Not used in Bluesky
    createdAt: normalizeDatetimeAlways(obj.createdAt),
    indexedAt: timestamp,
  };

  // Use findOneAndUpdate with upsert to handle potential duplicate key errors
  try {
    const insertedGenerator = await db.models.Generator.findOneAndUpdate(
      { uri: generator.uri },
      generator,
      { upsert: true, new: true },
    );
    return insertedGenerator;
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
): Promise<IndexedFeedGenerator | null> => {
  const deleted = await db.models.Generator.findOneAndDelete({
    uri: uri.toString(),
  });
  return deleted;
};

const notifsForDelete = () => {
  return { notifs: [], toDelete: [] };
};

export type PluginType = RecordProcessor<
  FeedGenerator.Record,
  IndexedFeedGenerator
>;

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
