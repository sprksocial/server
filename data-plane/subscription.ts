import { IdResolver } from "@atp/identity";
import { WriteOpAction } from "@atp/repo";
import { Event as FirehoseEvent, Firehose, MemoryRunner } from "@atp/sync";
import { BackgroundQueue } from "./background.ts";
import { Database } from "./db/index.ts";
import { IndexingService } from "./indexing/index.ts";
import { ServerConfig } from "./../config.ts";
import { PushService } from "./../utils/push.ts";
import { PushTokens } from "./routes/push-tokens.ts";

export class RepoSubscription {
  firehose: Firehose;
  runner: MemoryRunner;
  background: BackgroundQueue;
  indexingSvc: IndexingService;
  pushService: PushService;
  private firehoseRunning = false;

  constructor(
    public opts: {
      db: Database;
      idResolver: IdResolver;
      startCursor?: number;
      cfg: ServerConfig;
    },
  ) {
    const { db, idResolver, startCursor, cfg } = opts;
    this.background = new BackgroundQueue(db);

    // Create push service (FCM handles both iOS and Android)
    const pushTokens = new PushTokens(db);
    this.pushService = new PushService(pushTokens, db, {
      enabled: cfg.pushEnabled,
      fcmServiceAccount: cfg.fcmServiceAccount,
    });

    this.indexingSvc = new IndexingService(
      db,
      cfg,
      idResolver,
      this.background,
      this.pushService,
    );

    const { runner, firehose } = createFirehose({
      idResolver,
      service: cfg.relayUrl,
      indexingSvc: this.indexingSvc,
      db,
      startCursor,
    });
    this.runner = runner;
    this.firehose = firehose;
  }

  start() {
    console.info("Starting firehose subscription");
    this.firehoseRunning = true;
    this.firehose.start();
  }

  async restart() {
    await this.destroy();

    // Read fresh cursor from database
    const savedCursor = await this.opts.db.getCursorState();
    const startCursor = savedCursor !== null ? savedCursor : undefined;

    const { runner, firehose } = createFirehose({
      idResolver: this.opts.idResolver,
      service: this.opts.cfg.relayUrl,
      indexingSvc: this.indexingSvc,
      db: this.opts.db,
      startCursor,
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
    try {
      if (this.firehoseRunning) {
        await this.firehose.destroy();
        this.firehoseRunning = false;
      }
      console.info("Processing remaining runner tasks...");
      if (this.opts.cfg.debugMode) {
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
          console.warn("Runner destroy timed out; continuing shutdown", {
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
          console.warn("Runner destroy timed out; continuing shutdown", {
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
      console.error("Error during subscription destroy", { error });
      throw error;
    }
  }
}

function createFirehose(opts: {
  idResolver: IdResolver;
  service?: string;
  indexingSvc: IndexingService;
  db: Database;
  startCursor?: number;
}): { firehose: Firehose; runner: MemoryRunner } {
  const { idResolver, service, indexingSvc, db, startCursor } = opts;

  const runner = new MemoryRunner({
    startCursor,
    setCursorInterval: 30000, // Save cursor every 30 seconds
    setCursor: async (cursor: number) => {
      const didSave = await db.saveCursorState(cursor);
      if (didSave) {
        console.info("Cursor saved to database", { cursor });
      }
    },
  });
  const firehose = new Firehose({
    idResolver,
    runner,
    service,
    onError: (err: Error) => console.error("error in subscription", { err }),
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
    ],
  });
  return { firehose, runner };
}
