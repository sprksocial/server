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
  const runner = new MemoryRunner();
  const firehose = new Firehose({
    idResolver,
    runner,
    service,
    onError: (err: Error) => logger.error({ err }, "error in subscription"),
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
      } else if (
        evt.event === "create" || evt.event === "update" ||
        evt.event === "delete"
      ) {
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
