import { AtUri } from "@atproto/syntax";
import { CID } from "multiformats/cid";
import { Document } from "mongoose";
import { BidirectionalResolver } from "../utils/id-resolver.ts";
import { Database } from "../services/data-plane/server/index.ts";
import { pino } from "pino";
import * as Post from "./plugins/post.ts";
import * as BskyFollow from "./plugins/bskyFollow.ts";
import { Agent } from "@atproto/api";
import { ActorDocument } from "../services/data-plane/server/index.ts";

// Generic type for model processors
type RecordProcessor = {
  collection: string;
  insertRecord: (
    uri: AtUri,
    cid: CID,
    record: unknown,
    timestamp: string,
    opts?: { disableNotifs?: boolean },
  ) => Promise<Document | null>;
  updateRecord: (
    uri: AtUri,
    cid: CID,
    record: unknown,
    timestamp: string,
  ) => Promise<Document | null>;
  deleteRecord: (uri: AtUri, cascading?: boolean) => Promise<void>;
};

/**
 * Service to handle indexing of records from the Atproto network
 */
export class IndexingService {
  private records: Record<string, RecordProcessor> = {};
  private logger = pino({
    name: "indexing-service",
    level: Deno.env.get("NODE_ENV") === "development" ? "debug" : "info",
  });

  constructor(
    private db: Database,
    private resolver: BidirectionalResolver,
  ) {
    // Register record processors
    this.records.post = Post.makePlugin(db);
    this.records.bskyFollow = BskyFollow.makePlugin(db);

    // Additional plugins would be registered here
    // Example:
    // this.records.like = Like.makePlugin(db)
    // this.records.follow = Follow.makePlugin(db)
    // etc.
  }

  /**
   * Index a record in the database
   *
   * @param uri The URI of the record
   * @param cid The CID of the record
   * @param obj The record data
   * @param action The action type (create/update)
   * @param timestamp The timestamp of the operation
   * @param opts Optional parameters
   */
  async indexRecord(
    uri: AtUri,
    cid: CID,
    obj: unknown,
    action: "create" | "update",
    timestamp: string,
    opts?: { disableNotifs?: boolean },
  ): Promise<void> {
    try {
      const indexer = this.findIndexerForCollection(uri.collection);
      if (!indexer) {
        this.logger.debug(
          { collection: uri.collection },
          "No indexer found for collection",
        );
        return;
      }

      if (action === "create") {
        await indexer.insertRecord(uri, cid, obj, timestamp, opts);
      } else {
        await indexer.updateRecord(uri, cid, obj, timestamp);
      }
    } catch (error) {
      this.logger.error(
        { error, uri: uri.toString(), cid: cid.toString(), action },
        "Error indexing record",
      );
    }
  }

  /**
   * Delete a record from the database
   *
   * @param uri The URI of the record to delete
   * @param cascading Whether to cascade the deletion to related records
   */
  async deleteRecord(uri: AtUri, cascading = false): Promise<void> {
    try {
      const indexer = this.findIndexerForCollection(uri.collection);
      if (!indexer) {
        this.logger.debug(
          { collection: uri.collection },
          "No indexer found for collection",
        );
        return;
      }

      await indexer.deleteRecord(uri, cascading);
    } catch (error) {
      this.logger.error(
        { error, uri: uri.toString() },
        "Error deleting record",
      );
    }
  }

  /**
   * Index or update actor handle information
   *
   * @param did The DID of the actor
   * @param timestamp The timestamp of the operation
   * @param force Force reindexing even if recently indexed
   */
  async indexHandle(
    did: string,
    timestamp: string,
    force = false,
  ): Promise<void> {
    try {
      // Find existing actor
      const actor = await this.db.models.Actor.findOne({ did });

      // Skip if recently indexed and not forced
      if (!force && actor && this.isHandleRecentlyIndexed(actor, timestamp)) {
        return;
      }

      // Resolve DID to handle
      const didDoc = await this.resolver.resolveDidToDidDoc(did);

      // Verify handle ownership
      let handle: string | undefined = undefined;
      if (didDoc.handle) {
        const handleDidDoc = await this.resolver.resolveHandleToDidDoc(
          didDoc.handle,
        );
        handle = did === handleDidDoc.did
          ? didDoc.handle.toLowerCase()
          : undefined;
      }

      // Handle conflict resolution - if another actor has this handle
      if (handle) {
        const actorWithHandle = await this.db.models.Actor.findOne({ handle });
        if (actorWithHandle && actorWithHandle.did !== did) {
          // Clear handle from the other actor
          await this.db.models.Actor.updateOne(
            { did: actorWithHandle.did },
            { $set: { handle: null } },
          );
        }
      }

      await this.db.models.Actor.updateOne(
        { did },
        {
          $set: {
            handle,
            indexedAt: timestamp,
          },
        },
        { upsert: true },
      );
    } catch (error) {
      this.logger.error({ error, did }, "Error indexing handle");
    }
  }

  /**
   * Index all Bsky follows for a given user when they switch to bsky mode.
   *
   * @param did The DID of the user to index follows for
   */
  async indexBSkyFollows(did: string): Promise<void> {
    try {
      const timestamp = new Date().toISOString();

      // Resolve the user's PDS endpoint from their DID document
      const didData = await this.resolver.resolveDidToDidDoc(did);

      // Validate that PDS endpoint exists and is a valid URL
      if (!didData.pds) {
        this.logger.warn({ did }, "No PDS endpoint found in DID document");
        return;
      }

      let pdsUrl: URL;
      try {
        pdsUrl = new URL(didData.pds);
      } catch (urlError) {
        this.logger.error(
          { did, pds: didData.pds, error: urlError },
          "Invalid PDS URL in DID document",
        );
        return;
      }

      const agent = new Agent(pdsUrl);

      // Debug: starting follow indexing
      this.logger.debug({ did, pds: didData.pds }, "Starting indexBSkyFollows");

      const collection = "app.bsky.graph.follow";
      let cursor: string | undefined = undefined;

      do {
        this.logger.debug({ cursor }, "Listing bsky follow records");
        const res = await agent.com.atproto.repo.listRecords({
          repo: did,
          collection,
          limit: 100,
          cursor,
        });
        const { records, cursor: nextCursor } = res.data;
        this.logger.debug(
          { count: records.length, nextCursor },
          "Fetched bsky follow records page",
        );
        for (const rec of records) {
          this.logger.debug(
            { uri: rec.uri, cid: rec.cid },
            "Indexing bsky follow record",
          );

          const uri = new AtUri(rec.uri);
          const cid = CID.parse(rec.cid);
          await this.indexRecord(uri, cid, rec.value, "create", timestamp);
        }
        cursor = nextCursor;
      } while (cursor);
    } catch (error) {
      this.logger.error(
        { error, did },
        "Error indexing BSky follows",
      );
    }
  }

  /**
   * Find the indexer responsible for a collection
   *
   * @param collection The collection to find an indexer for
   * @returns The indexer or undefined if not found
   */
  findIndexerForCollection(
    collection: string,
  ): RecordProcessor | undefined {
    return Object.values(this.records).find(
      (indexer) => indexer.collection === collection,
    );
  }

  /**
   * Check if an actor's handle was recently indexed
   *
   * @param actor The actor document
   * @param timestamp Current timestamp
   * @returns Whether the actor was recently indexed
   */
  private isHandleRecentlyIndexed(
    actor: ActorDocument,
    timestamp: string,
  ): boolean {
    if (!actor.indexedAt) return false;

    const timeDiff = new Date(timestamp).getTime() -
      new Date(actor.indexedAt).getTime();
    const ONE_DAY = 24 * 60 * 60 * 1000;
    const ONE_HOUR = 60 * 60 * 1000;

    // Reindex daily for all actors
    if (timeDiff > ONE_DAY) return false;

    // Reindex more frequently for actors without handles
    if (actor.handle === null && timeDiff > ONE_HOUR) return false;

    return true;
  }
}
