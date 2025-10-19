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
import { jsonToLex } from "@atp/lexicon";

type Ancestor = {
  uri: string;
  height: number;
};
type Descendent = {
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
  ancestors?: Ancestor[];
  descendents?: Descendent[];
  threadgate?: GateRecord;
};

const lexId = lex.ids.SoSprkFeedReply;

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

  const reply = {
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
    image: obj.image,
    langs: obj.langs || [],
    labels: obj.labels || null,
    tags: obj.tags || [],
    createdAt: obj.createdAt,
    indexedAt: timestamp,
  };

  // Use findOneAndUpdate with upsert to handle potential duplicate key errors
  try {
    const insertedReply = await db.models.Reply.findOneAndUpdate(
      { uri: reply.uri },
      reply,
      { upsert: true, new: true },
    );

    if (obj.reply) {
      const { invalidReplyRoot } = await validateReply(
        db,
        obj.reply,
      );
      if (invalidReplyRoot) {
        Object.assign(insertedReply, { invalidReplyRoot });
        await db.models.Reply.updateOne(
          { uri: reply.uri },
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
    if (isMediaImage(obj.media)) {
      const imageMedia = {
        postUri: uri.toString(),
        cid: obj.media.image.ref.toString(),
        alt: obj.alt as string,
      };
      image = imageMedia;
    }

    const ancestors = await getAncestorsAndSelf(db, {
      uri: reply.uri,
      parentHeight: REPLY_NOTIF_DEPTH,
    });
    const descendents = await getDescendents(db, {
      uri: reply.uri,
      depth: REPLY_NOTIF_DEPTH,
    });

    return {
      reply: insertedReply,
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
    if (ancestor.uri === obj.reply.uri) continue;
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
  // everything upwards of the current reply
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
  const deleted = await db.models.Reply.findOneAndDelete({ uri: uriStr });

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
    const parentPost = await db.models.Post.findOne({
      uri: replyIdx.reply.reply?.parent.uri,
    });
    const parentReply = await db.models.Reply.findOne({
      uri: replyIdx.reply.reply?.parent.uri,
    });

    const replyCount = await db.models.Reply.countDocuments({
      "reply.parent.uri": replyIdx.reply.reply.parent.uri,
    });

    if (parentPost) {
      await db.models.Post.findOneAndUpdate(
        { uri: replyIdx.reply.reply?.parent.uri },
        { replyCount },
        { upsert: true, new: true },
      );
    } else if (parentReply) {
      await db.models.Reply.findOneAndUpdate(
        { uri: replyIdx.reply.reply?.parent.uri },
        { replyCount },
        { upsert: true, new: true },
      );
    }
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
