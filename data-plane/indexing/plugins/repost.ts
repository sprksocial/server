import { CID } from "multiformats/cid";
import { AtUri, normalizeDatetimeAlways } from "@atp/syntax";
import * as lex from "../../../lex/lexicons.ts";
import * as Repost from "../../../lex/types/so/sprk/feed/repost.ts";
import { BackgroundQueue } from "../../background.ts";
import { Database } from "../../db/index.ts";
import { RepostDocument } from "../../db/models.ts";
import { RecordProcessor } from "../processor.ts";

const lexId = lex.ids.SoSprkFeedRepost;
type IndexedRepost = RepostDocument;

const insertFn = async (
  db: Database,
  uri: AtUri,
  cid: CID,
  obj: Repost.Record,
  timestamp: string,
): Promise<IndexedRepost | null> => {
  const viaObj = obj.via as { uri: string; cid: string } | undefined;
  const via = viaObj?.uri || null;
  const viaCid = viaObj?.cid || null;

  const repost = {
    uri: uri.toString(),
    cid: cid.toString(),
    authorDid: uri.host,
    subject: obj.subject.uri,
    subjectCid: obj.subject.cid,
    via,
    viaCid,
    createdAt: normalizeDatetimeAlways(obj.createdAt),
    indexedAt: timestamp,
  };

  // Use findOneAndUpdate with compound key to handle potential duplicate key errors
  const insertedRepost = await db.models.Repost.findOneAndUpdate(
    { uri: repost.uri },
    { $set: repost },
    { upsert: true, new: true },
  );
  return insertedRepost;
};

const findDuplicate = async (
  db: Database,
  uri: AtUri,
  obj: Repost.Record,
): Promise<AtUri | null> => {
  const found = await db.models.Repost.findOne({
    authorDid: uri.host,
    subject: obj.subject.uri,
  }).lean();
  return found ? new AtUri(found.uri) : null;
};

const notifsForInsert = (obj: IndexedRepost) => {
  const subjectUri = new AtUri(obj.subject);
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
  const repostCount = await db.models.Repost.countDocuments({
    subject: repost.subject,
  });

  const existingPost = await db.models.Post.findOne({
    uri: repost.subject,
  });

  if (existingPost) {
    await db.models.Post.findOneAndUpdate(
      { uri: repost.subject },
      { $set: { repostCount } },
      { new: true },
    );
  }

  const authorRepostCount = await db.models.Repost.countDocuments({
    authorDid: repost.authorDid,
  });

  const existingProfile = await db.models.Profile.findOne({
    authorDid: repost.authorDid,
  });

  if (existingProfile) {
    await db.models.Profile.findOneAndUpdate(
      { authorDid: repost.authorDid },
      { $set: { repostCount: authorRepostCount } },
      { new: true },
    );
  }
};

export type PluginType = RecordProcessor<Repost.Record, IndexedRepost>;

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
