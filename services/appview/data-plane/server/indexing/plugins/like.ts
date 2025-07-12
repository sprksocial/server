import { CID } from "multiformats/cid";
import { AtUri, normalizeDatetimeAlways } from "@atproto/syntax";
import * as lex from "../../../../lexicon/lexicons.ts";
import * as Like from "../../../../lexicon/types/so/sprk/feed/like.ts";
import { BackgroundQueue } from "../../background.ts";
import { Database, LikeDocument } from "../../index.ts";
import { RecordProcessor } from "../processor.ts";

const lexIds = [lex.ids.SoSprkFeedLike];
type IndexedLike = LikeDocument;

const insertFn = async (
  db: Database,
  uri: AtUri,
  cid: CID,
  obj: Like.Record,
  timestamp: string,
): Promise<IndexedLike | null> => {
  // Determine the type based on the collection
  const likeType = uri.collection === "app.bsky.feed.like" ? "bsky" : "sprk";

  // Handle via property safely with type assertion
  const viaObj = obj.via as { uri: string; cid: string } | undefined;
  const via = viaObj?.uri || null;
  const viaCid = viaObj?.cid || null;

  const like = {
    uri: uri.toString(),
    cid: cid.toString(),
    authorDid: uri.host,
    subject: obj.subject.uri,
    subjectCid: obj.subject.cid,
    via,
    viaCid,
    createdAt: normalizeDatetimeAlways(obj.createdAt),
    indexedAt: timestamp,
    type: likeType as "bsky" | "sprk",
  };

  // Use findOneAndUpdate with upsert on the compound key to handle potential duplicate key errors
  try {
    const insertedLike = await db.models.Like.findOneAndUpdate(
      {
        authorDid: like.authorDid,
        subject: like.subject,
        type: like.type,
      },
      like,
      { upsert: true, new: true },
    );
    return insertedLike;
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
  obj: Like.Record,
): Promise<AtUri | null> => {
  const found = await db.models.Like.findOne({
    authorDid: uri.host,
    subject: obj.subject.uri,
    type: uri.collection === "app.bsky.feed.like" ? "bsky" : "sprk",
  }).lean();
  return found ? new AtUri(found.uri) : null;
};

const notifsForInsert = (obj: IndexedLike) => {
  const subjectUri = new AtUri(obj.subject);
  // prevent self-notifications
  const isLikeFromSubjectUser = subjectUri.host === obj.authorDid;
  if (isLikeFromSubjectUser) {
    return [];
  }

  const notifs: Array<{
    did: string;
    reason: string;
    author: string;
    recordUri: string;
    recordCid: string;
    sortAt: string;
    reasonSubject?: string;
  }> = [
    // Notification to the author of the liked record.
    {
      did: subjectUri.host,
      author: obj.authorDid,
      recordUri: obj.uri,
      recordCid: obj.cid,
      reason: "like" as const,
      reasonSubject: subjectUri.toString(),
      sortAt: obj.createdAt,
    },
  ];

  if (obj.via) {
    const viaUri = new AtUri(obj.via);
    const isLikeFromViaSubjectUser = viaUri.host === obj.authorDid;
    // prevent self-notifications
    if (!isLikeFromViaSubjectUser) {
      notifs.push(
        // Notification to the reposter via whose repost the like was made.
        {
          did: viaUri.host,
          author: obj.authorDid,
          recordUri: obj.uri,
          recordCid: obj.cid,
          reason: "like-via-repost" as const,
          reasonSubject: viaUri.toString(),
          sortAt: obj.createdAt,
        },
      );
    }
  }

  return notifs;
};

const deleteFn = async (
  db: Database,
  uri: AtUri,
): Promise<IndexedLike | null> => {
  const deleted = await db.models.Like.findOneAndDelete({
    uri: uri.toString(),
  });
  return deleted;
};

const notifsForDelete = (
  deleted: IndexedLike,
  replacedBy: IndexedLike | null,
) => {
  const toDelete = replacedBy ? [] : [deleted.uri];
  return { notifs: [], toDelete };
};

const updateAggregates = async (db: Database, like: IndexedLike) => {
  // Update like count for the subject (count both types)
  const likeCount = await db.models.Like.countDocuments({
    subject: like.subject,
  });

  await db.models.PostAgg.findOneAndUpdate(
    { uri: like.subject },
    { likeCount },
    { upsert: true, new: true },
  );
};

export type PluginType = RecordProcessor<Like.Record, IndexedLike>;

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
