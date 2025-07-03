import { CID } from "multiformats/cid";
import { AtUri } from "@atproto/syntax";
import * as lex from "../../../../lexicon/lexicons.ts";
import * as BskyProfile from "../../../../lexicon/types/app/bsky/actor/profile.ts";
import * as SprkProfile from "../../../../lexicon/types/so/sprk/actor/profile.ts";
import { BackgroundQueue } from "../../background.ts";
import { Database, ProfileDocument } from "../../index.ts";
import { RecordProcessor } from "../processor.ts";
import { normalizeProfile } from "../../../../utils/embed-normalizer.ts";

const lexIds = [lex.ids.AppBskyActorProfile, lex.ids.SoSprkActorProfile];

// Union type for both profile record types
type ProfileRecord = BskyProfile.Record | SprkProfile.Record;
type IndexedProfile = ProfileDocument;

const insertFn = async (
  db: Database,
  uri: AtUri,
  cid: CID,
  obj: ProfileRecord,
  timestamp: string,
): Promise<IndexedProfile | null> => {
  if (uri.rkey !== "self") return null;

  // Determine the type based on the collection
  const profileType = uri.collection === "app.bsky.actor.profile"
    ? "bsky"
    : "sprk";

  const normalizedProfile = normalizeProfile(obj) as
    | Record<string, unknown>
    | null;

  console.log("DEBUG: Original profile obj:", JSON.stringify(obj, null, 2));
  console.log(
    "DEBUG: Normalized profile:",
    JSON.stringify(normalizedProfile, null, 2),
  );

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
    type: profileType as "bsky" | "sprk",
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

export type PluginType = RecordProcessor<ProfileRecord, IndexedProfile>;

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