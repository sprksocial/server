import {
  CrosspostReplyDocument,
  PostDocument,
  ReplyDocument,
} from "../db/models.ts";
import { Database } from "../db/index.ts";
import { Code, DataPlaneError } from "../util.ts";

type NodeKind = "post" | "reply" | "crosspostReply";

type PostThreadNode = {
  kind: "post";
  doc: PostDocument;
};

type ReplyThreadNode = {
  kind: "reply";
  doc: ReplyDocument;
};

type CrosspostReplyThreadNode = {
  kind: "crosspostReply";
  doc: CrosspostReplyDocument;
};

type ThreadNode = PostThreadNode | ReplyThreadNode | CrosspostReplyThreadNode;
type ThreadSort = "oldest" | "newest" | "top";

export type CrosspostThreadItem = {
  uri: string;
  depth: number;
  kind: NodeKind;
  cid: string;
  authorDid: string;
  record: Record<string, unknown>;
  createdAt: string;
  indexedAt: string;
  likeCount: number;
  replyCount: number;
  repostCount?: number;
};

function validateThreadParams(above: number, below: number) {
  if (!Number.isInteger(above) || above < 0 || above > 1000) {
    throw new Error(
      "Invalid parentHeight: must be an integer between 0 and 1000",
    );
  }

  if (!Number.isInteger(below) || below < 0 || below > 1000) {
    throw new Error("Invalid depth: must be an integer between 0 and 1000");
  }
}

function getDescendantSort(
  sort: string | undefined,
): Record<string, 1 | -1> {
  const threadSort: ThreadSort = sort === "newest" || sort === "top"
    ? sort
    : "oldest";
  if (threadSort === "newest") {
    return { createdAt: -1 };
  }
  if (threadSort === "top") {
    return { likeCount: -1, createdAt: -1 };
  }
  return { createdAt: 1 };
}

function toThreadItem(node: ThreadNode, depth: number): CrosspostThreadItem {
  if (node.kind === "post") {
    return {
      uri: node.doc.uri,
      depth,
      kind: "post",
      cid: node.doc.cid,
      authorDid: node.doc.authorDid,
      record: {
        caption: node.doc.caption,
        media: node.doc.media,
        sound: node.doc.sound,
        langs: node.doc.langs,
        tags: node.doc.tags,
        crossposts: node.doc.crossposts,
        createdAt: node.doc.createdAt,
      },
      createdAt: node.doc.createdAt,
      indexedAt: node.doc.indexedAt,
      likeCount: node.doc.likeCount ?? 0,
      replyCount: node.doc.replyCount ?? 0,
      repostCount: node.doc.repostCount ?? 0,
    };
  }

  if (node.kind === "reply") {
    return {
      uri: node.doc.uri,
      depth,
      kind: "reply",
      cid: node.doc.cid,
      authorDid: node.doc.authorDid,
      record: {
        text: node.doc.text,
        facets: node.doc.facets,
        reply: node.doc.reply,
        media: node.doc.media,
        langs: node.doc.langs,
        createdAt: node.doc.createdAt,
      },
      createdAt: node.doc.createdAt,
      indexedAt: node.doc.indexedAt,
      likeCount: node.doc.likeCount ?? 0,
      replyCount: node.doc.replyCount ?? 0,
    };
  }

  return {
    uri: node.doc.uri,
    depth,
    kind: "crosspostReply",
    cid: node.doc.cid,
    authorDid: node.doc.authorDid,
    record: {
      $type: "app.bsky.feed.post",
      text: node.doc.text,
      facets: node.doc.facets,
      reply: node.doc.reply,
      langs: node.doc.langs,
      tags: node.doc.tags,
      createdAt: node.doc.createdAt,
    },
    createdAt: node.doc.createdAt,
    indexedAt: node.doc.indexedAt,
    likeCount: node.doc.likeCount ?? 0,
    replyCount: node.doc.replyCount ?? 0,
  };
}

const parentUriFromNode = (node: ThreadNode): string | undefined => {
  if (node.kind === "post") return undefined;
  return node.doc.reply?.parent?.uri;
};

export class CrosspostThread {
  private db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  private async getNodeByUri(
    uri: string,
    cache: Map<string, ThreadNode | null>,
  ): Promise<ThreadNode | null> {
    if (cache.has(uri)) {
      return cache.get(uri) ?? null;
    }

    const [post, reply, crosspostReply] = await Promise.all([
      this.db.models.Post.findOne({ uri }),
      this.db.models.Reply.findOne({ uri }),
      this.db.models.CrosspostReply.findOne({ uri }),
    ]);

    const node: ThreadNode | null = post
      ? { kind: "post", doc: post }
      : reply
      ? { kind: "reply", doc: reply }
      : crosspostReply
      ? { kind: "crosspostReply", doc: crosspostReply }
      : null;

    cache.set(uri, node);
    return node;
  }

  async getThread(
    anchorUri: string,
    parentHeight = 80,
    depth = 6,
    sort: string = "oldest",
  ): Promise<{ items: CrosspostThreadItem[] }> {
    validateThreadParams(parentHeight, depth);

    try {
      const cache = new Map<string, ThreadNode | null>();
      const anchorNode = await this.getNodeByUri(anchorUri, cache);
      if (!anchorNode) {
        throw new DataPlaneError(Code.NotFound);
      }

      const items: CrosspostThreadItem[] = [];
      const seenUris = new Set<string>();

      // Ancestors are depth -N..-1 so anchor can stay depth 0.
      const ancestorNodes: ThreadNode[] = [];
      const ancestorWalkSeenUris = new Set<string>([anchorNode.doc.uri]);
      if (anchorNode.kind !== "post") {
        let currentNode: ThreadNode = anchorNode;
        for (let i = 0; i < parentHeight; i++) {
          const parentUri = parentUriFromNode(currentNode);
          if (!parentUri || ancestorWalkSeenUris.has(parentUri)) {
            break;
          }
          const parentNode = await this.getNodeByUri(parentUri, cache);
          if (!parentNode) {
            break;
          }
          ancestorWalkSeenUris.add(parentUri);
          ancestorNodes.unshift(parentNode);
          if (parentNode.kind === "post") {
            break;
          }
          currentNode = parentNode;
        }
      }

      for (let i = 0; i < ancestorNodes.length; i++) {
        const ancestor = ancestorNodes[i];
        const ancestorDepth = i - ancestorNodes.length;
        if (!seenUris.has(ancestor.doc.uri)) {
          seenUris.add(ancestor.doc.uri);
          items.push(toThreadItem(ancestor, ancestorDepth));
        }
      }

      if (!seenUris.has(anchorNode.doc.uri)) {
        seenUris.add(anchorNode.doc.uri);
        items.push(toThreadItem(anchorNode, 0));
      }

      // Descendants only follow CrosspostReply edges to keep this flow isolated.
      const descendantSort = getDescendantSort(sort);
      const queue: Array<{ uri: string; depth: number }> = [{
        uri: anchorNode.doc.uri,
        depth: 0,
      }];

      while (queue.length > 0) {
        const current = queue.shift()!;
        if (current.depth >= depth) {
          continue;
        }

        const children = await this.db.models.CrosspostReply.find({
          "reply.parent.uri": current.uri,
        })
          .sort(descendantSort);

        for (const child of children) {
          if (seenUris.has(child.uri)) {
            continue;
          }
          seenUris.add(child.uri);
          const childNode: CrosspostReplyThreadNode = {
            kind: "crosspostReply",
            doc: child,
          };
          const childDepth = current.depth + 1;
          items.push(toThreadItem(childNode, childDepth));
          if (childDepth < depth) {
            queue.push({ uri: child.uri, depth: childDepth });
          }
        }
      }

      return { items };
    } catch (error) {
      if (error instanceof DataPlaneError) {
        throw error;
      }
      console.error("Error fetching crosspost thread:", error);
      throw new DataPlaneError(Code.InternalError);
    }
  }
}
