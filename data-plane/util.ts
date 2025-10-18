import {
  Record as ReplyRecord,
  ReplyRef,
} from "../lex/types/so/sprk/feed/reply.ts";
import { Database } from "./db/index.ts";
import { DidDocument } from "@atp/identity";

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

      const nestedReplies = await db.models.Reply.find({
        "reply.parent.uri": current.uri,
      }).lean();

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
  const currentPost = await db.models.Reply.findOne({ uri }).lean();
  if (!currentPost) return ancestors;

  ancestors.push({
    uri: currentPost.uri,
    height: 0,
  });

  // Traverse up the reply chain
  let currentUri = currentPost.reply?.parent?.uri;
  let height = 1;

  while (currentUri && height <= parentHeight) {
    const parentReply = await db.models.Reply.findOne({ uri: currentUri })
      .lean();
    if (!parentReply) break;

    ancestors.push({
      uri: parentReply.uri,
      height,
    });

    currentUri = parentReply.reply?.parent?.uri;
    height++;
  }

  return ancestors;
};

export const invalidReplyRoot = (
  reply: ReplyRef,
  parent: {
    record: ReplyRecord;
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

const getDid = (doc: DidDocument) => doc.id;
const getHandle = (doc: DidDocument) =>
  doc.alsoKnownAs?.find((aka) => aka.startsWith("at://"))?.replace("at://", "");

export const getResultFromDoc = (doc: DidDocument) => {
  const keys: Record<string, { Type: string; PublicKeyMultibase: string }> = {};
  doc.verificationMethod?.forEach((method) => {
    const id = method.id.split("#").at(1);
    if (!id) return;
    keys[id] = {
      Type: method.type,
      PublicKeyMultibase: method.publicKeyMultibase || "",
    };
  });
  const services: Record<string, { Type: string; URL: string }> = {};
  doc.service?.forEach((service) => {
    const id = service.id.split("#").at(1);
    if (!id) return;
    if (typeof service.serviceEndpoint !== "string") return;
    services[id] = {
      Type: service.type,
      URL: service.serviceEndpoint,
    };
  });
  return {
    did: getDid(doc),
    handle: getHandle(doc),
    keys: new TextEncoder().encode(JSON.stringify(keys)),
    services: new TextEncoder().encode(JSON.stringify(services)),
    updated: new Date(),
  };
};

export enum Code {
  NotFound = "Not Found",
  InvalidRequest = "Invalid Request",
  InternalError = "Internal Error",
}

export class DataPlaneError extends Error {
  public code: Code;

  constructor(message: Code) {
    super();
    this.name = "DataPlaneError";
    this.code = message;
  }
}

export function isDataPlaneError(error: unknown, code?: Code): boolean {
  return error instanceof DataPlaneError && (!code || error.code === code);
}
