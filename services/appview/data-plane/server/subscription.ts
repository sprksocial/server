import { IdResolver } from "@atproto/identity";
import { WriteOpAction } from "@atproto/repo";
import { Event as FirehoseEvent, Firehose, MemoryRunner } from "@atproto/sync";
import { BackgroundQueue } from "./background.ts";
import { Database } from "./index.ts";
import { IndexingService } from "./indexing/index.ts";
import pino from "pino";

// Event counter for logging
interface EventCounter {
  // Cumulative totals (never reset)
  totalCumulative: number;
  identityCumulative: number;
  accountCumulative: number;
  syncCumulative: number;
  createCumulative: number;
  updateCumulative: number;
  deleteCumulative: number;
  errorsCumulative: number;

  // Per-minute counters (reset every minute)
  totalLastMinute: number;
  identityLastMinute: number;
  accountLastMinute: number;
  syncLastMinute: number;
  createLastMinute: number;
  updateLastMinute: number;
  deleteLastMinute: number;
  errorsLastMinute: number;

  lastLogTime: Date;
}

export class RepoSubscription {
  firehose: Firehose;
  runner: MemoryRunner;
  background: BackgroundQueue;
  indexingSvc: IndexingService;
  eventCounter: EventCounter;
  logInterval: number | null = null;

  constructor(
    public opts: { service: string; db: Database; idResolver: IdResolver },
  ) {
    const { service, db, idResolver } = opts;
    this.background = new BackgroundQueue(db);
    this.indexingSvc = new IndexingService(db, idResolver, this.background);

    // Initialize event counter
    this.eventCounter = {
      totalCumulative: 0,
      identityCumulative: 0,
      accountCumulative: 0,
      syncCumulative: 0,
      createCumulative: 0,
      updateCumulative: 0,
      deleteCumulative: 0,
      errorsCumulative: 0,
      totalLastMinute: 0,
      identityLastMinute: 0,
      accountLastMinute: 0,
      syncLastMinute: 0,
      createLastMinute: 0,
      updateLastMinute: 0,
      deleteLastMinute: 0,
      errorsLastMinute: 0,
      lastLogTime: new Date(),
    };

    const { runner, firehose } = createFirehose({
      idResolver,
      service,
      indexingSvc: this.indexingSvc,
      logger: this.opts.db.logger,
      eventCounter: this.eventCounter,
    });
    this.runner = runner;
    this.firehose = firehose;
  }

  start() {
    console.log("Starting firehose subscription");
    this.firehose.start();
    this.startEventLogging();
  }

  async restart() {
    await this.destroy();
    const { runner, firehose } = createFirehose({
      idResolver: this.opts.idResolver,
      service: this.opts.service,
      indexingSvc: this.indexingSvc,
      logger: this.opts.db.logger,
      eventCounter: this.eventCounter,
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
    if (this.logInterval !== null) {
      clearInterval(this.logInterval);
      this.logInterval = null;
    }
    await this.firehose.destroy();
    await this.runner.destroy();
    await this.background.processAll();
  }

  private startEventLogging() {
    this.logInterval = setInterval(() => {
      const now = new Date();
      const elapsed =
        (now.getTime() - this.eventCounter.lastLogTime.getTime()) / 1000;
      const eventsPerMinute = elapsed > 0
        ? Math.round((this.eventCounter.totalLastMinute * 60) / elapsed)
        : 0;

      this.opts.db.logger.info(
        {
          eventsPerMinute,
          eventsLastMinute: this.eventCounter.totalLastMinute,
          totalEventsCumulative: this.eventCounter.totalCumulative,
          lastMinuteBreakdown: {
            identity: this.eventCounter.identityLastMinute,
            account: this.eventCounter.accountLastMinute,
            sync: this.eventCounter.syncLastMinute,
            create: this.eventCounter.createLastMinute,
            update: this.eventCounter.updateLastMinute,
            delete: this.eventCounter.deleteLastMinute,
            errors: this.eventCounter.errorsLastMinute,
          },
          cumulativeBreakdown: {
            identity: this.eventCounter.identityCumulative,
            account: this.eventCounter.accountCumulative,
            sync: this.eventCounter.syncCumulative,
            create: this.eventCounter.createCumulative,
            update: this.eventCounter.updateCumulative,
            delete: this.eventCounter.deleteCumulative,
            errors: this.eventCounter.errorsCumulative,
          },
        },
        "Firehose activity summary",
      );

      // Reset only the per-minute counters
      this.eventCounter.totalLastMinute = 0;
      this.eventCounter.identityLastMinute = 0;
      this.eventCounter.accountLastMinute = 0;
      this.eventCounter.syncLastMinute = 0;
      this.eventCounter.createLastMinute = 0;
      this.eventCounter.updateLastMinute = 0;
      this.eventCounter.deleteLastMinute = 0;
      this.eventCounter.errorsLastMinute = 0;
      this.eventCounter.lastLogTime = now;
    }, 30000); // Log every 30 seconds
  }
}

const createFirehose = (opts: {
  idResolver: IdResolver;
  service: string;
  indexingSvc: IndexingService;
  logger: pino.Logger;
  eventCounter: EventCounter;
}) => {
  const { idResolver, service, indexingSvc, logger, eventCounter } = opts;
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
        eventCounter.totalCumulative++;
        eventCounter.totalLastMinute++;

        if (evt.event === "identity") {
          eventCounter.identityCumulative++;
          eventCounter.identityLastMinute++;
          await indexingSvc.indexHandle(evt.did, evt.time, true);
        } else if (evt.event === "account") {
          eventCounter.accountCumulative++;
          eventCounter.accountLastMinute++;
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
          eventCounter.syncCumulative++;
          eventCounter.syncLastMinute++;
          await Promise.all([
            indexingSvc.setCommitLastSeen(evt.did, evt.cid, evt.rev),
            indexingSvc.indexHandle(evt.did, evt.time),
          ]);
        } else {
          // Count create, update, delete events
          if (evt.event === "create") {
            eventCounter.createCumulative++;
            eventCounter.createLastMinute++;
          } else if (evt.event === "update") {
            eventCounter.updateCumulative++;
            eventCounter.updateLastMinute++;
          } else if (evt.event === "delete") {
            eventCounter.deleteCumulative++;
            eventCounter.deleteLastMinute++;
          }

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
        eventCounter.errorsCumulative++;
        eventCounter.errorsLastMinute++;
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
