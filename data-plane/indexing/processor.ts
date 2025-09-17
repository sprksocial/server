import { CID } from "multiformats/cid";
import { jsonStringToLex, stringifyLex } from "@atproto/lexicon";
import { AtUri } from "@atproto/syntax";
import { lexicons } from "../../lex/lexicons.ts";
import { BackgroundQueue } from "../background.ts";
import { Database } from "../db/index.ts";

// @NOTE re: insertions and deletions. Due to how record updates are handled,
// (insertFn) should have the same effect as (insertFn -> deleteFn -> insertFn).
type RecordProcessorParams<T, S> = {
  lexId: string;
  insertFn: (
    db: Database,
    uri: AtUri,
    cid: CID,
    obj: T,
    timestamp: string,
  ) => Promise<S | null>;
  findDuplicate: (
    db: Database,
    uri: AtUri,
    obj: T,
  ) => Promise<AtUri | null> | AtUri | null;
  deleteFn: (db: Database, uri: AtUri) => Promise<S | null>;
  notifsForInsert: (obj: S) => Notif[];
  notifsForDelete: (
    prev: S,
    replacedBy: S | null,
  ) => { notifs: Notif[]; toDelete: string[] };
  updateAggregates?: (db: Database, obj: S) => Promise<void>;
};

type Notif = {
  did: string;
  reason: string;
  author: string;
  recordUri: string;
  recordCid: string;
  sortAt: string;
  reasonSubject?: string;
};

export class RecordProcessor<T, S> {
  collection: string;
  db: Database;

  /**
   * RecordProcessor for handling a single AT Protocol collection.
   *
   * This processor handles exactly one lexId:
   * - Validates records against the specific lexId (e.g., "app.bsky.graph.follow")
   * - Only processes records that match the exact collection NSID
   * - Rejects records from other collections, even similar ones
   *
   * Example usage:
   * ```typescript
   * const processor = new RecordProcessor(db, background, {
   *   lexId: "app.bsky.graph.follow",
   *   // ... other params
   * });
   *
   * // This will only process records with collection "app.bsky.graph.follow"
   * await processor.insertRecord(uri, cid, obj, timestamp);
   * ```
   */
  constructor(
    private appDb: Database,
    private background: BackgroundQueue,
    private params: RecordProcessorParams<T, S>,
  ) {
    this.db = appDb;
    this.collection = this.params.lexId;
  }

  matchesCollection(uri: AtUri): boolean {
    return uri.collection === this.collection;
  }

  matchesSchema(obj: unknown): obj is T {
    try {
      lexicons.assertValidRecord(this.collection, obj);
      return true;
    } catch {
      return false;
    }
  }

  assertValidRecord(obj: unknown, uri: AtUri): asserts obj is T {
    if (!this.matchesCollection(uri)) {
      throw new Error(
        `Record collection mismatch: expected ${this.collection}, got ${uri.collection}`,
      );
    }
    try {
      lexicons.assertValidRecord(this.collection, obj);
    } catch (err) {
      throw new Error(
        `Record validation failed for collection: ${this.collection}. Error: ${err}`,
      );
    }
  }

  // Helper method to get the lexId this processor handles
  getLexId(): string {
    return this.collection;
  }

  async insertRecord(
    uri: AtUri,
    cid: CID,
    obj: unknown,
    timestamp: string,
    opts?: { disableNotifs?: boolean },
  ) {
    this.assertValidRecord(obj, uri);

    // Insert or update record
    await this.db.models.Record.findOneAndUpdate(
      { uri: uri.toString() },
      {
        uri: uri.toString(),
        cid: cid.toString(),
        did: uri.host,
        collectionName: uri.collection,
        rkey: uri.rkey,
        json: stringifyLex(obj),
        indexedAt: timestamp,
      },
      { upsert: true, new: true },
    );

    const inserted = await this.params.insertFn(
      this.db,
      uri,
      cid,
      obj,
      timestamp,
    );
    if (inserted) {
      this.aggregateOnCommit(inserted);
      if (!opts?.disableNotifs) {
        this.handleNotifs({ inserted });
      }
      return;
    }
    // if duplicate, insert into duplicates table with no events
    const found = await this.params.findDuplicate(this.db, uri, obj);
    if (found && found.toString() !== uri.toString()) {
      await this.db.models.DuplicateRecord.findOneAndUpdate(
        { uri: uri.toString() },
        {
          uri: uri.toString(),
          cid: cid.toString(),
          duplicateOf: found.toString(),
          indexedAt: timestamp,
        },
        { upsert: true, new: true },
      );
    }
  }

  // Currently using a very simple strategy for updates: purge the existing index
  // for the uri then replace it. The main upside is that this allows the indexer
  // for each collection to avoid bespoke logic for in-place updates, which isn't
  // straightforward in the general case. We still get nice control over notifications.
  async updateRecord(
    uri: AtUri,
    cid: CID,
    obj: unknown,
    timestamp: string,
    opts?: { disableNotifs?: boolean },
  ) {
    this.assertValidRecord(obj, uri);

    // Update record
    await this.db.models.Record.findOneAndUpdate(
      { uri: uri.toString() },
      {
        cid: cid.toString(),
        json: stringifyLex(obj),
        indexedAt: timestamp,
      },
      { new: true },
    );

    // If the updated record was a dupe, update dupe info for it
    const dupe = await this.params.findDuplicate(this.db, uri, obj);
    if (dupe) {
      await this.db.models.DuplicateRecord.findOneAndUpdate(
        { uri: uri.toString() },
        {
          cid: cid.toString(),
          duplicateOf: dupe.toString(),
          indexedAt: timestamp,
        },
        { upsert: true, new: true },
      );
    } else {
      await this.db.models.DuplicateRecord.deleteOne({ uri: uri.toString() });
    }

    const deleted = await this.params.deleteFn(this.db, uri);
    if (!deleted) {
      // If a record was updated but hadn't been indexed yet, treat it like a plain insert.
      return this.insertRecord(uri, cid, obj, timestamp);
    }
    this.aggregateOnCommit(deleted);
    const inserted = await this.params.insertFn(
      this.db,
      uri,
      cid,
      obj,
      timestamp,
    );
    if (!inserted) {
      throw new Error(
        "Record update failed: removed from index but could not be replaced",
      );
    }
    this.aggregateOnCommit(inserted);
    if (!opts?.disableNotifs) {
      this.handleNotifs({ inserted, deleted });
    }
  }

  async deleteRecord(uri: AtUri, cascading = false) {
    await this.db.models.Record.deleteOne({ uri: uri.toString() });
    await this.db.models.DuplicateRecord.deleteOne({ uri: uri.toString() });

    const deleted = await this.params.deleteFn(this.db, uri);
    if (!deleted) return;

    this.aggregateOnCommit(deleted);
    if (cascading) {
      await this.db.models.DuplicateRecord.deleteMany({
        duplicateOf: uri.toString(),
      });
      return this.handleNotifs({ deleted });
    } else {
      const found = await this.db.models.DuplicateRecord.findOne({
        duplicateOf: uri.toString(),
      })
        .sort({ indexedAt: 1 })
        .lean();

      if (!found) {
        return this.handleNotifs({ deleted });
      }

      // Get the actual record from the Record model
      const recordDoc = await this.db.models.Record.findOne({ uri: found.uri })
        .lean();
      if (!recordDoc || !recordDoc.json) {
        return this.handleNotifs({ deleted });
      }

      const foundUri = new AtUri(found.uri);
      if (!this.matchesCollection(foundUri)) {
        return this.handleNotifs({ deleted });
      }

      const record = jsonStringToLex(recordDoc.json);
      if (!this.matchesSchema(record)) {
        return this.handleNotifs({ deleted });
      }

      const inserted = await this.params.insertFn(
        this.db,
        foundUri,
        CID.parse(found.cid),
        record,
        found.indexedAt,
      );
      if (inserted) {
        this.aggregateOnCommit(inserted);
      }
      this.handleNotifs({ deleted, inserted: inserted ?? undefined });
    }
  }

  handleNotifs(op: { deleted?: S; inserted?: S }) {
    let _notifs: Notif[] = [];
    if (op.deleted) {
      const forDelete = this.params.notifsForDelete(
        op.deleted,
        op.inserted ?? null,
      );
      _notifs = forDelete.notifs;
    } else if (op.inserted) {
      _notifs = this.params.notifsForInsert(op.inserted);
    }

    // TODO: Implement notification handling
  }

  aggregateOnCommit(indexed: S) {
    const { updateAggregates } = this.params;
    if (!updateAggregates) return;
    // Note: MongoDB doesn't have transactions in the same way, so we'll run aggregates immediately
    // In a production system, you might want to use MongoDB transactions or a different approach
    this.background.add((db) => updateAggregates(db, indexed));
  }
}

export default RecordProcessor;
