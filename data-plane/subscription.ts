import { IdResolver } from "@atp/identity";
import { WriteOpAction } from "@atp/repo";
import { Event as FirehoseEvent, Firehose, MemoryRunner } from "@atp/sync";
import { BackgroundQueue } from "./background.ts";
import { Database } from "./db/index.ts";
import { IndexingService } from "./indexing/index.ts";
import { getLogger, Logger } from "@logtape/logtape";
import { env } from "../utils/env.ts";

export class RepoSubscription {
  firehose: Firehose;
  runner: MemoryRunner;
  background: BackgroundQueue;
  indexingSvc: IndexingService;
  logger: Logger;
  private firehoseRunning = false;

  constructor(
    public opts: {
      service: string;
      db: Database;
      idResolver: IdResolver;
      startCursor?: number;
    },
  ) {
    const { service, db, idResolver, startCursor } = opts;
    this.logger = getLogger(["appview", "subscription"]);
    this.background = new BackgroundQueue(db, this.logger);
    this.indexingSvc = new IndexingService(
      db,
      idResolver,
      this.background,
      this.logger,
    );

    const { runner, firehose } = createFirehose({
      idResolver,
      service,
      indexingSvc: this.indexingSvc,
      logger: this.logger,
      db,
      startCursor,
    });
    this.runner = runner;
    this.firehose = firehose;
  }

  async start() {
    const connected = await this.indexingSvc.db.waitForConnection(30000);
    if (!connected) {
      throw new Error(
        "Failed to connect to database during subscription start",
      );
    }
    this.logger.info("Starting firehose subscription");
    this.firehoseRunning = true;
    this.firehose.start();
  }

  async restart() {
    await this.destroy();
    const connected = await this.indexingSvc.db.waitForConnection(30000);
    if (!connected) {
      throw new Error(
        "Failed to connect to database during subscription restart",
      );
    }

    // Read fresh cursor from database
    const savedCursor = await this.opts.db.getCursorState();
    const startCursor = savedCursor !== null ? savedCursor : undefined;

    const { runner, firehose } = createFirehose({
      idResolver: this.opts.idResolver,
      service: this.opts.service,
      indexingSvc: this.indexingSvc,
      logger: this.logger,
      db: this.opts.db,
      startCursor,
    });
    this.runner = runner;
    this.firehose = firehose;
    await this.start();
  }

  async processAll() {
    await this.runner.processAll();
    await this.background.processAll();
  }

  async destroy() {
    try {
      if (this.firehoseRunning) {
        await this.firehose.destroy();
        this.firehoseRunning = false;
      }
      this.logger.info("Processing remaining runner tasks...");
      if (env.NODE_ENV === "development") {
        const timeoutMs = 10000;
        // Runner destroy with timeout and proper timer cleanup
        let destroyTimeoutId: number | undefined;
        try {
          const timeoutPromise = new Promise<never>((_, reject) => {
            destroyTimeoutId = setTimeout(
              () => reject(new Error(`Timeout after ${timeoutMs}ms`)),
              timeoutMs,
            );
          });
          await Promise.race([this.runner.destroy(), timeoutPromise]);
        } catch (e) {
          this.logger.warn("Runner destroy timed out; continuing shutdown", {
            e,
          });
        } finally {
          if (destroyTimeoutId !== undefined) {
            clearTimeout(destroyTimeoutId);
            destroyTimeoutId = undefined;
          }
        }
        // Background drain with timeout and proper timer cleanup
        let bgTimeoutId: number | undefined;
        try {
          const timeoutPromise = new Promise<never>((_, reject) => {
            bgTimeoutId = setTimeout(
              () => reject(new Error(`Timeout after ${timeoutMs}ms`)),
              timeoutMs,
            );
          });
          await Promise.race([this.background.processAll(), timeoutPromise]);
        } catch (e) {
          this.logger.warn("Runner destroy timed out; continuing shutdown", {
            e,
          });
        } finally {
          if (bgTimeoutId !== undefined) {
            clearTimeout(bgTimeoutId);
            bgTimeoutId = undefined;
          }
        }
      } else {
        await this.runner.processAll();
        await this.background.processAll();
      }
    } catch (error) {
      this.logger.error("Error during subscription destroy", { error });
      throw error;
    }
  }
}

function createFirehose(opts: {
  idResolver: IdResolver;
  service: string;
  indexingSvc: IndexingService;
  logger: Logger;
  db: Database;
  startCursor?: number;
}): { firehose: Firehose; runner: MemoryRunner } {
  const { idResolver, service, indexingSvc, logger, db, startCursor } = opts;

  logger.info("Creating firehose subscription", { service, startCursor });

  const runner = new MemoryRunner({
    startCursor,
    concurrency: env.RUNNER_CONCURRENCY,
    setCursorInterval: 30000, // Save cursor every 30 seconds
    setCursor: async (cursor: number) => {
      await db.saveCursorState(cursor);
      logger.info("Cursor saved to database", { cursor });
    },
  });
  const firehose = new Firehose({
    idResolver,
    runner,
    service,
    onError: (err: Error) => logger.error("error in subscription", { err }),
    handleEvent: async (evt: FirehoseEvent) => {
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
    },
    filterCollections: [
      "so.sprk.*",
      "app.bsky.graph.follow",
      "app.bsky.graph.block",
      "app.bsky.feed.generator",
    ],
  });
  return { firehose, runner };
}
