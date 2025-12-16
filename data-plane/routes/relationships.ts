import { Database } from "../db/index.ts";

export class Relationships {
  private db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  async getRelationships(actorDid: string, targetDids: string[]) {
    if (targetDids.length === 0) {
      return { relationships: [] };
    }

    // Batch queries using $in to reduce N+1 to 4 total queries
    const [
      blockingResults,
      blockedByResults,
      followingResults,
      followedByResults,
    ] = await Promise.all([
      // All blocks where actor blocks any target
      this.db.models.Block.find({
        authorDid: actorDid,
        subject: { $in: targetDids },
      }),
      // All blocks where any target blocks actor
      this.db.models.Block.find({
        authorDid: { $in: targetDids },
        subject: actorDid,
      }),
      // All follows where actor follows any target
      this.db.models.Follow.find({
        authorDid: actorDid,
        subject: { $in: targetDids },
      }),
      // All follows where any target follows actor
      this.db.models.Follow.find({
        authorDid: { $in: targetDids },
        subject: actorDid,
      }),
    ]);

    // Build lookup maps for O(1) access
    const blockingMap = new Map(
      blockingResults.map((b) => [b.subject, b.uri]),
    );
    const blockedByMap = new Map(
      blockedByResults.map((b) => [b.authorDid, b.uri]),
    );
    const followingMap = new Map(
      followingResults.map((f) => [f.subject, f.uri]),
    );
    const followedByMap = new Map(
      followedByResults.map((f) => [f.authorDid, f.uri]),
    );

    // Build relationships from maps
    const relationships = targetDids.map((targetDid) => ({
      muted: false,
      blockedBy: blockedByMap.get(targetDid) || "",
      blocking: blockingMap.get(targetDid) || "",
      following: followingMap.get(targetDid) || "",
      followedBy: followedByMap.get(targetDid) || "",
    }));

    return { relationships };
  }

  async getBlockExistence(pairs: Array<{ a: string; b: string }>) {
    if (pairs.length === 0) {
      return { exists: [], blocks: [] };
    }

    // Build all block query pairs for batch lookup
    const blockQueries = pairs.flatMap((pair) => [
      { authorDid: pair.a, subject: pair.b },
      { authorDid: pair.b, subject: pair.a },
    ]);

    // Single batch query using $or
    const allBlocks = await this.db.models.Block.find({
      $or: blockQueries,
    });

    // Build lookup map: "authorDid:subject" -> uri
    const blockMap = new Map(
      allBlocks.map((b) => [`${b.authorDid}:${b.subject}`, b.uri]),
    );

    // Build results from map
    const results = pairs.map((pair) => {
      const blockingUri = blockMap.get(`${pair.a}:${pair.b}`);
      const blockedByUri = blockMap.get(`${pair.b}:${pair.a}`);
      const hasBlocks = !!(blockingUri || blockedByUri);

      return {
        exists: hasBlocks,
        blocks: {
          blockedBy: blockedByUri || undefined,
          blocking: blockingUri || undefined,
          blockedByList: undefined,
          blockingByList: undefined,
        },
      };
    });

    return {
      exists: results.map((r) => r.exists),
      blocks: results.map((r) => r.blocks),
    };
  }
}
