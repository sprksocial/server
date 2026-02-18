import { IdResolver } from "@atp/identity";
import { WriteOpAction } from "@atp/repo";
import { Event as FirehoseEvent, Firehose, MemoryRunner } from "@atp/sync";
import { BackgroundQueue } from "../background.ts";
import { Database } from "../db/index.ts";
import { IndexingService } from "../indexing/index.ts";
import { ServerConfig } from "../../config.ts";
import { PushService } from "../../utils/push.ts";
import { PushTokens } from "../routes/push-tokens.ts";

const CURSOR_STATE_IDENTIFIER = "crosspost_comments_cursor";

export class CrosspostRepoSubscription {
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

    const { runner, firehose } = createCrosspostFirehose({
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
    console.info("Starting crosspost firehose subscription");
    this.firehoseRunning = true;
    this.firehose.start();
  }

  async restart() {
    await this.destroy();

    const savedCursor = await this.opts.db.getCursorState(
      CURSOR_STATE_IDENTIFIER,
    );
    const startCursor = savedCursor !== null ? savedCursor : undefined;

    const { runner, firehose } = createCrosspostFirehose({
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

function createCrosspostFirehose(opts: {
  idResolver: IdResolver;
  service?: string;
  indexingSvc: IndexingService;
  db: Database;
  startCursor?: number;
}): { firehose: Firehose; runner: MemoryRunner } {
  const { idResolver, service, indexingSvc, db, startCursor } = opts;

  const runner = new MemoryRunner({
    startCursor,
    setCursorInterval: 30000,
    setCursor: async (cursor: number) => {
      await db.saveCursorState(cursor, CURSOR_STATE_IDENTIFIER);
      console.info("Crosspost cursor saved to database", { cursor });
    },
  });

  const firehose = new Firehose({
    idResolver,
    runner,
    service,
    onError: (err: Error) =>
      console.error("error in crosspost subscription", { err }),
    excludeAccount: true,
    excludeIdentity: true,
    excludeSync: true,
    handleEvent: async (evt: FirehoseEvent) => {
      if (evt.event === "create" || evt.event === "update") {
        await indexingSvc.indexRecord(
          evt.uri,
          evt.cid,
          evt.record,
          evt.event === "create" ? WriteOpAction.Create : WriteOpAction.Update,
          evt.time,
        );
      } else if (evt.event === "delete") {
        await indexingSvc.deleteRecord(evt.uri);
      }
    },
    filterCollections: ["app.bsky.feed.post"],
  });

  return { firehose, runner };
}
