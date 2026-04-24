import { Cid, l, lexParse, lexStringify } from "@atp/lex";
import { parseCid } from "@atp/lex/data";
import { AtUri } from "@atp/syntax";
import { BackgroundQueue } from "../background.ts";
import { Database } from "../db/index.ts";
import { chunkArray } from "@atp/common";
import { PushService } from "../../utils/push.ts";

// @NOTE re: insertions and deletions. Due to how record updates are handled,
// (insertFn) should have the same effect as (insertFn -> deleteFn -> insertFn).
type RecordProcessorOptions<TSchema extends l.RecordSchema, TRow> = {
  schema: TSchema;
  insertFn: (
    db: Database,
    uri: AtUri,
    cid: Cid,
    obj: l.Infer<TSchema>,
    timestamp: string,
  ) => Promise<TRow | null>;
  findDuplicate: (
    db: Database,
    uri: AtUri,
    obj: l.Infer<TSchema>,
  ) => Promise<AtUri | null> | AtUri | null;
  deleteFn: (db: Database, uri: AtUri) => Promise<TRow | null>;
  notifsForInsert: (obj: TRow) => Notif[];
  notifsForDelete: (
    prev: TRow,
    replacedBy: TRow | null,
  ) => { notifs: Notif[]; toDelete: string[] };
  updateAggregates?: (db: Database, obj: TRow) => Promise<void>;
  deleteRecordIfInsertReturnsNull?: boolean;
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

export class RecordProcessor<TSchema extends l.RecordSchema, TRow> {
  db: Database;
  private pushService: PushService | null = null;

  /**
   * RecordProcessor for handling a single AT Protocol collection.
   *
   * This processor handles exactly one generated record schema:
   * - Validates records against the specific schema (e.g., so.sprk.graph.follow)
   * - Only processes records that match the exact collection NSID
   * - Rejects records from other collections, even similar ones
   *
   * Example usage:
   * ```typescript
   * const processor = new RecordProcessor(db, background, {
   *   schema: so.sprk.graph.follow.main,
   *   // ... other params
   * });
   *
   * // This will only process records with collection "so.sprk.graph.follow"
   * await processor.insertRecord(uri, cid, obj, timestamp);
   * ```
   */
  constructor(
    private appDb: Database,
    private background: BackgroundQueue,
    private options: RecordProcessorOptions<TSchema, TRow>,
  ) {
    this.db = appDb;
  }

  get collection(): TSchema["$type"] {
    return this.options.schema.$type;
  }

  setPushService(pushService: PushService) {
    this.pushService = pushService;
  }

  matchesCollection(uri: AtUri): boolean {
    return uri.collection === this.collection;
  }

  matchesSchema<I>(obj: I): obj is I & l.Infer<TSchema> {
    return this.options.schema.matches(obj);
  }

  assertValidRecord(obj: unknown): asserts obj is l.Infer<TSchema> {
    this.options.schema.assert(obj);
  }

  // Helper method to get the collection this processor handles
  getLexId(): TSchema["$type"] {
    return this.collection;
  }

  async insertRecord(
    uri: AtUri,
    cid: Cid,
    obj: unknown,
    timestamp: string,
    opts?: { disableNotifs?: boolean },
  ) {
    this.assertValidRecord(obj);

    // Extract createdAt from the record object if available
    const recordObj = obj as Record<string, unknown>;
    const createdAt = typeof recordObj.createdAt === "string"
      ? recordObj.createdAt
      : timestamp;

    // Check for duplicates first before attempting insert
    const found = await this.options.findDuplicate(this.db, uri, obj);
    if (found && found.toString() !== uri.toString()) {
      // Duplicate exists with different URI, store in duplicates table with no events
      await this.db.models.DuplicateRecord.findOneAndUpdate(
        { uri: uri.toString() },
        {
          uri: uri.toString(),
          cid: cid.toString(),
          duplicateOf: found.toString(),
          indexedAt: timestamp,
        },
        { upsert: true, returnDocument: "after" },
      );
      return;
    }

    // Insert or update record
    await this.db.models.Record.findOneAndUpdate(
      { uri: uri.toString() },
      {
        uri: uri.toString(),
        cid: cid.toString(),
        did: uri.host,
        collectionName: uri.collection,
        rkey: uri.rkey,
        json: lexStringify(obj),
        createdAt,
        indexedAt: timestamp,
      },
      { upsert: true, returnDocument: "after" },
    );

    const inserted = await this.options.insertFn(
      this.db,
      uri,
      cid,
      obj,
      timestamp,
    );
    if (!inserted) {
      if (this.options.deleteRecordIfInsertReturnsNull) {
        await this.db.models.Record.deleteOne({ uri: uri.toString() });
        await this.db.models.DuplicateRecord.deleteOne({
          uri: uri.toString(),
        });
      }
      return;
    }

    this.aggregateOnCommit(inserted);
    if (!opts?.disableNotifs) {
      await this.handleNotifs({ inserted });
    }
  }

  // Currently using a very simple strategy for updates: purge the existing index
  // for the uri then replace it. The main upside is that this allows the indexer
  // for each collection to avoid bespoke logic for in-place updates, which isn't
  // straightforward in the general case. We still get nice control over notifications.
  async updateRecord(
    uri: AtUri,
    cid: Cid,
    obj: unknown,
    timestamp: string,
    opts?: { disableNotifs?: boolean },
  ) {
    this.assertValidRecord(obj);

    // Extract createdAt from the record object if available
    const recordObj = obj as Record<string, unknown>;
    const createdAt = typeof recordObj.createdAt === "string"
      ? recordObj.createdAt
      : undefined;

    // Update record
    const updateData: {
      cid: string;
      json: string;
      indexedAt: string;
      createdAt?: string;
    } = {
      cid: cid.toString(),
      json: lexStringify(obj),
      indexedAt: timestamp,
    };
    if (createdAt) {
      updateData.createdAt = createdAt;
    }

    await this.db.models.Record.findOneAndUpdate(
      { uri: uri.toString() },
      updateData,
      { returnDocument: "after" },
    );

    // If the updated record was a dupe, update dupe info for it
    const dupe = await this.options.findDuplicate(this.db, uri, obj);
    if (dupe) {
      await this.db.models.DuplicateRecord.findOneAndUpdate(
        { uri: uri.toString() },
        {
          cid: cid.toString(),
          duplicateOf: dupe.toString(),
          indexedAt: timestamp,
        },
        { upsert: true, returnDocument: "after" },
      );
    } else {
      await this.db.models.DuplicateRecord.deleteOne({ uri: uri.toString() });
    }

    const deleted = await this.options.deleteFn(this.db, uri);
    if (!deleted) {
      // If a record was updated but hadn't been indexed yet, treat it like a plain insert.
      return this.insertRecord(uri, cid, obj, timestamp);
    }
    this.aggregateOnCommit(deleted);
    const inserted = await this.options.insertFn(
      this.db,
      uri,
      cid,
      obj,
      timestamp,
    );
    if (!inserted) {
      if (this.options.deleteRecordIfInsertReturnsNull) {
        await this.db.models.Record.deleteOne({ uri: uri.toString() });
        await this.db.models.DuplicateRecord.deleteOne({
          uri: uri.toString(),
        });
        if (!opts?.disableNotifs) {
          await this.handleNotifs({ deleted });
        }
        return;
      }
      throw new Error(
        "Record update failed: removed from index but could not be replaced",
      );
    }
    this.aggregateOnCommit(inserted);
    if (!opts?.disableNotifs) {
      await this.handleNotifs({ inserted, deleted });
    }
  }

  async deleteRecord(uri: AtUri, cascading = false) {
    const uriStr = uri.toString();

    await this.db.models.Record.deleteOne({ uri: uriStr });
    await this.db.models.DuplicateRecord.deleteOne({ uri: uriStr });

    const deleted = await this.options.deleteFn(this.db, uri);
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

      let record: unknown;
      try {
        record = lexParse(recordDoc.json, { strict: false });
      } catch {
        return this.handleNotifs({ deleted });
      }
      if (!this.matchesSchema(record)) {
        return this.handleNotifs({ deleted });
      }

      const inserted = await this.options.insertFn(
        this.db,
        foundUri,
        parseCid(found.cid),
        record,
        found.indexedAt,
      );
      if (inserted) {
        this.aggregateOnCommit(inserted);
      }
      await this.handleNotifs({ deleted, inserted: inserted ?? undefined });
    }
  }

  async handleNotifs(op: { deleted?: TRow; inserted?: TRow }) {
    let notifs: Notif[] = [];
    const runOnCommit: ((db: Database) => Promise<void>)[] = [];
    if (op.deleted) {
      const forDelete = this.options.notifsForDelete(
        op.deleted,
        op.inserted ?? null,
      );
      if (forDelete.toDelete.length > 0) {
        // Notifs can be deleted in background: they are expensive to delete and
        // listNotifications already excludes notifs with missing records.
        runOnCommit.push(async (db) => {
          await db.models.Notification.deleteMany({
            recordUri: { $in: forDelete.toDelete },
          });
        });
      }
      notifs = forDelete.notifs;
    } else if (op.inserted) {
      notifs = this.options.notifsForInsert(op.inserted);
    }
    for (const chunk of chunkArray(notifs, 500)) {
      runOnCommit.push(async (db) => {
        const filtered = await this.filterNotifsForThreadMutes(chunk);
        if (filtered.length > 0) {
          await db.models.Notification.insertMany(
            filtered.map((n) => ({
              did: n.did,
              recordUri: n.recordUri,
              recordCid: n.recordCid,
              author: n.author,
              reason: n.reason,
              reasonSubject: n.reasonSubject ?? null,
              sortAt: n.sortAt,
            })),
          );
        }
      });
    }
    // Need to ensure notif deletion always happens before creation, otherwise delete may clobber in a race.
    for (const fn of runOnCommit) {
      await fn(this.appDb); // these could be backgrounded
    }

    // Queue push notifications in the background
    if (this.pushService?.enabled && notifs.length > 0) {
      for (const notif of notifs) {
        this.background.add(async () => {
          await this.pushService?.sendPush(notif.did, {
            recipientDid: notif.did,
            reason: notif.reason,
            author: notif.author,
            recordUri: notif.recordUri,
            reasonSubject: notif.reasonSubject,
          });
        });
      }
    }
  }

  // Filter notifications for thread mutes (placeholder for future implementation)
  filterNotifsForThreadMutes(notifs: Notif[]): Promise<Notif[]> {
    // TODO: Implement thread mute filtering
    // For now, return all notifications unfiltered
    return Promise.resolve(notifs);
  }

  aggregateOnCommit(indexed: TRow) {
    const { updateAggregates } = this.options;
    if (!updateAggregates) return;
    // Note: MongoDB doesn't have transactions in the same way, so we'll run aggregates immediately
    // In a production system, you might want to use MongoDB transactions or a different approach
    this.background.add((db) => updateAggregates(db, indexed));
  }
}

export default RecordProcessor;
