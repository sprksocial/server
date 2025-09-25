import { CID } from "multiformats/cid";
import { AtUri, normalizeDatetimeAlways } from "@atp/syntax";
import * as lex from "../../../lex/lexicons.ts";
import * as Repost from "../../../lex/types/app/bsky/feed/repost.ts";
import { BackgroundQueue } from "../../background.ts";
import { Database } from "../../db/index.ts";
import { RepostDocument } from "../../db/models.ts";
import { RecordProcessor } from "../processor.ts";

const lexId = lex.ids.AppBskyFeedRepost;
type IndexedRepost = RepostDocument;

const insertFn = async (
  db: Database,
  uri: AtUri,
  cid: CID,
  obj: Repost.Record,
  timestamp: string,
): Promise<IndexedRepost | null> => {
  try {
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

    // Use findOneAndUpdate with compound key to handle potential duplicate key errors
    try {
      const insertedRepost = await db.models.Repost.findOneAndUpdate(
        {
          authorDid: repost.authorDid,
          "subject.uri": repost.subject.uri,
        },
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
  } catch (error) {
    // Log the error but prevent it from crashing the process
    console.error("Error processing repost:", error);
    return null;
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
  try {
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
      try {
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
      } catch (viaError) {
        console.error("Error processing via uri in notification:", viaError);
        // Continue with just the main notification
      }
    }

    return notifs;
  } catch (error) {
    console.error("Error generating notifications for insert:", error);
    return [];
  }
};

const deleteFn = async (
  db: Database,
  uri: AtUri,
): Promise<IndexedRepost | null> => {
  try {
    const deleted = await db.models.Repost.findOneAndDelete({
      uri: uri.toString(),
    });
    return deleted;
  } catch (error) {
    console.error("Error deleting repost:", error);
    return null;
  }
};

const notifsForDelete = (
  deleted: IndexedRepost,
  replacedBy: IndexedRepost | null,
) => {
  try {
    const toDelete = replacedBy ? [] : [deleted.uri];
    return { notifs: [], toDelete };
  } catch (error) {
    console.error("Error processing notifications for delete:", error);
    return { notifs: [], toDelete: [] };
  }
};

const updateAggregates = async (db: Database, repost: IndexedRepost) => {
  try {
    // Update repost count for the subject
    const repostCount = await db.models.Repost.countDocuments({
      "subject.uri": repost.subject.uri,
    });

    // First check if post exists to avoid creating one with missing fields
    const existingPost = await db.models.Post.findOne({
      uri: repost.subject.uri,
    });

    if (existingPost) {
      // Only update existing posts
      await db.models.Post.findOneAndUpdate(
        { uri: repost.subject.uri },
        { repostCount },
        { new: true },
      );
    }
    // We don't create a post if it doesn't exist, as we might lack required fields

    // Update repost count for the author (optional enhancement)
    const authorRepostCount = await db.models.Repost.countDocuments({
      authorDid: repost.authorDid,
    });

    // First check if profile exists to avoid creating one with null URI
    const existingProfile = await db.models.Profile.findOne({
      authorDid: repost.authorDid,
    });

    if (existingProfile) {
      // Only update existing profiles to avoid creating profiles with null URI
      await db.models.Profile.findOneAndUpdate(
        { authorDid: repost.authorDid },
        { repostCount: authorRepostCount },
        { new: true },
      );
    }
    // We don't create a profile if it doesn't exist, as we lack required URI field
  } catch (error) {
    console.error("Error updating repost aggregates:", error);
    // Don't throw - allow processing to continue even if aggregates update fails
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
