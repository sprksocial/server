import {
  Record as PostRecord,
  ReplyRef,
} from "../../lexicon/types/so/sprk/feed/post.ts";
import { Database } from "./index.ts";

export const getDescendents = async (
  db: Database,
  opts: {
    uri: string;
    depth: number; // required, protects against cycles
  },
) => {
  const { uri, depth } = opts;
  const descendents: Array<{
    uri: string;
    depth: number;
    cid: string;
    creator: string;
    sortAt: string;
  }> = [];

  // Get direct replies (depth 1)
  const directReplies = await db.models.Post.find({
    "reply.parent.uri": uri,
  }).select(["uri", "cid", "authorDid", "createdAt"]).lean();

  for (const reply of directReplies) {
    descendents.push({
      uri: reply.uri,
      depth: 1,
      cid: reply.cid,
      creator: reply.authorDid,
      sortAt: reply.createdAt,
    });
  }

  // Get nested replies (depth > 1)
  if (depth > 1) {
    const processedUris = new Set(directReplies.map((r) => r.uri));
    const toProcess = [...directReplies.map((r) => ({ uri: r.uri, depth: 1 }))];

    while (toProcess.length > 0) {
      const current = toProcess.shift()!;
      if (current.depth >= depth) continue;

      const nestedReplies = await db.models.Post.find({
        "reply.parent.uri": current.uri,
      }).select(["uri", "cid", "authorDid", "createdAt"]).lean();

      for (const reply of nestedReplies) {
        if (processedUris.has(reply.uri)) continue;
        processedUris.add(reply.uri);

        descendents.push({
          uri: reply.uri,
          depth: current.depth + 1,
          cid: reply.cid,
          creator: reply.authorDid,
          sortAt: reply.createdAt,
        });

        toProcess.push({ uri: reply.uri, depth: current.depth + 1 });
      }
    }
  }

  return descendents;
};

export const getAncestorsAndSelf = async (
  db: Database,
  opts: {
    uri: string;
    parentHeight: number; // required, protects against cycles
  },
) => {
  const { uri, parentHeight } = opts;
  const ancestors: Array<{
    uri: string;
    height: number;
  }> = [];

  // Start with the current post
  const currentPost = await db.models.Post.findOne({ uri }).lean();
  if (!currentPost) return ancestors;

  ancestors.push({
    uri: currentPost.uri,
    height: 0,
  });

  // Traverse up the reply chain
  let currentUri = currentPost.reply?.parent?.uri;
  let height = 1;

  while (currentUri && height <= parentHeight) {
    const parentPost = await db.models.Post.findOne({ uri: currentUri }).lean();
    if (!parentPost) break;

    ancestors.push({
      uri: parentPost.uri,
      height,
    });

    currentUri = parentPost.reply?.parent?.uri;
    height++;
  }

  return ancestors;
};

export const invalidReplyRoot = (
  reply: ReplyRef,
  parent: {
    record: PostRecord;
    invalidReplyRoot: boolean | null;
  },
) => {
  const replyRoot = reply.root.uri;
  const replyParent = reply.parent.uri;
  // if parent is not a valid reply, transitively this is not a valid one either
  if (parent.invalidReplyRoot) {
    return true;
  }
  // replying to root post: ensure the root looks correct
  if (replyParent === replyRoot) {
    return !!parent.record.reply;
  }
  // replying to a reply: ensure the parent is a reply for the same root post
  return parent.record.reply?.root.uri !== replyRoot;
};
