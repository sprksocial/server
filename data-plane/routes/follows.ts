import { Database } from "../db/index.ts";
import { TimeCidKeyset } from "../db/pagination.ts";

// Create a simple FollowsFollowing class since we removed the proto import
class FollowsFollowing {
  targetDid: string;
  dids: string[];

  constructor(data: { targetDid: string; dids: string[] }) {
    this.targetDid = data.targetDid;
    this.dids = data.dids;
  }
}

export class Follows {
  private db: Database;
  private timeCidKeyset: TimeCidKeyset;

  constructor(db: Database) {
    this.db = db;
    this.timeCidKeyset = new TimeCidKeyset();
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
    // Build query for followers (people who follow this actor)
    const followersQuery = this.db.models.Follow.find({ subject: actorDid })
      .populate("actor", "did handle indexedAt takedownRef upstreamStatus")
      .select("uri authorDid subject createdAt cid");

    // Apply pagination using TimeCidKeyset
    const paginatedQuery = this.timeCidKeyset.paginate(followersQuery, {
      limit,
      cursor,
      direction: "desc",
    });

    const followers = await paginatedQuery.exec();

    // Generate cursor from the last item if we have a full page
    let nextCursor: string | undefined;
    if (followers.length === limit && followers.length > 0) {
      const lastFollower = followers[followers.length - 1];
      nextCursor = this.timeCidKeyset.pack({
        primary: lastFollower.createdAt,
        secondary: lastFollower.cid,
      });
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
    // Build query for follows (people this actor follows)
    const followsQuery = this.db.models.Follow.find({ authorDid: actorDid })
      .populate("actor", "did handle indexedAt takedownRef upstreamStatus")
      .select("uri authorDid subject createdAt cid");

    // Apply pagination using TimeCidKeyset
    const paginatedQuery = this.timeCidKeyset.paginate(followsQuery, {
      limit,
      cursor,
      direction: "desc",
    });

    const follows = await paginatedQuery.exec();

    // Generate cursor from the last item if we have a full page
    let nextCursor: string | undefined;
    if (follows.length === limit && follows.length > 0) {
      const lastFollow = follows[follows.length - 1];
      nextCursor = this.timeCidKeyset.pack({
        primary: lastFollow.createdAt,
        secondary: lastFollow.cid,
      });
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
