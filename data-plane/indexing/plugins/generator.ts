import { Cid } from "@atp/lex";
import { AtUri, normalizeDatetimeAlways } from "@atp/syntax";
import * as so from "../../../lex/so.ts";
import { BackgroundQueue } from "../../background.ts";
import { Database } from "../../db/index.ts";
import { GeneratorDocument } from "../../db/models.ts";
import { RecordProcessor } from "../processor.ts";

const schema = so.sprk.feed.generator.main;
type FeedGeneratorRecord = so.sprk.feed.generator.Main;
type IndexedFeedGenerator = GeneratorDocument;

const insertFn = async (
  db: Database,
  uri: AtUri,
  cid: Cid,
  obj: FeedGeneratorRecord,
  timestamp: string,
): Promise<IndexedFeedGenerator | null> => {
  // Extract and clean avatar to ensure it matches MediaRef format
  const avatar = obj.avatar
    ? {
      $type: "blob",
      ref: (obj.avatar as unknown as Record<string, unknown>)?.ref || null,
    }
    : null;

  const generator = {
    uri: uri.toString(),
    cid: cid.toString(),
    authorDid: uri.host,
    did: obj.did,
    displayName: obj.displayName,
    description: obj.description || null,
    descriptionFacets: obj.descriptionFacets || null,
    avatar,
    acceptsInteractions: obj.acceptsInteractions || null,
    labels: null, // Will be populated by label processing
    createdAt: normalizeDatetimeAlways(obj.createdAt),
    indexedAt: timestamp,
  };

  const insertedGenerator = await db.models.Generator.findOneAndUpdate(
    { uri: generator.uri },
    { $set: generator },
    { upsert: true, returnDocument: "after" },
  );
  return insertedGenerator;
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
  typeof schema,
  IndexedFeedGenerator
>;

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
