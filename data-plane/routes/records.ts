import { Database } from "../db/index.ts";
import { AtUri } from "@atproto/syntax";
import { ids } from "../../lex/lexicons.ts";
import { keyBy } from "@atproto/common";

export type Record = {
  record: string;
  uri: string;
  cid?: string;
  createdAt?: string;
  sortedAt?: string;
  indexedAt?: string;
  takenDown: boolean;
  takedownRef?: string;
};

// Helper function to get records by collection
export async function getRecords(
  db: Database,
  uris: string[],
  collection?: string | string[],
): Promise<{
  records: Array<Record>;
}> {
  const validUris = collection
    ? uris.filter((uri) => new AtUri(uri).collection === collection)
    : uris;

  const res = validUris.length
    ? await db.models.Record.find({
      uri: { $in: validUris },
    })
    : [];

  const byUri = keyBy(res, "uri");

  const records: Record[] = uris.map((uri) => {
    const row = byUri.get(uri);
    const json = row ? row.json : JSON.stringify(null);
    const createdAt = JSON.parse(json)?.["createdAt"]
      ? new Date(JSON.parse(json)?.["createdAt"]).toISOString()
      : undefined;
    const indexedAt = row?.indexedAt
      ? new Date(row.indexedAt).toISOString()
      : undefined;

    return {
      record: json,
      uri,
      cid: row?.cid,
      createdAt,
      indexedAt,
      sortedAt: compositeTime(createdAt, indexedAt),
      takenDown: !!row?.takedownRef,
      takedownRef: row?.takedownRef || undefined,
    };
  });

  return { records };
}

// Helper function to get post records with metadata
async function getPostRecords(
  db: Database,
  uris: string[],
): Promise<{
  records: Array<Record>;
}> {
  const [{ records }] = await Promise.all([
    getRecords(db, uris, ids.SoSprkFeedPost),
    uris.length
      ? db.models.Post.find({
        uri: { $in: uris },
      })
      : [],
  ]);

  return { records };
}

// Helper function for composite time
export function compositeTime(ts1?: string, ts2?: string): string | undefined {
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
      const result = await getRecords(this.db, uris, ids.SoSprkActorProfile);
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
