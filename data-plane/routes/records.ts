import { Database } from "../db/index.ts";
import { AtUri } from "@atp/syntax";
import { ids } from "../../lex/lexicons.ts";
import { keyBy } from "@atp/common";
import { Code, compositeTime, DataPlaneError } from "../util.ts";

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
  collection?: string,
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

export async function getArchivedRecords(
  db: Database,
  uris: string[],
  collection?: string,
): Promise<{
  records: Array<Record>;
}> {
  const validUris = collection
    ? uris.filter((uri) => new AtUri(uri).collection === collection)
    : uris;

  const res = validUris.length
    ? await db.models.ArchivedRecord.find({
      uri: { $in: validUris },
    })
    : [];

  const byUri = keyBy(res, "uri");

  const records: Record[] = uris.map((uri) => {
    const row = byUri.get(uri);
    const createdAt = row?.createdAt
      ? new Date(row.createdAt).toISOString()
      : undefined;
    const indexedAt = row?.indexedAt
      ? new Date(row.indexedAt).toISOString()
      : undefined;

    return {
      record: row?.json ?? JSON.stringify(null),
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

// Helper function to get reply records with metadata
async function getReplyRecords(
  db: Database,
  uris: string[],
): Promise<{
  records: Array<Record>;
}> {
  const [{ records }] = await Promise.all([
    getRecords(db, uris, ids.SoSprkFeedReply),
    uris.length
      ? db.models.Reply.find({
        uri: { $in: uris },
      })
      : [],
  ]);

  return { records };
}

export class Records {
  private db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  async getBlockRecords(uris: string[]) {
    const result = await getRecords(this.db, uris, ids.SoSprkGraphBlock);
    return result;
  }

  async getFeedGeneratorRecords(uris: string[]) {
    try {
      const result = await getRecords(this.db, uris, ids.SoSprkFeedGenerator);
      return result;
    } catch (error) {
      console.error("Error fetching feed generator records:", error);
      throw new DataPlaneError(Code.InternalError);
    }
  }

  async getFollowRecords(uris: string[]) {
    const result = await getRecords(this.db, uris, ids.SoSprkGraphFollow);
    return result;
  }

  async getLikeRecords(uris: string[]) {
    const result = await getRecords(this.db, uris, ids.SoSprkFeedLike);
    return result;
  }

  async getPostRecords(uris: string[]) {
    const result = await getPostRecords(this.db, uris);
    return result;
  }

  async getReplyRecords(uris: string[]) {
    const result = await getReplyRecords(this.db, uris);
    return result;
  }

  async getProfileRecords(uris: string[]) {
    const result = await getRecords(this.db, uris, ids.SoSprkActorProfile);
    return result;
  }

  async getRepostRecords(uris: string[]) {
    const result = await getRecords(this.db, uris, ids.SoSprkFeedRepost);
    return result;
  }

  async getRecords(uris: string[]) {
    const result = await getRecords(this.db, uris);
    return result;
  }

  async getStoryRecords(uris: string[]) {
    const result = await getRecords(this.db, uris, ids.SoSprkStoryPost);
    return result;
  }

  async getArchivedStoryRecords(uris: string[]) {
    const result = await getArchivedRecords(this.db, uris, ids.SoSprkStoryPost);
    return result;
  }
}
