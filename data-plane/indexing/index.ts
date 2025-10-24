import { CID } from "multiformats/cid";
import { AtpAgent, ComAtprotoSyncGetLatestCommit } from "@atproto/api";
import { DAY, HOUR } from "@atp/common";
import { getPds, IdResolver } from "@atp/identity";
import { RepoRecord, ValidationError } from "@atp/lexicon";
import {
  getAndParseRecord,
  readCarWithRoot,
  VerifiedRepo,
  verifyRepo,
  WriteOpAction,
} from "@atp/repo";
import { AtUri } from "@atp/syntax";
import { retryXrpc } from "../../utils/retry.ts";
import { BackgroundQueue } from "../background.ts";
import { Database } from "../db/index.ts";
import { ActorDocument } from "../db/models.ts";
import * as Block from "./plugins/block.ts";
import * as Generator from "./plugins/generator.ts";
import * as Follow from "./plugins/follow.ts";
import * as Like from "./plugins/like.ts";
import * as Post from "./plugins/post.ts";
import * as Reply from "./plugins/reply.ts";
import * as Profile from "./plugins/profile.ts";
import * as Repost from "./plugins/repost.ts";
import * as Story from "./plugins/story.ts";
import * as Audio from "./plugins/audio.ts";
import { RecordProcessor } from "./processor.ts";
import { Logger } from "@logtape/logtape";
import { ServerConfig } from "../../config.ts";

export class IndexingService {
  records: {
    post: Post.PluginType;
    reply: Reply.PluginType;
    like: Like.PluginType;
    repost: Repost.PluginType;
    follow: Follow.PluginType;
    profile: Profile.PluginType;
    block: Block.PluginType;
    generator: Generator.PluginType;
    story: Story.PluginType;
    audio: Audio.PluginType;
  };

  constructor(
    public db: Database,
    public cfg: ServerConfig,
    public idResolver: IdResolver,
    public background: BackgroundQueue,
    public logger: Logger,
  ) {
    this.records = {
      post: Post.makePlugin(this.db, this.background),
      reply: Reply.makePlugin(this.db, this.background),
      like: Like.makePlugin(this.db, this.background),
      repost: Repost.makePlugin(this.db, this.background),
      follow: Follow.makePlugin(this.db, this.background),
      profile: Profile.makePlugin(this.db, this.background),
      block: Block.makePlugin(this.db, this.background),
      generator: Generator.makePlugin(this.db, this.background),
      story: Story.makePlugin(this.db, this.background),
      audio: Audio.makePlugin(this.db, this.background),
    };
  }

  transact(txn: Database) {
    return new IndexingService(
      txn,
      this.cfg,
      this.idResolver,
      this.background,
      this.logger,
    );
  }

  async indexRecord(
    uri: AtUri,
    cid: CID,
    obj: RepoRecord,
    action: WriteOpAction.Create | WriteOpAction.Update,
    timestamp: string,
    opts?: { disableNotifs?: boolean; disableLabels?: boolean },
  ) {
    const indexer = this.findIndexerForCollection(uri.collection);
    if (!indexer) return;
    if (action === WriteOpAction.Create) {
      await indexer.insertRecord(uri, cid, obj, timestamp, opts);
    } else {
      await indexer.updateRecord(uri, cid, obj, timestamp);
    }
  }

  async deleteRecord(uri: AtUri, cascading = false) {
    const indexer = this.findIndexerForCollection(uri.collection);
    if (!indexer) return;
    await indexer.deleteRecord(uri, cascading);
  }

  async indexHandle(did: string, timestamp: string, force = false) {
    const actor = await this.db.models.Actor.findOne({ did });
    if (!force && !needsHandleReindex(actor, timestamp)) {
      return;
    }

    try {
      const atpData = await this.idResolver.did.resolveAtprotoData(did, true);

      const handle = atpData.handle.toLowerCase();

      const actorWithHandle = handle !== null
        ? await this.db.models.Actor.findOne({ handle }).lean()
        : null;

      // handle contention
      if (handle && actorWithHandle && did !== actorWithHandle.did) {
        await this.db.models.Actor.updateOne(
          { did: actorWithHandle.did },
          { handle: null },
        );
      }

      const uri = `at://${did}/so.sprk.actor.profile`;
      const actorInfo = { uri, handle, indexedAt: timestamp };
      await this.db.models.Actor.findOneAndUpdate(
        { did },
        { did, ...actorInfo },
        { upsert: true, new: true },
      );
    } catch (err) {
      // Log the error but don't throw - this prevents the firehose from crashing
      this.logger.warn(
        "Failed to index handle, skipping",
        { err, did, timestamp },
      );

      // Still update the actor record with null handle to prevent repeated attempts
      const uri = `at://${did}/so.sprk.actor.profile`;
      const actorInfo = { uri, handle: null, indexedAt: timestamp };
      try {
        await this.db.models.Actor.findOneAndUpdate(
          { did },
          { did, ...actorInfo },
          { upsert: true, new: true },
        );
      } catch (dbErr) {
        this.logger.error(
          "Failed to update actor record after handle resolution failure",
          { err: dbErr, did },
        );
      }
    }
  }

  async indexRepo(did: string, commit?: string) {
    const now = new Date().toISOString();

    const actorExists = await this.db.models.Actor.findOne({ did }).lean();
    if (!actorExists) {
      console.log(
        `indexRepo: No actor record found for ${did}, indexing handle first`,
      );
      await this.indexHandle(did, now);
    }

    const { pds, signingKey } = await this.idResolver.did.resolveAtprotoData(
      did,
      true,
    );
    const agent = new AtpAgent({ service: pds });

    const { data: car } = await retryXrpc(() =>
      agent.com.atproto.sync.getRepo({ did })
    );
    const { root, blocks } = await readCarWithRoot(car);
    const verifiedRepo = await verifyRepo(blocks, root, did, signingKey);

    const currRecords = await this.getCurrentRecords(did);
    const repoRecords = formatCheckout(did, verifiedRepo);
    const diff = findDiffFromCheckout(currRecords, repoRecords);

    console.log(`Indexing ${diff.length} records for ${did}:`);

    await Promise.all(
      diff.map(async (op) => {
        const { uri, cid } = op;
        try {
          if (op.op === "delete") {
            await this.deleteRecord(uri);
          } else {
            const parsed = getAndParseRecord(blocks, cid);
            await this.indexRecord(
              uri,
              cid,
              parsed.record,
              op.op === "create" ? WriteOpAction.Create : WriteOpAction.Update,
              now,
            );
          }
        } catch (err) {
          if (err instanceof ValidationError) {
            this.logger.warn(
              "skipping indexing of invalid record",
              { did, commit, uri: uri.toString(), cid: cid.toString() },
            );
          } else {
            this.logger.error(
              "skipping indexing due to error processing record",
              { err, did, commit, uri: uri.toString(), cid: cid.toString() },
            );
          }
        }
      }),
    );

    // Update the last seen commit for this actor
    await this.setCommitLastSeen(did, root, commit || "");
  }

  async getCurrentRecords(did: string) {
    const res = await this.db.models.Record.find({ did }).select(["uri", "cid"])
      .lean();
    return res.reduce(
      (acc, cur) => {
        acc[cur.uri] = {
          uri: new AtUri(cur.uri),
          cid: CID.parse(cur.cid),
        };
        return acc;
      },
      {} as Record<string, { uri: AtUri; cid: CID }>,
    );
  }

  async setCommitLastSeen(did: string, commit: CID, rev: string) {
    await this.db.models.ActorSync.findOneAndUpdate(
      { did },
      {
        did,
        commitCid: commit.toString(),
        repoRev: rev ?? null,
      },
      { upsert: true, new: true },
    );
  }

  findIndexerForCollection(collection: string) {
    const indexers = Object.values(
      this.records as Record<string, RecordProcessor<unknown, unknown>>,
    );
    return indexers.find((indexer) => indexer.collection === collection);
  }

  async updateActorStatus(did: string, active: boolean, status: string = "") {
    let upstreamStatus: string | null;
    if (active) {
      upstreamStatus = null;
    } else if (["deactivated", "suspended", "takendown"].includes(status)) {
      upstreamStatus = status;
    } else {
      throw new Error(`Unrecognized account status: ${status}`);
    }
    await this.db.models.Actor.updateOne(
      { did },
      { upstreamStatus },
    );
  }

  async deleteActor(did: string) {
    const actorIsHosted = await this.getActorIsHosted(did);
    if (actorIsHosted === false) {
      await this.db.models.Actor.deleteOne({ did });
      await this.unindexActor(did);
      // Note: Notification model not present in current schemas
    }
  }

  private async getActorIsHosted(did: string) {
    try {
      const doc = await this.idResolver.did.resolve(did, true);
      const pds = doc && getPds(doc);
      if (!pds) return false;
      const agent = new AtpAgent({ service: pds });
      try {
        await retryXrpc(() => agent.com.atproto.sync.getLatestCommit({ did }));
        return true;
      } catch (err) {
        if (err instanceof ComAtprotoSyncGetLatestCommit.RepoNotFoundError) {
          return false;
        }
        return null;
      }
    } catch (err) {
      this.logger.warn(
        "Failed to check if actor is hosted, assuming not hosted",
        { err, did },
      );
      return false;
    }
  }

  async unindexActor(did: string) {
    await this.db.models.Profile.deleteMany({ authorDid: did });
    await this.db.models.Follow.deleteMany({ authorDid: did });
    await this.db.models.Repost.deleteMany({ authorDid: did });
    await this.db.models.Like.deleteMany({ authorDid: did });
    await this.db.models.Generator.deleteMany({ authorDid: did });
    await this.db.models.Story.deleteMany({ authorDid: did });
    await this.db.models.Audio.deleteMany({ authorDid: did });
    await this.db.models.Block.deleteMany({ authorDid: did });
    await this.db.models.Post.deleteMany({ authorDid: did });
    await this.db.models.Reply.deleteMany({ authorDid: did });
  }
}

type UriAndCid = {
  uri: AtUri;
  cid: CID;
};

type IndexOp =
  | ({
    op: "create" | "update";
  } & UriAndCid)
  | ({ op: "delete" } & UriAndCid);

const findDiffFromCheckout = (
  curr: Record<string, UriAndCid>,
  checkout: Record<string, UriAndCid>,
): IndexOp[] => {
  const ops: IndexOp[] = [];
  for (const uri of Object.keys(checkout)) {
    const record = checkout[uri];
    if (!curr[uri]) {
      ops.push({ op: "create", ...record });
    } else {
      if (curr[uri].cid.equals(record.cid)) {
        // no-op
        continue;
      }
      ops.push({ op: "update", ...record });
    }
  }
  for (const uri of Object.keys(curr)) {
    const record = curr[uri];
    if (!checkout[uri]) {
      ops.push({ op: "delete", ...record });
    }
  }
  return ops;
};

const formatCheckout = (
  did: string,
  verifiedRepo: VerifiedRepo,
): Record<string, UriAndCid> => {
  const records: Record<string, UriAndCid> = {};
  for (const create of verifiedRepo.creates) {
    const uri = AtUri.make(did, create.collection, create.rkey);
    records[uri.toString()] = {
      uri,
      cid: create.cid,
    };
  }
  return records;
};

const needsHandleReindex = (
  actor: ActorDocument | null,
  timestamp: string,
) => {
  if (!actor) return true;
  const timeDiff = new Date(timestamp).getTime() -
    new Date(actor.indexedAt).getTime();
  // revalidate daily
  if (timeDiff > DAY) return true;
  // revalidate more aggressively for invalidated handles
  if (actor.handle === null && timeDiff > HOUR) return true;
  return false;
};
