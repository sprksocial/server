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
    });

    // Create a map for quick lookup
    const followMap = new Map(follows.map((f) => [f.subject, f.uri]));
    const uris = targetDids.map((did) => followMap.get(did) || "");

    return { uris };
  }

  async getFollowers(actorDid: string, limit = 50, cursor?: string) {
    // Build query for followers (people who follow this actor)
    const followersQuery = this.db.models.Follow.find({ subject: actorDid });

    // Apply pagination using TimeCidKeyset
    const paginatedQuery = this.timeCidKeyset.paginate(followersQuery, {
      limit,
      cursor,
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
    const followsQuery = this.db.models.Follow.find({ authorDid: actorDid });

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
     * Find people the viewer follows who also follow each subject.
     * Uses aggregation to avoid fetching all followers of popular accounts.
     */

    // Get all people the viewer follows (bounded by viewer's follow count)
    const viewerFollows = await this.db.models.Follow.find({
      authorDid: viewerDid,
    }).select("subject");

    const viewerFollowsDids = viewerFollows.map((f) => f.subject);

    if (viewerFollowsDids.length === 0 || subjectDids.length === 0) {
      // Viewer follows no one, so no known followers possible
      return {
        results: subjectDids.map((targetDid) =>
          new FollowsFollowing({ targetDid, dids: [] })
        ),
      };
    }

    // Batch query: get all follows where authorDid is in viewer's follows AND subject is in subjectDids
    // This replaces N sequential queries with 1 query
    const mutualConnections = await this.db.models.Follow.find({
      authorDid: { $in: viewerFollowsDids },
      subject: { $in: subjectDids },
    }).select("authorDid subject");

    // Group results by subject
    const connectionsBySubject = new Map<string, string[]>();
    for (const connection of mutualConnections) {
      const existing = connectionsBySubject.get(connection.subject) ?? [];
      existing.push(connection.authorDid);
      connectionsBySubject.set(connection.subject, existing);
    }

    // Build results in the same order as subjectDids
    const results = subjectDids.map((subjectDid) =>
      new FollowsFollowing({
        targetDid: subjectDid,
        dids: connectionsBySubject.get(subjectDid) ?? [],
      })
    );

    return { results };
  }
}
