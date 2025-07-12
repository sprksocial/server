import { CID } from "multiformats/cid";
import { jsonStringToLex, stringifyLex } from "@atproto/lexicon";
import { AtUri } from "@atproto/syntax";
import { lexicons } from "../../../lexicon/lexicons.ts";
import { BackgroundQueue } from "../background.ts";
import { Database } from "../index.ts";

// @NOTE re: insertions and deletions. Due to how record updates are handled,
// (insertFn) should have the same effect as (insertFn -> deleteFn -> insertFn).
type RecordProcessorParams<T, S> = {
  lexIds: string[];
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
  collections: string[];
  db: Database;

  /**
   * RecordProcessor with enhanced multi-collection validation support.
   *
   * This processor can handle multiple lexIds and will:
   * 1. Try to validate against the collection-specific lexId first (e.g., "follow" for "app.bsky.graph.follow")
   * 2. Fall back to the first lexId if no collection-specific match is found
   * 3. If validation fails and multiple lexIds are available, try all lexIds as fallbacks
   * 4. Provide helpful error messages when validation fails
   *
   * Example usage:
   * ```typescript
   * const processor = new RecordProcessor(db, background, {
   *   lexIds: ["app.bsky.graph.follow", "app.bsky.graph.block"],
   *   // ... other params
   * });
   *
   * // This will validate against "app.bsky.graph.follow" for "follow" collection
   * await processor.insertRecord(uri, cid, obj, timestamp);
   * ```
   */
  constructor(
    private appDb: Database,
    private background: BackgroundQueue,
    private params: RecordProcessorParams<T, S>,
  ) {
    this.db = appDb;
    this.collections = this.params.lexIds;
  }

  matchesSchema(obj: unknown, collection?: string): obj is T {
    let lexId: string | undefined;

    if (collection) {
      lexId = this.getLexIdForCollection(collection);
    }

    // If no collection-specific lexId found, use the first one
    if (!lexId) {
      lexId = this.params.lexIds[0];
    }

    // Try the primary lexId first
    try {
      lexicons.assertValidRecord(lexId, obj);
      return true;
    } catch {
      // If collection-specific validation failed and we have multiple lexIds, try others
      if (collection && this.params.lexIds.length > 1) {
        for (const fallbackLexId of this.params.lexIds) {
          if (fallbackLexId === lexId) continue; // Skip the one we already tried
          try {
            lexicons.assertValidRecord(fallbackLexId, obj);
            return true;
          } catch {
            // Continue to next lexId
          }
        }
      }
      return false;
    }
  }

  assertValidRecord(obj: unknown, collection?: string): asserts obj is T {
    let lexId: string | undefined;

    if (collection) {
      lexId = this.getLexIdForCollection(collection);
    }

    // If no collection-specific lexId found, or if validation fails, try all lexIds
    if (!lexId) {
      lexId = this.params.lexIds[0];
    }

    // Try the primary lexId first
    try {
      lexicons.assertValidRecord(lexId, obj);
      return;
    } catch {
      // If collection-specific validation failed and we have multiple lexIds, try others
      if (collection && this.params.lexIds.length > 1) {
        for (const fallbackLexId of this.params.lexIds) {
          if (fallbackLexId === lexId) continue; // Skip the one we already tried
          try {
            lexicons.assertValidRecord(fallbackLexId, obj);
            return;
          } catch {
            // Continue to next lexId
          }
        }
      }
      // If we get here, none of the lexIds worked
      throw new Error(
        `Record validation failed for collection: ${
          collection || "unknown"
        }. Tried lexIds: ${this.params.lexIds.join(", ")}`,
      );
    }
  }

  // Helper method to get the appropriate lexid for a collection
  private getLexIdForCollection(collection: string): string | undefined {
    return this.params.lexIds.find((lexId) => {
      // Extract collection from lexid (e.g., "follow" from "app.bsky.graph.follow")
      const lexIdParts = lexId.split(".");
      const lexIdCollection = lexIdParts[lexIdParts.length - 1]; // Get the last part as collection name
      return lexIdCollection === collection;
    });
  }

  // Helper method to get all available lexIds for debugging
  getAvailableLexIds(): string[] {
    return [...this.params.lexIds];
  }

  // Helper method to get available collections from lexIds
  getAvailableCollections(): string[] {
    return this.params.lexIds.map((lexId) => {
      const lexIdParts = lexId.split(".");
      return lexIdParts[lexIdParts.length - 1];
    });
  }

  async insertRecord(
    uri: AtUri,
    cid: CID,
    obj: unknown,
    timestamp: string,
    opts?: { disableNotifs?: boolean },
  ) {
    this.assertValidRecord(obj, uri.collection);

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
    this.assertValidRecord(obj, uri.collection);

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
      await this.handleNotifs({ inserted, deleted });
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

      const record = jsonStringToLex(recordDoc.json);
      if (!this.matchesSchema(record, new AtUri(found.uri).collection)) {
        return this.handleNotifs({ deleted });
      }

      const inserted = await this.params.insertFn(
        this.db,
        new AtUri(found.uri),
        CID.parse(found.cid),
        record,
        found.indexedAt,
      );
      if (inserted) {
        this.aggregateOnCommit(inserted);
      }
      await this.handleNotifs({ deleted, inserted: inserted ?? undefined });
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
