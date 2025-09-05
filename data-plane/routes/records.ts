import { Database } from "../db/index.ts";
import { AtUri } from "@atproto/syntax";
import { ids } from "../../lex/lexicons.ts";
import { RecordDocument } from "../db/models.ts";

// Helper function to get records by collection
async function getRecords(
  db: Database,
  uris: string[],
  collection?: string | string[],
): Promise<{
  records: Array<{
    record: string;
    cid?: string;
    createdAt?: string;
    indexedAt?: string;
    takenDown: boolean;
    takedownRef?: string;
    tags?: string[];
  }>;
}> {
  // Filter out empty or invalid URIs first
  const nonEmptyUris = uris.filter((uri) => uri && uri.trim().length > 0);

  const validUris = collection
    ? Array.isArray(collection)
      ? nonEmptyUris.filter((uri) => {
        try {
          return new AtUri(uri).collection === collection[0];
        } catch {
          return false;
        }
      })
      : nonEmptyUris.filter((uri) => {
        try {
          return new AtUri(uri).collection === collection;
        } catch {
          return false;
        }
      })
    : nonEmptyUris;

  const records = validUris.length
    ? await db.models.Record.find({
      uri: { $in: validUris },
    }).select("uri cid json createdAt indexedAt takedownRef")
    : [];

  const recordMap = new Map(records.map((r: RecordDocument) => [r.uri, r]));

  const result = uris.map((uri) => {
    const record = recordMap.get(uri);
    const json = record ? JSON.stringify(record.json) : JSON.stringify(null);
    const parsedJson = record ? Object(record.json) : null;
    const createdAtRaw = parsedJson?.createdAt
      ? new Date(parsedJson.createdAt)
      : null;
    const createdAt = createdAtRaw && !isNaN(createdAtRaw.getTime())
      ? createdAtRaw.toISOString()
      : undefined;
    const indexedAt = record?.indexedAt
      ? new Date(record.indexedAt).toISOString()
      : undefined;

    return {
      record: json,
      cid: record?.cid,
      createdAt,
      indexedAt,
      sortedAt: compositeTime(createdAt, indexedAt),
      takenDown: !!record?.takedownRef,
      takedownRef: record?.takedownRef || undefined,
      tags: parsedJson?.tags || undefined,
    };
  });

  return { records: result };
}

// Helper function to get post records with metadata
async function getPostRecords(
  db: Database,
  uris: string[],
): Promise<{
  records: Array<{
    record: string;
    cid?: string;
    createdAt?: string;
    indexedAt?: string;
    sortedAt?: string;
    takenDown: boolean;
    takedownRef?: string;
    tags?: string[];
    sound?: string;
  }>;
}> {
  const [{ records }] = await Promise.all([
    getRecords(db, uris, ids.SoSprkFeedPost),
    uris.length
      ? db.models.Post.find({
        uri: { $in: uris },
      }).select(
        "uri violatesThreadGate violatesEmbeddingRules hasThreadGate hasPostGate",
      )
      : [],
  ]);

  return { records };
}

// Helper function for composite time
function compositeTime(ts1?: string, ts2?: string): string | undefined {
  if (!ts1) return ts2;
  if (!ts2) return ts1;
  return new Date(ts1) < new Date(ts2) ? ts1 : ts2;
}

export class Records {
  private db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  async getBlockRecords(uris: string[]) {
    const result = await getRecords(this.db, uris, ids.AppBskyGraphBlock);
    return result;
  }

  async getFeedGeneratorRecords(uris: string[]) {
    try {
      const result = await getRecords(this.db, uris, [
        ids.AppBskyFeedGenerator,
        ids.SoSprkFeedGenerator,
      ]);
      return result;
    } catch (error) {
      console.error("Error fetching feed generator records:", error);
      throw new Error("Failed to fetch records");
    }
  }

  async getFollowRecords(uris: string[]) {
    const result = await getRecords(this.db, uris, ids.AppBskyGraphFollow);
    return result;
  }

  async getLikeRecords(uris: string[]) {
    try {
      const result = await getRecords(this.db, uris, ids.SoSprkFeedLike);
      return result;
    } catch (error) {
      console.error("Error fetching like records:", error);
      throw new Error("Failed to fetch records");
    }
  }

  async getPostRecords(uris: string[]) {
    try {
      const result = await getPostRecords(this.db, uris);
      return result;
    } catch (error) {
      console.error("Error fetching post records:", error);
      throw new Error("Failed to fetch records");
    }
  }

  async getProfileRecords(uris: string[]) {
    try {
      const result = await getRecords(this.db, uris, ids.AppBskyActorProfile);
      return result;
    } catch (error) {
      console.error("Error fetching profile records:", error);
      throw new Error("Failed to fetch records");
    }
  }

  async getRepostRecords(uris: string[]) {
    try {
      const result = await getRecords(this.db, uris, ids.AppBskyFeedRepost);
      return result;
    } catch (error) {
      console.error("Error fetching repost records:", error);
      throw new Error("Failed to fetch records");
    }
  }

  async getRecords(uris: string[]) {
    try {
      const result = await getRecords(this.db, uris);
      return result;
    } catch (error) {
      console.error("Error fetching records:", error);
      throw new Error("Failed to fetch records");
    }
  }
}
