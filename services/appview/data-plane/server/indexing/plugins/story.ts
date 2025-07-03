import { CID } from "multiformats/cid";
import { AtUri, normalizeDatetimeAlways } from "@atproto/syntax";
import * as lex from "../../../../lexicon/lexicons.ts";
import * as Story from "../../../../lexicon/types/so/sprk/feed/story.ts";
import { BackgroundQueue } from "../../background.ts";
import { Database, StoryDocument } from "../../index.ts";
import { RecordProcessor } from "../processor.ts";
import {
  normalizeEmbed,
  normalizeObject,
} from "../../../../utils/embed-normalizer.ts";

const lexIds = [lex.ids.SoSprkFeedStory];
type IndexedStory = StoryDocument;

const insertFn = async (
  db: Database,
  uri: AtUri,
  cid: CID,
  obj: Story.Record,
  timestamp: string,
): Promise<IndexedStory | null> => {
  const story = {
    uri: uri.toString(),
    cid: cid.toString(),
    authorDid: uri.host,
    media: normalizeEmbed(obj.media) || null,
    sound: normalizeObject(obj.sound) || null,
    labels: obj.labels || null,
    tags: obj.tags || [],
    createdAt: normalizeDatetimeAlways(obj.createdAt),
    indexedAt: timestamp,
  };

  // Use findOneAndUpdate with upsert to handle potential duplicate key errors
  try {
    const insertedStory = await db.models.Story.findOneAndUpdate(
      { uri: story.uri },
      story,
      { upsert: true, new: true },
    );
    return insertedStory;
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
): Promise<IndexedStory | null> => {
  const deleted = await db.models.Story.findOneAndDelete({
    uri: uri.toString(),
  });
  return deleted;
};

const notifsForDelete = () => {
  return { notifs: [], toDelete: [] };
};

export type PluginType = RecordProcessor<Story.Record, IndexedStory>;

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