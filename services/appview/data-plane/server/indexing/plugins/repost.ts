import { CID } from "multiformats/cid";
import { AtUri, normalizeDatetimeAlways } from "@atproto/syntax";
import * as lex from "../../../../lexicon/lexicons.ts";
import * as Repost from "../../../../lexicon/types/app/bsky/feed/repost.ts";
import { BackgroundQueue } from "../../background.ts";
import { Database, RepostDocument } from "../../index.ts";
import { RecordProcessor } from "../processor.ts";

const lexIds = [lex.ids.AppBskyFeedRepost];
type IndexedRepost = RepostDocument;

const insertFn = async (
  db: Database,
  uri: AtUri,
  cid: CID,
  obj: Repost.Record,
  timestamp: string,
): Promise<IndexedRepost | null> => {
  // Handle via property safely with type assertion
  const viaObj = obj.via as { uri: string; cid: string } | undefined;
  const via = viaObj?.uri || null;
  const viaCid = viaObj?.cid || null;

  const repost = {
    uri: uri.toString(),
    cid: cid.toString(),
    authorDid: uri.host,
    subject: {
      uri: obj.subject.uri,
      cid: obj.subject.cid,
    },
    via,
    viaCid,
    createdAt: normalizeDatetimeAlways(obj.createdAt),
    indexedAt: timestamp,
  };

  // Check if repost already exists
  const existingRepost = await db.models.Repost.findOne({ uri: repost.uri })
    .lean();
  if (existingRepost) {
    return null; // Repost already indexed
  }

  // Use findOneAndUpdate with upsert to handle potential duplicate key errors
  try {
    const insertedRepost = await db.models.Repost.findOneAndUpdate(
      { uri: repost.uri },
      repost,
      { upsert: true, new: true },
    );
    return insertedRepost;
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
  obj: Repost.Record,
): Promise<AtUri | null> => {
  const found = await db.models.Repost.findOne({
    authorDid: uri.host,
    "subject.uri": obj.subject.uri,
  }).lean();
  return found ? new AtUri(found.uri) : null;
};

const notifsForInsert = (obj: IndexedRepost) => {
  const subjectUri = new AtUri(obj.subject.uri);
  // prevent self-notifications
  const isRepostFromSubjectUser = subjectUri.host === obj.authorDid;
  if (isRepostFromSubjectUser) {
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
    // Notification to the author of the reposted record.
    {
      did: subjectUri.host,
      author: obj.authorDid,
      recordUri: obj.uri,
      recordCid: obj.cid,
      reason: "repost" as const,
      reasonSubject: subjectUri.toString(),
      sortAt: obj.createdAt,
    },
  ];

  if (obj.via) {
    const viaUri = new AtUri(obj.via);
    const isRepostFromViaSubjectUser = viaUri.host === obj.authorDid;
    // prevent self-notifications
    if (!isRepostFromViaSubjectUser) {
      notifs.push(
        // Notification to the reposter via whose repost the repost was made.
        {
          did: viaUri.host,
          author: obj.authorDid,
          recordUri: obj.uri,
          recordCid: obj.cid,
          reason: "repost-via-repost" as const,
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
): Promise<IndexedRepost | null> => {
  const deleted = await db.models.Repost.findOneAndDelete({
    uri: uri.toString(),
  });
  return deleted;
};

const notifsForDelete = (
  deleted: IndexedRepost,
  replacedBy: IndexedRepost | null,
) => {
  const toDelete = replacedBy ? [] : [deleted.uri];
  return { notifs: [], toDelete };
};

const updateAggregates = async (db: Database, repost: IndexedRepost) => {
  // Update repost count for the subject
  const repostCount = await db.models.Repost.countDocuments({
    "subject.uri": repost.subject.uri,
  });

  await db.models.PostAgg.findOneAndUpdate(
    { uri: repost.subject.uri },
    { repostCount },
    { upsert: true, new: true },
  );
};

export type PluginType = RecordProcessor<Repost.Record, IndexedRepost>;

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