import { CID } from "multiformats/cid";
import { AtUri } from "@atproto/syntax";
import * as lex from "../../../../lexicon/lexicons.ts";
import * as Profile from "../../../../lexicon/types/so/sprk/actor/profile.ts";
import { BackgroundQueue } from "../../background.ts";
import { Database } from "../../index.ts";
import { ProfileDocument } from "../../models.ts";
import { RecordProcessor } from "../processor.ts";
import { normalizeProfile } from "../../../../utils/embed-normalizer.ts";

const lexIds = [lex.ids.SoSprkActorProfile];
type IndexedProfile = ProfileDocument;

const insertFn = async (
  db: Database,
  uri: AtUri,
  cid: CID,
  obj: Profile.Record,
  timestamp: string,
): Promise<IndexedProfile | null> => {
  if (uri.rkey !== "self") return null;

  const normalizedProfile = normalizeProfile(obj) as
    | Record<string, unknown>
    | null;

  const profile = {
    uri: uri.toString(),
    cid: cid.toString(),
    authorDid: uri.host,
    displayName: normalizedProfile?.displayName || null,
    description: normalizedProfile?.description || null,
    avatar: normalizedProfile?.avatar || null,
    banner: normalizedProfile?.banner || null,
    pinnedPost: normalizedProfile?.pinnedPost || null,
    createdAt: normalizedProfile?.createdAt || new Date().toISOString(),
    indexedAt: timestamp,
  };

  // Use findOneAndUpdate with upsert to handle potential duplicate key errors
  try {
    const insertedProfile = await db.models.Profile.findOneAndUpdate(
      { uri: profile.uri },
      profile,
      { upsert: true, new: true },
    );
    return insertedProfile;
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
    lexIds,
    insertFn,
    findDuplicate,
    deleteFn,
    notifsForInsert,
    notifsForDelete,
  });
};

export default makePlugin;
