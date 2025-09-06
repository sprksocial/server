import { CID } from "multiformats/cid";
import * as ui8 from "npm:uint8arrays";
import { AtUri } from "@atproto/syntax";
import { lexicons } from "../lex/lexicons.ts";
import { jsonStringToLex } from "@atproto/api";

export type Record = {
  record: string;
  uri: string;
  cid?: CID;
  createdAt?: string;
  indexedAt?: string;
  takedownRef?: string | undefined;
  takenDown: boolean;
};

export class HydrationMap<T> extends Map<string, T | null> implements Merges {
  merge(map: HydrationMap<T>): this {
    map.forEach((val, key) => {
      this.set(key, val);
    });
    return this;
  }
}

export interface Merges {
  merge<T extends this>(map: T): this;
}

type UnknownRecord = { $type: string; [x: string]: unknown };

export type RecordInfo<T extends UnknownRecord> = {
  record: T;
  cid: string;
  createdAt: Date;
  indexedAt: Date;
  takedownRef: string | undefined;
};

export const mergeMaps = <V, M extends HydrationMap<V>>(
  mapA?: M,
  mapB?: M,
): M | undefined => {
  if (!mapA) return mapB;
  if (!mapB) return mapA;
  return mapA.merge(mapB);
};

export const mergeNestedMaps = <V, M extends HydrationMap<HydrationMap<V>>>(
  mapA?: M,
  mapB?: M,
): M | undefined => {
  if (!mapA) return mapB;
  if (!mapB) return mapA;

  for (const [key, map] of mapB) {
    const merged = mergeMaps(mapA.get(key) ?? undefined, map ?? undefined);
    mapA.set(key, merged ?? null);
  }

  return mapA;
};

export const mergeManyMaps = <T>(...maps: HydrationMap<T>[]) => {
  return maps.reduce(mergeMaps, undefined as HydrationMap<T> | undefined);
};

export type ItemRef = { uri: string; cid?: string };

export const parseRecord = <T extends UnknownRecord>(
  entry: Record,
  includeTakedowns: boolean,
): RecordInfo<T> | undefined => {
  if (!includeTakedowns && entry.takenDown) {
    return undefined;
  }
  const record = jsonStringToLex(entry.record);
  const cid = entry.cid;
  const createdAt = entry.createdAt ? new Date(entry.createdAt) : new Date(0);
  const indexedAt = entry.indexedAt ? new Date(entry.indexedAt) : new Date(0);
  if (!record || !cid) return;
  if (!isValidRecord(entry.record, entry.uri)) {
    return;
  }
  return {
    record,
    cid,
    createdAt,
    indexedAt,
    takedownRef: safeTakedownRef(entry),
  };
};

const isValidRecord = (record: string, uri: string) => {
  const aturi = new AtUri(uri);
  const recordObj = jsonStringToLex(record);
  try {
    lexicons.assertValidRecord(aturi.collection.toString(), recordObj);
    return true;
  } catch (err) {
    console.log(`Invalid record: ${err}`);
    return false;
  }
};

// @NOTE not parsed into lex format, so will not match lexicon record types on CID and blob values.
export const parseRecordBytes = <T>(
  bytes: Uint8Array | undefined,
): T | undefined => {
  return parseJsonBytes(bytes) as T;
};

export const parseJsonBytes = (bytes: Uint8Array | undefined): unknown => {
  if (!bytes || bytes.byteLength === 0) return;
  const parsed = JSON.parse(ui8.toString(bytes, "utf8"));
  return parsed ?? undefined;
};

export const parseString = (str: string | undefined): string | undefined => {
  return str && str.length > 0 ? str : undefined;
};

export const parseCid = (cidStr: string | undefined): CID | undefined => {
  if (!cidStr || cidStr.length === 0) return;
  try {
    return CID.parse(cidStr);
  } catch {
    return;
  }
};

export const urisByCollection = (uris: string[]): Map<string, string[]> => {
  const result = new Map<string, string[]>();
  for (const uri of uris) {
    const collection = new AtUri(uri).collection;
    const items = result.get(collection) ?? [];
    items.push(uri);
    result.set(collection, items);
  }
  return result;
};

export const split = <T>(
  items: T[],
  predicate: (item: T) => boolean,
): [T[], T[]] => {
  const yes: T[] = [];
  const no: T[] = [];
  for (const item of items) {
    if (predicate(item)) {
      yes.push(item);
    } else {
      no.push(item);
    }
  }
  return [yes, no];
};

export const safeTakedownRef = (obj?: {
  takenDown: boolean;
  takedownRef?: string | undefined;
}): string | undefined => {
  if (!obj) return;
  if (obj.takedownRef) return obj.takedownRef;
  if (obj.takenDown) return "BSKY-TAKEDOWN-UNKNOWN";
};

export const isActivitySubscriptionEnabled = ({
  post,
  reply,
}: {
  post: boolean;
  reply: boolean;
}): boolean => post || reply;
