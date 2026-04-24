import { Cid } from "@atp/lex";
import { AtUri, normalizeDatetimeAlways } from "@atp/syntax";
import * as so from "../../../lex/so.ts";
import { BackgroundQueue } from "../../background.ts";
import { Database } from "../../db/index.ts";
import { StoryDocument } from "../../db/models.ts";
import { RecordProcessor } from "../processor.ts";

const schema = so.sprk.story.post.main;
type StoryRecord = so.sprk.story.post.Main;
type IndexedStory = StoryDocument;

const insertFn = async (
  db: Database,
  uri: AtUri,
  cid: Cid,
  obj: StoryRecord,
  timestamp: string,
): Promise<IndexedStory | null> => {
  const story = {
    uri: uri.toString(),
    cid: cid.toString(),
    authorDid: uri.host,
    media: obj.media,
    sound: obj.sound,
    embeds: obj.embeds || [],
    labels: obj.labels || null,
    createdAt: normalizeDatetimeAlways(obj.createdAt),
    indexedAt: timestamp,
  };

  // Use findOneAndUpdate with upsert to handle potential duplicate key errors
  const insertedStory = await db.models.Story.findOneAndUpdate(
    { uri: story.uri },
    story,
    { upsert: true, returnDocument: "after" },
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
  return await db.models.Story.findOneAndDelete({
    uri: uri.toString(),
  });
};

const notifsForDelete = () => {
  return { notifs: [], toDelete: [] };
};

export type PluginType = RecordProcessor<typeof schema, IndexedStory>;

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
