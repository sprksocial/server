import { decodeBase64, encodeBase64 } from "jsr:@std/encoding/base64";
import { Types } from "mongoose";
import { Database } from "../db/index.ts";

// Types for MongoDB queries
interface FollowQuery {
  subject?: string;
  authorDid?: string;
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

// Create a simple FollowsFollowing class since we removed the proto import
class FollowsFollowing {
  targetDid: string;
  dids: string[];

  constructor(data: { targetDid: string; dids: string[] }) {
    this.targetDid = data.targetDid;
    this.dids = data.dids;
  }
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

export class Follows {
  private db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  async getActorFollowsActors(actorDid: string, targetDids: string[]) {
    if (targetDids.length < 1) {
      return { uris: [] };
    }

    const follows = await this.db.models.Follow.find({
      authorDid: actorDid,
      subject: { $in: targetDids },
    }).select("uri subject");

    // Create a map for quick lookup
    const followMap = new Map(follows.map((f) => [f.subject, f.uri]));
    const uris = targetDids.map((did) => followMap.get(did) || "");

    return { uris };
  }

  async getFollowers(actorDid: string, limit = 50, cursor?: string) {
    const { createdAt, id } = parseCursor(cursor);

    // Build query for followers (people who follow this actor)
    const query: FollowQuery = { subject: actorDid };

    // Add cursor conditions for pagination
    if (createdAt && id) {
      query.$or = [
        { createdAt: { $lt: createdAt } },
        { createdAt: createdAt, _id: { $lt: id } },
      ];
    }

    const followers = await this.db.models.Follow.find(query)
      .populate("actor", "did handle indexedAt takedownRef upstreamStatus")
      .select("uri authorDid subject createdAt")
      .sort({ createdAt: -1, _id: -1 })
      .limit(limit);

    let nextCursor: string | undefined;
    if (followers.length === limit) {
      const lastFollower = followers[followers.length - 1];
      nextCursor = createCursor(
        lastFollower.createdAt,
        (lastFollower._id as Types.ObjectId).toString(),
      );
    }

    return {
      followers: followers.map((f) => ({
        uri: f.uri,
        actorDid: f.authorDid,
        subjectDid: f.subject,
      })),
      cursor: nextCursor,
    };
  }

  async getFollows(actorDid: string, limit = 50, cursor?: string) {
    const { createdAt, id } = parseCursor(cursor);

    // Build query for follows (people this actor follows)
    const query: FollowQuery = { authorDid: actorDid };

    // Add cursor conditions for pagination
    if (createdAt && id) {
      query.$or = [
        { createdAt: { $lt: createdAt } },
        { createdAt: createdAt, _id: { $lt: id } },
      ];
    }

    const follows = await this.db.models.Follow.find(query)
      .populate("actor", "did handle indexedAt takedownRef upstreamStatus")
      .select("uri authorDid subject createdAt")
      .sort({ createdAt: -1, _id: -1 })
      .limit(limit);

    let nextCursor: string | undefined;
    if (follows.length === limit) {
      const lastFollow = follows[follows.length - 1];
      nextCursor = createCursor(
        lastFollow.createdAt,
        (lastFollow._id as Types.ObjectId).toString(),
      );
    }

    return {
      follows: follows.map((f) => ({
        uri: f.uri,
        actorDid: f.authorDid,
        subjectDid: f.subject,
      })),
      cursor: nextCursor,
    };
  }

  async getFollowsFollowing(viewerDid: string, subjectDids: string[]) {
    /*
     * 1. Get all the people Alice is following
     * 2. Get all the people Dan is followed by
     * 3. Find the intersection
     */

    const results: FollowsFollowing[] = [];

    for (const subjectDid of subjectDids) {
      // Get people who follow the subject (Dan's followers)
      const subjectFollowers = await this.db.models.Follow.find({
        subject: subjectDid,
      }).select("authorDid");

      const followerDids = subjectFollowers.map((f) => f.authorDid);

      // Find which of these followers Alice also follows
      const mutualConnections = await this.db.models.Follow.find({
        authorDid: viewerDid,
        subject: { $in: followerDids },
      }).select("subject");

      results.push(
        new FollowsFollowing({
          targetDid: subjectDid,
          dids: mutualConnections.map((connection) => connection.subject),
        }),
      );
    }

    return { results };
  }
}
