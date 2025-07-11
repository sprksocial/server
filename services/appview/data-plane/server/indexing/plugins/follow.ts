import { CID } from "multiformats/cid";
import { AtUri, normalizeDatetimeAlways } from "@atproto/syntax";
import * as lex from "../../../../lexicon/lexicons.ts";
import * as BskyFollow from "../../../../lexicon/types/app/bsky/graph/follow.ts";
import * as SprkFollow from "../../../../lexicon/types/so/sprk/graph/follow.ts";
import { BackgroundQueue } from "../../background.ts";
import { Database, FollowDocument } from "../../index.ts";
import { RecordProcessor } from "../processor.ts";

const lexIds = [lex.ids.AppBskyGraphFollow, lex.ids.SoSprkGraphFollow];
type IndexedFollow = FollowDocument;

// Union type for both follow record types
type FollowRecord = BskyFollow.Record | SprkFollow.Record;

const insertFn = async (
  db: Database,
  uri: AtUri,
  cid: CID,
  obj: FollowRecord,
  timestamp: string,
): Promise<IndexedFollow | null> => {
  // Determine the type based on the collection
  const followType = uri.collection === "app.bsky.graph.follow"
    ? "bsky"
    : "sprk";

  const follow = {
    uri: uri.toString(),
    cid: cid.toString(),
    authorDid: uri.host,
    subject: obj.subject,
    createdAt: normalizeDatetimeAlways(obj.createdAt),
    indexedAt: timestamp,
    type: followType as "bsky" | "sprk",
  };

  // Use findOneAndUpdate with upsert on the compound key to handle potential duplicate key errors
  try {
    const insertedFollow = await db.models.Follow.findOneAndUpdate(
      {
        authorDid: follow.authorDid,
        subject: follow.subject,
        type: follow.type,
      },
      follow,
      { upsert: true, new: true },
    );
    return insertedFollow;
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
  obj: FollowRecord,
): Promise<AtUri | null> => {
  const found = await db.models.Follow.findOne({
    authorDid: uri.host,
    subject: obj.subject,
    type: uri.collection === "app.bsky.graph.follow" ? "bsky" : "sprk",
  }).lean();
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
  // Update followers count for the subject (count both types)
  const followersCount = await db.models.Follow.countDocuments({
    subject: follow.subject,
  });

  await db.models.ProfileAgg.findOneAndUpdate(
    { did: follow.subject },
    { followersCount },
    { upsert: true, new: true },
  );

  // Update follows count for the author (count both types)
  const followsCount = await db.models.Follow.countDocuments({
    authorDid: follow.authorDid,
  });

  await db.models.ProfileAgg.findOneAndUpdate(
    { did: follow.authorDid },
    { followsCount },
    { upsert: true, new: true },
  );
};

export type PluginType = RecordProcessor<FollowRecord, IndexedFollow>;

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
    updateAggregates,
  });
};

export default makePlugin;
