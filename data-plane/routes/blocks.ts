import { decodeBase64, encodeBase64 } from "jsr:@std/encoding/base64";
import { Types } from "mongoose";
import { Database } from "../db/index.ts";

// Types for MongoDB queries
interface BlockQuery {
  authorDid?: string;
  subject?: string;
  $or?: Array<
    {
      authorDid: string;
      subject: string;
    } | {
      createdAt: { $lt: string };
      _id?: { $lt: string };
    } | {
      createdAt: string;
      _id: { $lt: string };
    }
  >;
  createdAt?: { $lt: string };
  _id?: { $lt: string };
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

export class Blocks {
  private db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  async bidirectional(actorDid: string, targetDid: string) {
    // Check for blocks in both directions
    const block = await this.db.models.Block.findOne({
      $or: [
        { authorDid: actorDid, subject: targetDid },
        { authorDid: targetDid, subject: actorDid },
      ],
    }).select("uri");

    return {
      blockUri: block?.uri || null,
    };
  }

  async getBlocks(actorDid: string, limit = 50, cursor?: string) {
    const { createdAt, id } = parseCursor(cursor);

    // Build query for blocks by this actor
    const query: BlockQuery = { authorDid: actorDid };

    // Add cursor conditions for pagination
    if (createdAt && id) {
      query.$or = [
        { createdAt: { $lt: createdAt } },
        { createdAt: createdAt, _id: { $lt: id } },
      ] as BlockQuery["$or"];
    }

    const blocks = await this.db.models.Block.find(query)
      .select("uri subject createdAt")
      .sort({ createdAt: -1, _id: -1 })
      .limit(limit);

    let nextCursor: string | undefined;
    if (blocks.length === limit) {
      const lastBlock = blocks[blocks.length - 1];
      nextCursor = createCursor(
        lastBlock.createdAt,
        (lastBlock._id as Types.ObjectId).toString(),
      );
    }

    return {
      blockUris: blocks.map((b) => b.uri),
      cursor: nextCursor,
    };
  }
}
