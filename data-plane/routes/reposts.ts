import { decodeBase64, encodeBase64 } from "@std/encoding/base64";
import { Types } from "mongoose";
import { Database } from "../db/index.ts";

// Types for MongoDB queries
interface RepostQuery {
  "subject.uri"?: string;
  authorDid?: string;
  createdAt?: { $lt: string };
  _id?: { $lt: string };
  $or?: Array<
    {
      createdAt?: { $lt: string };
      _id?: { $lt: string };
    } | {
      createdAt: string;
      _id: { $lt: string };
    }
  >;
}

// Helper function to parse cursor
function parseCursor(cursor?: string): { createdAt?: string; id?: string } {
  if (!cursor) return {};
  try {
    const decoded = new TextDecoder().decode(decodeBase64(cursor));
    return JSON.parse(decoded);
  } catch {
    return {};
  }
}

// Helper function to create cursor
function createCursor(createdAt: string, id: string): string {
  const cursorData = { createdAt, id };
  const encoded = new TextEncoder().encode(JSON.stringify(cursorData));
  return encodeBase64(encoded);
}

export class Reposts {
  private db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  async bySubject(
    subject?: { uri: string; cid?: string },
    limit = 50,
    cursor?: string,
  ) {
    if (!subject?.uri) {
      return { uris: [] };
    }

    const { createdAt, id } = parseCursor(cursor);

    // Build query for reposts of this subject
    const query: RepostQuery = { "subject.uri": subject.uri };

    // Add cursor conditions for pagination
    if (createdAt && id) {
      query.$or = [
        { createdAt: { $lt: createdAt } },
        { createdAt: createdAt, _id: { $lt: id } },
      ];
    }

    const reposts = await this.db.models.Repost.find(query)
      .select("uri authorDid subject createdAt")
      .sort({ createdAt: -1, _id: -1 })
      .limit(limit);

    let nextCursor: string | undefined;
    if (reposts.length === limit) {
      const lastRepost = reposts[reposts.length - 1];
      nextCursor = createCursor(
        lastRepost.createdAt,
        (lastRepost._id as Types.ObjectId).toString(),
      );
    }

    return {
      uris: reposts.map((r) => r.uri),
      cursor: nextCursor,
    };
  }

  async byActorAndSubjects(
    actorDid: string,
    refs: Array<{ uri: string; cid?: string }>,
  ) {
    if (refs.length === 0) {
      return { uris: [] };
    }

    // Get all reposts by this actor for the specified subjects
    const subjectUris = refs.map(({ uri }) => uri);
    const reposts = await this.db.models.Repost.find({
      authorDid: actorDid,
      "subject.uri": { $in: subjectUris },
    }).select("uri subject");

    // Create a map for quick lookup
    const repostMap = new Map(reposts.map((r) => [r.subject.uri, r.uri]));
    const uris = refs.map(({ uri }) => repostMap.get(uri) || "");

    return { uris };
  }

  async getActor(actorDid: string, limit = 50, cursor?: string) {
    const { createdAt, id } = parseCursor(cursor);

    // Build query for reposts by this actor
    const query: RepostQuery = { authorDid: actorDid };

    // Add cursor conditions for pagination
    if (createdAt && id) {
      query.$or = [
        { createdAt: { $lt: createdAt } },
        { createdAt: createdAt, _id: { $lt: id } },
      ];
    }

    const reposts = await this.db.models.Repost.find(query)
      .select("uri authorDid subject createdAt")
      .sort({ createdAt: -1, _id: -1 })
      .limit(limit);

    let nextCursor: string | undefined;
    if (reposts.length === limit) {
      const lastRepost = reposts[reposts.length - 1];
      nextCursor = createCursor(
        lastRepost.createdAt,
        (lastRepost._id as Types.ObjectId).toString(),
      );
    }

    return {
      uris: reposts.map((r) => r.uri),
      cursor: nextCursor,
    };
  }
}
