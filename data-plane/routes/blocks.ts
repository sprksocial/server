import { Database } from "../db/index.ts";
import { TimeCidKeyset } from "../db/pagination.ts";

export class Blocks {
  private db: Database;
  private timeCidKeyset: TimeCidKeyset;

  constructor(db: Database) {
    this.db = db;
    this.timeCidKeyset = new TimeCidKeyset();
  }

  async getBidirectionalBlock(actorDid: string, targetDid: string) {
    // Check for blocks in both directions
    const block = await this.db.models.Block.findOne({
      $or: [
        { authorDid: actorDid, subject: targetDid },
        { authorDid: targetDid, subject: actorDid },
      ],
    });

    return {
      blockUri: block?.uri || null,
    };
  }

  async getBlocks(actorDid: string, limit = 50, cursor?: string) {
    // Build query for blocks by this actor
    const blocksQuery = this.db.models.Block.find({ authorDid: actorDid });

    // Apply pagination using TimeCidKeyset
    const paginatedQuery = this.timeCidKeyset.paginate(blocksQuery, {
      limit,
      cursor,
      direction: "desc",
    });

    const blocks = await paginatedQuery.exec();

    // Generate cursor from the last item if we have a full page
    let nextCursor: string | undefined;
    if (blocks.length === limit && blocks.length > 0) {
      const lastBlock = blocks[blocks.length - 1];
      nextCursor = this.timeCidKeyset.pack({
        primary: lastBlock.indexedAt,
        secondary: lastBlock.cid,
      });
    }

    return {
      blockUris: blocks.map((b) => b.uri),
      cursor: nextCursor,
    };
  }
}
