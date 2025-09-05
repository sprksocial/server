import { decodeBase64, encodeBase64 } from "jsr:@std/encoding/base64";
import { Types } from "mongoose";
import { Database } from "../db/index.ts";

// Types for MongoDB queries
interface LikeQuery {
  subject?: string;
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

export class Likes {
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

    // Build query for likes on this subject
    const query: LikeQuery = { subject: subject.uri };

    // Add cursor conditions for pagination
    if (createdAt && id) {
      query.$or = [
        { createdAt: { $lt: createdAt } },
        { createdAt: createdAt, _id: { $lt: id } },
      ];
    }

    const likes = await this.db.models.Like.find(query)
      .select("uri authorDid subject createdAt")
      .sort({ createdAt: -1, _id: -1 })
      .limit(limit);

    let nextCursor: string | undefined;
    if (likes.length === limit) {
      const lastLike = likes[likes.length - 1];
      nextCursor = createCursor(
        lastLike.createdAt,
        (lastLike._id as Types.ObjectId).toString(),
      );
    }

    return {
      uris: likes.map((l) => l.uri),
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

    // Get all likes by this actor for the specified subjects
    const subjectUris = refs.map(({ uri }) => uri);
    const likes = await this.db.models.Like.find({
      authorDid: actorDid,
      subject: { $in: subjectUris },
    }).select("uri subject");

    // Create a map for quick lookup
    const likeMap = new Map(likes.map((l) => [l.subject, l.uri]));
    const uris = refs.map(({ uri }) => likeMap.get(uri) || "");

    return { uris };
  }

  async getActor(actorDid: string, limit = 50, cursor?: string) {
    const { createdAt, id } = parseCursor(cursor);

    // Build query for likes by this actor
    const query: LikeQuery = { authorDid: actorDid };

    // Add cursor conditions for pagination
    if (createdAt && id) {
      query.$or = [
        { createdAt: { $lt: createdAt } },
        { createdAt: createdAt, _id: { $lt: id } },
      ];
    }

    const likes = await this.db.models.Like.find(query)
      .select("uri authorDid subject createdAt")
      .sort({ createdAt: -1, _id: -1 })
      .limit(limit);

    let nextCursor: string | undefined;
    if (likes.length === limit) {
      const lastLike = likes[likes.length - 1];
      nextCursor = createCursor(
        lastLike.createdAt,
        (lastLike._id as Types.ObjectId).toString(),
      );
    }

    return {
      likes: likes.map((l) => ({
        uri: l.uri,
        subject: l.subject,
      })),
      cursor: nextCursor,
    };
  }
}
