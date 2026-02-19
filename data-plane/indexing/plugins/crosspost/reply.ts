import { CID } from "multiformats/cid";
import { AtUri } from "@atp/syntax";
import * as lex from "../../../../lex/lexicons.ts";
import { Record as BskyPostRecord } from "../../../../lex/types/app/bsky/feed/post.ts";
import {
  isLink,
  isMention,
} from "../../../../lex/types/app/bsky/richtext/facet.ts";
import { BackgroundQueue } from "../../../background.ts";
import { Database } from "../../../db/index.ts";
import { CrosspostReplyDocument } from "../../../db/models.ts";
import { getAncestorsAndSelf, getDescendents } from "../../../util.ts";
import { RecordProcessor } from "../../processor.ts";

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
  reply: CrosspostReplyDocument;
  facets?: { type: "mention" | "link"; value: string }[];
  media?: {
    cid?: string;
    alt?: string | null;
  };
  ancestors?: Ancestor[];
  descendents?: Descendent[];
};

const lexId = lex.ids.AppBskyFeedPost;

const REPLY_NOTIF_DEPTH = 5;

const insertFn = async (
  db: Database,
  uri: AtUri,
  cid: CID,
  obj: BskyPostRecord,
  timestamp: string,
): Promise<IndexedReply | null> => {
  if (!obj.reply) {
    return null;
  }

  const sparkPost = await db.models.Post.findOne({
    "crossposts.uri": obj.reply.root.uri,
  });
  if (!sparkPost) {
    return null;
  }

  const mappedRoot = {
    uri: sparkPost.uri,
    cid: sparkPost.cid,
  };

  let mappedParent = {
    uri: obj.reply.parent.uri,
    cid: obj.reply.parent.cid,
  };

  if (
    sparkPost.crossposts?.some((crosspost) =>
      crosspost.uri === obj.reply?.parent.uri
    )
  ) {
    mappedParent = {
      uri: sparkPost.uri,
      cid: sparkPost.cid,
    };
  } else {
    const [parentReply, parentCrosspostReply] = await Promise.all([
      db.models.Reply.findOne({
        uri: obj.reply.parent.uri,
      }),
      db.models.CrosspostReply.findOne({
        uri: obj.reply.parent.uri,
      }),
    ]);
    const parent = parentReply || parentCrosspostReply;
    if (parent) {
      mappedParent = {
        uri: parent.uri,
        cid: parent.cid,
      };
    }
  }

  const reply = {
    uri: uri.toString(),
    cid: cid.toString(),
    authorDid: uri.host,
    text: obj.text || "",
    facets: obj.facets || [],
    reply: {
      root: mappedRoot,
      parent: mappedParent,
    },
    langs: obj.langs || [],
    labels: obj.labels || null,
    tags: obj.tags || [],
    createdAt: obj.createdAt,
    indexedAt: timestamp,
  };

  const insertedReply = await db.models.CrosspostReply.findOneAndUpdate(
    { uri: reply.uri },
    { $set: reply },
    { upsert: true, returnDocument: "after" },
  );

  const { invalidReplyRoot } = await validateCrosspostReply(db, insertedReply);
  if (invalidReplyRoot) {
    Object.assign(insertedReply, { invalidReplyRoot });
    await db.models.CrosspostReply.updateOne(
      { uri: reply.uri },
      { $set: { invalidReplyRoot } },
    );
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
    media: {},
    ancestors,
    descendents,
  };
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
    }
  }

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
  const deleted = await db.models.CrosspostReply.findOneAndDelete({
    uri: uriStr,
  });

  if (!deleted) {
    return null;
  }

  return {
    reply: deleted,
    facets: [],
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
  if (replyIdx.reply.reply?.parent?.uri) {
    const parentPost = await db.models.Post.findOne({
      uri: replyIdx.reply.reply?.parent.uri,
    });
    const [
      parentReply,
      parentCrosspostReply,
      nativeReplyCount,
      crosspostReplyCount,
    ] = await Promise.all([
      db.models.Reply.findOne({
        uri: replyIdx.reply.reply?.parent.uri,
      }),
      db.models.CrosspostReply.findOne({
        uri: replyIdx.reply.reply?.parent.uri,
      }),
      db.models.Reply.countDocuments({
        "reply.parent.uri": replyIdx.reply.reply.parent.uri,
      }),
      db.models.CrosspostReply.countDocuments({
        "reply.parent.uri": replyIdx.reply.reply.parent.uri,
      }),
    ]);
    const replyCount = nativeReplyCount + crosspostReplyCount;

    if (parentPost) {
      await db.models.Post.findOneAndUpdate(
        { uri: replyIdx.reply.reply?.parent.uri },
        { $set: { replyCount } },
        { returnDocument: "after" },
      );
    } else if (parentReply) {
      await db.models.Reply.findOneAndUpdate(
        { uri: replyIdx.reply.reply?.parent.uri },
        { $set: { replyCount } },
        { returnDocument: "after" },
      );
    } else if (parentCrosspostReply) {
      await db.models.CrosspostReply.findOneAndUpdate(
        { uri: replyIdx.reply.reply?.parent.uri },
        { $set: { replyCount } },
        { returnDocument: "after" },
      );
    }
  }
};

export type PluginType = RecordProcessor<BskyPostRecord, IndexedReply>;

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

async function validateCrosspostReply(
  db: Database,
  reply: CrosspostReplyDocument,
) {
  const parentUri = reply.reply?.parent?.uri;
  const rootUri = reply.reply?.root?.uri;
  if (!parentUri || !rootUri) {
    return { invalidReplyRoot: true };
  }

  const [parentPost, parentReply, parentCrosspostReply] = await Promise.all([
    db.models.Post.findOne({ uri: parentUri }).lean(),
    db.models.Reply.findOne({ uri: parentUri }).lean(),
    db.models.CrosspostReply.findOne({ uri: parentUri }).lean(),
  ]);
  const parent = parentReply || parentCrosspostReply;

  if (!parentPost && !parent) {
    return { invalidReplyRoot: true };
  }

  if (parentPost) {
    return {
      invalidReplyRoot: parentUri !== rootUri,
    };
  }

  return {
    invalidReplyRoot: !!parent?.invalidReplyRoot ||
      parent?.reply?.root?.uri !== rootUri,
  };
}
