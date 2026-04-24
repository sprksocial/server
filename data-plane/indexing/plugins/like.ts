import { Cid } from "@atp/lex";
import { AtUri, normalizeDatetimeAlways } from "@atp/syntax";
import * as so from "../../../lex/so.ts";
import { BackgroundQueue } from "../../background.ts";
import { Database } from "../../db/index.ts";
import { LikeDocument } from "../../db/models.ts";
import { RecordProcessor } from "../processor.ts";

const schema = so.sprk.feed.like.main;
type LikeRecord = so.sprk.feed.like.Main;
type IndexedLike = LikeDocument;

const insertFn = async (
  db: Database,
  uri: AtUri,
  cid: Cid,
  obj: LikeRecord,
  timestamp: string,
): Promise<IndexedLike | null> => {
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
  };

  const insertedLike = await db.models.Like.findOneAndUpdate(
    { uri: like.uri },
    { $set: like },
    { upsert: true, returnDocument: "after" },
  );
  return insertedLike;
};

const findDuplicate = async (
  db: Database,
  uri: AtUri,
  obj: LikeRecord,
): Promise<AtUri | null> => {
  const found = await db.models.Like.findOne({
    authorDid: uri.host,
    subject: obj.subject.uri,
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
  const likeCount = await db.models.Like.countDocuments({
    subject: like.subject,
  });

  const subjectUri = new AtUri(like.subject);

  if (subjectUri.collection === "so.sprk.feed.generator") {
    const existingGenerator = await db.models.Generator.findOne({
      uri: like.subject,
    });

    if (existingGenerator) {
      await db.models.Generator.findOneAndUpdate(
        { uri: like.subject },
        { $set: { likeCount } },
        { returnDocument: "after" },
      );
    }
  } else {
    const existingPost = await db.models.Post.findOne({
      uri: like.subject,
    });

    if (existingPost) {
      await db.models.Post.findOneAndUpdate(
        { uri: like.subject },
        { $set: { likeCount } },
        { returnDocument: "after" },
      );
    }

    const existingReply = await db.models.Reply.findOne({
      uri: like.subject,
    });

    if (existingReply) {
      await db.models.Reply.findOneAndUpdate(
        { uri: like.subject },
        { $set: { likeCount } },
        { returnDocument: "after" },
      );
    }

    const existingCrosspostReply = await db.models.CrosspostReply.findOne({
      uri: like.subject,
    });

    if (existingCrosspostReply) {
      await db.models.CrosspostReply.findOneAndUpdate(
        { uri: like.subject },
        { $set: { likeCount } },
        { returnDocument: "after" },
      );
    }
  }
};

export type PluginType = RecordProcessor<typeof schema, IndexedLike>;

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
    updateAggregates,
  });
};

export default makePlugin;
