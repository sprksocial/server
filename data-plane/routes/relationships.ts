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

    const relationships = await Promise.all(
      targetDids.map(async (targetDid) => {
        const [
          blocking,
          blockedBy,
          following,
          followedBy,
        ] = await Promise.all([
          // Check if actor blocks target
          this.db.models.Block.findOne({
            authorDid: actorDid,
            subjectDid: targetDid,
          }),
          // Check if target blocks actor
          this.db.models.Block.findOne({
            authorDid: targetDid,
            subjectDid: actorDid,
          }),
          // Check if actor follows target
          this.db.models.Follow.findOne({
            authorDid: actorDid,
            subject: targetDid,
          }),
          // Check if target follows actor
          this.db.models.Follow.findOne({
            authorDid: targetDid,
            subject: actorDid,
          }),
        ]);

        return {
          muted: false,
          mutedByList: "",
          blockedBy: blockedBy?.uri || "",
          blocking: blocking?.uri || "",
          blockedByList: "",
          blockingByList: "",
          following: following?.uri || "",
          followedBy: followedBy?.uri || "",
        };
      }),
    );

    return { relationships };
  }

  async getBlockExistence(pairs: Array<{ a: string; b: string }>) {
    if (pairs.length === 0) {
      return { exists: [], blocks: [] };
    }

    const results = await Promise.all(
      pairs.map(async (pair) => {
        const [
          blocking,
          blockedBy,
        ] = await Promise.all([
          // Check if A blocks B
          this.db.models.Block.findOne({
            authorDid: pair.a,
            subjectDid: pair.b,
          }),
          // Check if B blocks A
          this.db.models.Block.findOne({
            authorDid: pair.b,
            subjectDid: pair.a,
          }),
        ]);

        const hasBlocks = !!(
          blocking ||
          blockedBy
        );

        return {
          exists: hasBlocks,
          blocks: {
            blockedBy: blockedBy?.uri || undefined,
            blocking: blocking?.uri || undefined,
            blockedByList: undefined,
            blockingByList: undefined,
          },
        };
      }),
    );

    return {
      exists: results.map((r) => r.exists),
      blocks: results.map((r) => r.blocks),
    };
  }
}
