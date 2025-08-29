import { CID } from "multiformats/cid";
import { AtUri, normalizeDatetimeAlways } from "@atproto/syntax";
import * as lex from "../../../../lex/lexicons.ts";
import * as Follow from "../../../../lex/types/app/bsky/graph/follow.ts";
import { BackgroundQueue } from "../../background.ts";
import { Database } from "../../index.ts";
import { FollowDocument } from "../../models.ts";
import { RecordProcessor } from "../processor.ts";

const lexId = lex.ids.AppBskyGraphFollow;
type IndexedFollow = FollowDocument;

const insertFn = async (
  db: Database,
  uri: AtUri,
  cid: CID,
  obj: Follow.Record,
  timestamp: string,
): Promise<IndexedFollow | null> => {
  const follow = {
    uri: uri.toString(),
    cid: cid.toString(),
    authorDid: uri.host,
    subject: obj.subject,
    createdAt: normalizeDatetimeAlways(obj.createdAt),
    indexedAt: timestamp,
  };

  // Use findOneAndUpdate with upsert on the compound key to handle potential duplicate key errors
  try {
    const insertedFollow = await db.models.Follow.findOneAndUpdate(
      {
        authorDid: follow.authorDid,
        subject: follow.subject,
      },
      follow,
      { upsert: true, new: true },
    );
    return insertedFollow;
  } catch (err) {
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
  obj: Follow.Record,
): Promise<AtUri | null> => {
  const found = await db.models.Follow.findOne({
    authorDid: uri.host,
    subject: obj.subject,
  }).select("uri").lean();
  return found ? new AtUri(found.uri) : null;
};

const notifsForInsert = (obj: IndexedFollow) => {
  return [
    {
      did: obj.subject,
      author: obj.authorDid,
      recordUri: obj.uri,
      recordCid: obj.cid,
      reason: "follow" as const,
      reasonSubject: undefined,
      sortAt: obj.createdAt,
    },
  ];
};

const deleteFn = async (
  db: Database,
  uri: AtUri,
): Promise<IndexedFollow | null> => {
  const deleted = await db.models.Follow.findOneAndDelete({
    uri: uri.toString(),
  });
  return deleted;
};

const notifsForDelete = (
  deleted: IndexedFollow,
  replacedBy: IndexedFollow | null,
) => {
  const toDelete = replacedBy ? [] : [deleted.uri];
  return { notifs: [], toDelete };
};

const updateAggregates = async (db: Database, follow: IndexedFollow) => {
  try {
    // Update followers count for the subject (count both types)
    const followersCount = await db.models.Follow.countDocuments({
      subject: follow.subject,
    });

    // First check if profile exists to avoid creating one with null URI
    const existingSubjectProfile = await db.models.Profile.findOne({
      authorDid: follow.subject,
    });

    if (existingSubjectProfile) {
      // Only update existing profiles
      await db.models.Profile.findOneAndUpdate(
        { authorDid: follow.subject },
        { followersCount },
        { new: true },
      );
    }

    // Update follows count for the author (count both types)
    const followsCount = await db.models.Follow.countDocuments({
      authorDid: follow.authorDid,
    });

    // First check if profile exists to avoid creating one with null URI
    const existingAuthorProfile = await db.models.Profile.findOne({
      authorDid: follow.authorDid,
    });

    if (existingAuthorProfile) {
      // Only update existing profiles
      await db.models.Profile.findOneAndUpdate(
        { authorDid: follow.authorDid },
        { followsCount },
        { new: true },
      );
    }
  } catch (error) {
    console.error("Error updating follow aggregates:", error);
    // Don't throw - allow processing to continue even if aggregates update fails
  }
};

export type PluginType = RecordProcessor<Follow.Record, IndexedFollow>;

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
    updateAggregates,
  });
};

export default makePlugin;
