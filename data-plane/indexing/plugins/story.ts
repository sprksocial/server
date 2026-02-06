import { CID } from "multiformats/cid";
import { AtUri, normalizeDatetimeAlways } from "@atp/syntax";
import * as lex from "../../../lex/lexicons.ts";
import * as Story from "../../../lex/types/so/sprk/story/post.ts";
import { BackgroundQueue } from "../../background.ts";
import { Database } from "../../db/index.ts";
import { StoryDocument } from "../../db/models.ts";
import { RecordProcessor } from "../processor.ts";

const lexId = lex.ids.SoSprkStoryPost;
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
    media: obj.media,
    sound: obj.sound,
    labels: obj.labels || null,
    tags: obj.tags || [],
    createdAt: normalizeDatetimeAlways(obj.createdAt),
    indexedAt: timestamp,
    archived: false,
  };

  // Use findOneAndUpdate with upsert to handle potential duplicate key errors
  const insertedStory = await db.models.Story.findOneAndUpdate(
    { uri: story.uri },
    story,
    { upsert: true, new: true },
  );
  return insertedStory;
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
  return await db.models.Story.findOneAndUpdate(
    { uri: uri.toString() },
    { archived: true },
    { new: true },
  );
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
    lexId,
    insertFn,
    findDuplicate,
    deleteFn,
    notifsForInsert,
    notifsForDelete,
  });
};

export default makePlugin;
