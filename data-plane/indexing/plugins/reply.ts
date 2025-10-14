import { CID } from "multiformats/cid";
import { AtUri } from "@atp/syntax";
import * as lex from "../../../lex/lexicons.ts";
import { isMain as isMediaImage } from "../../../lex/types/so/sprk/media/image.ts";
import {
  Record as ReplyRecord,
  ReplyRef,
} from "../../../lex/types/so/sprk/feed/reply.ts";
import { Record as GateRecord } from "../../../lex/types/so/sprk/feed/threadgate.ts";
import {
  isLink,
  isMention,
} from "../../../lex/types/so/sprk/richtext/facet.ts";
import { BackgroundQueue } from "../../background.ts";
import { Database } from "../../db/index.ts";
import { ReplyDocument } from "../../db/models.ts";
import {
  getAncestorsAndSelf,
  getDescendents,
  invalidReplyRoot as checkInvalidReplyRoot,
} from "../../util.ts";
import { RecordProcessor } from "../processor.ts";
import {
  normalizeEmbed,
  normalizeObject,
} from "../../../utils/embed-normalizer.ts";
import { jsonToLex } from "@atp/lexicon";

type PostAncestor = {
  uri: string;
  height: number;
};
type PostDescendent = {
  uri: string;
  depth: number;
  cid: string;
  creator: string;
  sortAt: string;
};
type IndexedReply = {
  reply: ReplyDocument;
  facets?: { type: "mention" | "link"; value: string }[];
  image?: {
    cid?: string;
    alt?: string | null;
  };
  ancestors?: PostAncestor[];
  descendents?: PostDescendent[];
  threadgate?: GateRecord;
};

const lexId = lex.ids.SoSprkFeedPost;

const REPLY_NOTIF_DEPTH = 5;

const insertFn = async (
  db: Database,
  uri: AtUri,
  cid: CID,
  obj: ReplyRecord,
  timestamp: string,
): Promise<IndexedReply | null> => {
  console.log("DEBUG: Post indexing started");
  // Ensure actor record exists before creating post
  const actorExists = await db.models.Actor.findOne({ did: uri.host }).lean();
  if (!actorExists) {
    // This should trigger actor indexing, but for now we'll just log
    console.log(
      `Post indexing: No actor record found for ${uri.host}, post may have missing handle`,
    );
  }

  console.log("DEBUG: Post embed:", JSON.stringify(obj.embed, null, 2));

  const normalizedEmbed = normalizeEmbed(obj.embed);
  console.log(
    "DEBUG: Normalized embed:",
    JSON.stringify(normalizedEmbed, null, 2),
  );

  const post = {
    uri: uri.toString(),
    cid: cid.toString(),
    authorDid: uri.host,
    text: obj.text || "",
    facets: obj.facets || [],
    reply: obj.reply
      ? {
        root: {
          uri: obj.reply.root.uri,
          cid: obj.reply.root.cid,
        },
        parent: {
          uri: obj.reply.parent.uri,
          cid: obj.reply.parent.cid,
        },
      }
      : null,
    embed: normalizedEmbed || null,
    sound: normalizeObject(obj.sound) || null,
    langs: obj.langs || [],
    labels: obj.labels || null,
    tags: obj.tags || [],
    createdAt: obj.createdAt,
    indexedAt: timestamp,
  };

  // Use findOneAndUpdate with upsert to handle potential duplicate key errors
  try {
    const insertedPost = await db.models.Post.findOneAndUpdate(
      { uri: post.uri },
      post,
      { upsert: true, new: true },
    );

    if (obj.reply) {
      const { invalidReplyRoot } = await validateReply(
        db,
        obj.reply,
      );
      if (invalidReplyRoot) {
        Object.assign(insertedPost, { invalidReplyRoot });
        await db.models.Post.updateOne(
          { uri: post.uri },
          { invalidReplyRoot },
        );
      }
    }

    const facets = (obj.facets || [])
      .flatMap((facet) => facet.features)
      .flatMap((feature) => {
        if (isMention(feature)) {
          return {
            type: "mention" as const,
            value: feature.did,
          };
        }
        if (isLink(feature)) {
          return {
            type: "link" as const,
            value: feature.uri,
          };
        }
        return [];
      });

    // Embed processing - embeds are stored inline in the Post model
    let image: {
      postUri?: string;
      cid?: string;
      alt?: string;
    } = {};
    if (isMediaImage(obj.image)) {
      const imageEmbed = {
        postUri: uri.toString(),
        cid: obj.image.image.ref.toString(),
        alt: obj.alt as string,
      };
      image = imageEmbed;
    }

    const ancestors = await getAncestorsAndSelf(db, {
      uri: post.uri,
      parentHeight: REPLY_NOTIF_DEPTH,
    });
    const descendents = await getDescendents(db, {
      uri: post.uri,
      depth: REPLY_NOTIF_DEPTH,
    });

    return {
      reply: insertedPost,
      facets,
      image,
      ancestors,
      descendents,
    };
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

const notifsForInsert = (obj: IndexedReply) => {
  const notifs: Array<{
    did: string;
    reason: string;
    author: string;
    recordUri: string;
    recordCid: string;
    sortAt: string;
    reasonSubject?: string;
  }> = [];
  const notified = new Set([obj.reply.authorDid]);
  const maybeNotify = (notif: {
    did: string;
    reason: string;
    author: string;
    recordUri: string;
    recordCid: string;
    sortAt: string;
    reasonSubject?: string;
  }) => {
    if (!notified.has(notif.did)) {
      notified.add(notif.did);
      notifs.push(notif);
    }
  };
  for (const facet of obj.facets ?? []) {
    if (facet.type === "mention") {
      maybeNotify({
        did: facet.value,
        reason: "mention",
        author: obj.reply.authorDid,
        recordUri: obj.reply.uri,
        recordCid: obj.reply.cid,
        sortAt: obj.reply.createdAt,
      });
    }
  }

  const threadgateHiddenReplies = obj.threadgate?.hiddenReplies || [];

  // reply notifications
  for (const ancestor of obj.ancestors ?? []) {
    if (ancestor.uri === obj.reply.uri) continue; // no need to notify for own post
    if (ancestor.height < REPLY_NOTIF_DEPTH) {
      const ancestorUri = new AtUri(ancestor.uri);
      maybeNotify({
        did: ancestorUri.host,
        reason: "reply",
        reasonSubject: ancestorUri.toString(),
        author: obj.reply.authorDid,
        recordUri: obj.reply.uri,
        recordCid: obj.reply.cid,
        sortAt: obj.reply.createdAt,
      });
      // found hidden reply, don't notify any higher ancestors
      if (threadgateHiddenReplies.includes(ancestorUri.toString())) break;
    }
  }

  // descendents indicate out-of-order indexing: need to notify
  // the current post and upwards.
  for (const descendent of obj.descendents ?? []) {
    for (const ancestor of obj.ancestors ?? []) {
      const totalHeight = descendent.depth + ancestor.height;
      if (totalHeight < REPLY_NOTIF_DEPTH) {
        const ancestorUri = new AtUri(ancestor.uri);
        maybeNotify({
          did: ancestorUri.host,
          reason: "reply",
          reasonSubject: ancestorUri.toString(),
          author: descendent.creator,
          recordUri: descendent.uri,
          recordCid: descendent.cid,
          sortAt: descendent.sortAt,
        });
      }
    }
  }

  return notifs;
};

const deleteFn = async (
  db: Database,
  uri: AtUri,
): Promise<IndexedReply | null> => {
  const uriStr = uri.toString();
  const deleted = await db.models.Post.findOneAndDelete({ uri: uriStr });

  if (!deleted) {
    return null;
  }

  return {
    reply: deleted,
    facets: [], // Not used
  };
};

const notifsForDelete = (
  deleted: IndexedReply,
  replacedBy: IndexedReply | null,
) => {
  const notifs = replacedBy ? notifsForInsert(replacedBy) : [];
  return {
    notifs,
    toDelete: [deleted.reply.uri],
  };
};

const updateAggregates = async (db: Database, replyIdx: IndexedReply) => {
  // Update reply count for parent post
  if (replyIdx.reply.reply?.parent?.uri) {
    const replyCount = await db.models.Post.countDocuments({
      "reply.parent.uri": replyIdx.reply.reply.parent.uri,
      violatesThreadGate: { $ne: true },
    });

    await db.models.Post.findOneAndUpdate(
      { uri: replyIdx.reply.reply?.parent.uri },
      { replyCount },
      { upsert: true, new: true },
    );
  }

  try {
    // Update posts count for author
    const postsCount = await db.models.Post.countDocuments({
      authorDid: replyIdx.reply.authorDid,
    });

    // First check if profile exists to avoid creating one with null URI
    const existingProfile = await db.models.Profile.findOne({
      authorDid: replyIdx.reply.authorDid,
    });

    if (existingProfile) {
      // Only update existing profiles
      await db.models.Profile.findOneAndUpdate(
        { authorDid: replyIdx.reply.authorDid },
        { postsCount },
        { new: true },
      );
    }
  } catch (error) {
    console.error("Error updating post aggregates:", error);
    // Don't throw - allow processing to continue even if aggregates update fails
  }
};

export type PluginType = RecordProcessor<ReplyRecord, IndexedReply>;

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

async function validateReply(
  db: Database,
  reply: ReplyRef,
) {
  const replyRefs = await getReplyRefs(db, reply);
  const invalidReplyRoot = !replyRefs.parent ||
    checkInvalidReplyRoot(reply, replyRefs.parent);
  return {
    invalidReplyRoot,
  };
}

async function getReplyRefs(db: Database, reply: ReplyRef) {
  const replyRoot = reply.root.uri;
  const replyParent = reply.parent.uri;

  const [root, parent] = await Promise.all([
    db.models.Record.findOne({ uri: replyRoot }).lean(),
    db.models.Record.findOne({ uri: replyParent }).lean(),
  ]);

  return {
    root: root && root.json
      ? {
        uri: root.uri,
        invalidReplyRoot: root.invalidReplyRoot ?? null,
        record: jsonToLex(root.json) as ReplyRecord,
      }
      : null,
    parent: parent && parent.json
      ? {
        uri: parent.uri,
        invalidReplyRoot: parent.invalidReplyRoot ?? null,
        record: jsonToLex(parent.json) as ReplyRecord,
      }
      : null,
  };
}
