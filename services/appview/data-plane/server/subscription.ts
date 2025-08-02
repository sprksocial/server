import { IdResolver } from "@atproto/identity";
import { WriteOpAction } from "@atproto/repo";
import { Event as FirehoseEvent, Firehose, MemoryRunner } from "@atproto/sync";
import { BackgroundQueue } from "./background.ts";
import { Database } from "./index.ts";
import { IndexingService } from "./indexing/index.ts";
import pino from "pino";

export class RepoSubscription {
  firehose: Firehose;
  runner: MemoryRunner;
  background: BackgroundQueue;
  indexingSvc: IndexingService;

  constructor(
    public opts: { service: string; db: Database; idResolver: IdResolver },
  ) {
    const { service, db, idResolver } = opts;
    this.background = new BackgroundQueue(db);
    this.indexingSvc = new IndexingService(db, idResolver, this.background);

    const { runner, firehose } = createFirehose({
      idResolver,
      service,
      indexingSvc: this.indexingSvc,
      logger: this.opts.db.logger,
    });
    this.runner = runner;
    this.firehose = firehose;
  }

  start() {
    console.log("Starting firehose subscription");
    this.firehose.start();
  }

  async restart() {
    await this.destroy();
    const { runner, firehose } = createFirehose({
      idResolver: this.opts.idResolver,
      service: this.opts.service,
      indexingSvc: this.indexingSvc,
      logger: this.opts.db.logger,
    });
    this.runner = runner;
    this.firehose = firehose;
    this.start();
  }

  async processAll() {
    await this.runner.processAll();
    await this.background.processAll();
  }

  async destroy() {
    await this.firehose.destroy();
    await this.runner.destroy();
    await this.background.processAll();
  }
}

const createFirehose = (opts: {
  idResolver: IdResolver;
  service: string;
  indexingSvc: IndexingService;
  logger: pino.Logger;
}) => {
  const { idResolver, service, indexingSvc, logger } = opts;
  const runner = new MemoryRunner({ startCursor: 0 });
  const firehose = new Firehose({
    idResolver,
    service,
    excludeIdentity: true,
    excludeAccount: true,
    excludeSync: true,
    maxReconnectDelayMs: 30000, // 30 second max delay between reconnects
    reconnectDelayMs: 1000, // Start with 1 second delay
    maxReconnectAttempts: -1, // Infinite reconnect attempts
    onError: (err: Error) => {
      // Handle network errors more gracefully
      if (
        err.message?.includes("peer closed connection") ||
        err.message?.includes("TLS close_notify") ||
        err.message?.includes("connection error") ||
        err.message?.includes("ECONNRESET") ||
        err.message?.includes("ENOTFOUND")
      ) {
        logger.warn(
          { err: err.message },
          "Network error in firehose - will retry",
        );
      } else {
        logger.error({ err }, "error in subscription");
      }
    },
    handleEvent: async (evt: FirehoseEvent) => {
      try {
        if (evt.event === "identity") {
          await indexingSvc.indexHandle(evt.did, evt.time, true);
        } else if (evt.event === "account") {
          if (evt.active === false && evt.status === "deleted") {
            await indexingSvc.deleteActor(evt.did);
          } else {
            await indexingSvc.updateActorStatus(
              evt.did,
              evt.active,
              evt.status,
            );
          }
        } else if (evt.event === "sync") {
          await Promise.all([
            indexingSvc.setCommitLastSeen(evt.did, evt.cid, evt.rev),
            indexingSvc.indexHandle(evt.did, evt.time),
          ]);
        } else {
          const indexFn = evt.event === "delete"
            ? indexingSvc.deleteRecord(evt.uri)
            : indexingSvc.indexRecord(
              evt.uri,
              evt.cid,
              evt.record,
              evt.event === "create"
                ? WriteOpAction.Create
                : WriteOpAction.Update,
              evt.time,
            );
          await Promise.all([
            indexFn,
            indexingSvc.setCommitLastSeen(evt.did, evt.commit, evt.rev),
            indexingSvc.indexHandle(evt.did, evt.time),
          ]);
        }
      } catch (err) {
        // Log the error but don't re-throw to prevent firehose from crashing
        const mongoError = err as { code?: number; message?: string };
        const error = err as Error;

        // Handle MongoDB duplicate key errors specifically
        if (mongoError.code === 11000) {
          logger.warn(
            {
              err: mongoError.message,
              event: evt.event,
              did: evt.did,
              uri: "uri" in evt ? evt.uri?.toString() : undefined,
              collection: "uri" in evt ? evt.uri?.collection : undefined,
            },
            "Duplicate key error - record may have been processed concurrently",
          );
          return; // Silently skip duplicate key errors
        }

        // Handle network/connectivity errors from PLC directory and other external services
        if (
          error.message?.includes("peer closed connection") ||
          error.message?.includes("TLS close_notify") ||
          error.message?.includes("connection error") ||
          error.message?.includes("SendRequest") ||
          error.message?.includes("plc.directory") ||
          error.name === "FirehoseParseError"
        ) {
          logger.warn(
            {
              err: error.message,
              event: evt.event,
              did: evt.did,
              uri: "uri" in evt ? evt.uri?.toString() : undefined,
            },
            "Network connectivity error - skipping event",
          );
          return; // Skip network errors to avoid crashing
        }

        logger.error(
          { err, event: evt.event, did: evt.did },
          "Error processing firehose event, continuing",
        );
      }
    },
    // PR pending for wildcard collection support, for now individually list collections
    filterCollections: [
      "so.sprk.feed.post",
      "so.sprk.feed.like",
      "so.sprk.feed.music",
      "so.sprk.feed.audio",
      "so.sprk.actor.profile",
      "so.sprk.feed.story",
      "so.sprk.graph.follow",
      "app.bsky.graph.follow",
      "app.bsky.graph.block",
      "app.bsky.feed.generator",
      "app.bsky.feed.repost",
    ],
  });
  return { firehose, runner };
};
