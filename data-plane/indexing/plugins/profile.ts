import { CID } from "multiformats/cid";
import { AtUri } from "@atp/syntax";
import * as lex from "../../../lex/lexicons.ts";
import * as Profile from "../../../lex/types/so/sprk/actor/profile.ts";
import { BackgroundQueue } from "../../background.ts";
import { Database } from "../../db/index.ts";
import { ProfileDocument } from "../../db/models.ts";
import { RecordProcessor } from "../processor.ts";

const lexId = lex.ids.SoSprkActorProfile;
type IndexedProfile = ProfileDocument;

const insertFn = async (
  db: Database,
  uri: AtUri,
  cid: CID,
  obj: Profile.Record,
  timestamp: string,
): Promise<IndexedProfile | null> => {
  if (uri.rkey !== "self") return null;

  const profile = {
    uri: uri.toString(),
    cid: cid.toString(),
    authorDid: uri.host,
    displayName: obj?.displayName,
    description: obj?.description,
    avatar: obj?.avatar,
    banner: obj?.banner,
    pinnedPost: obj?.pinnedPost,
    createdAt: obj?.createdAt || new Date().toISOString(),
    indexedAt: timestamp,
  };

  const insertedProfile = await db.models.Profile.findOneAndUpdate(
    { uri: profile.uri },
    { $set: profile },
    { upsert: true, returnDocument: "after" },
  );
  return insertedProfile;
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
): Promise<IndexedProfile | null> => {
  const deleted = await db.models.Profile.findOneAndDelete({
    uri: uri.toString(),
  });
  return deleted;
};

const notifsForDelete = () => {
  return { notifs: [], toDelete: [] };
};

export type PluginType = RecordProcessor<Profile.Record, IndexedProfile>;

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
