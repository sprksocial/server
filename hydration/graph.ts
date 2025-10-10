import { DataPlane } from "../data-plane/index.ts";
import { Record as BlockRecord } from "../lex/types/app/bsky/graph/block.ts";
import { Record as FollowRecord } from "../lex/types/app/bsky/graph/follow.ts";
import { HydrationMap, parseRecord, RecordInfo } from "./util.ts";

export type Follow = RecordInfo<FollowRecord>;
export type Follows = HydrationMap<Follow>;

export type FollowInfo = {
  uri: string;
  actorDid: string;
  subjectDid: string;
};

export type Block = RecordInfo<BlockRecord>;

export type RelationshipPair = [didA: string, didB: string];

const dedupePairs = (pairs: RelationshipPair[]): RelationshipPair[] => {
  const deduped = pairs.reduce((acc, pair) => {
    return acc.set(Blocks.key(...pair), pair);
  }, new Map<string, RelationshipPair>());
  return [...deduped.values()];
};

export class Blocks {
  _blocks: Map<string, BlockEntry> = new Map(); // did:a,did:b -> block
  constructor() {}

  static key(didA: string, didB: string): string {
    return [didA, didB].sort().join(",");
  }

  set(didA: string, didB: string, block: BlockEntry): Blocks {
    const key = Blocks.key(didA, didB);
    this._blocks.set(key, block);
    return this;
  }

  get(didA: string, didB: string): BlockEntry | null {
    if (didA === didB) return null; // ignore self-blocks
    const key = Blocks.key(didA, didB);
    return this._blocks.get(key) ?? null;
  }

  merge(blocks: Blocks): Blocks {
    blocks._blocks.forEach((block, key) => {
      this._blocks.set(key, block);
    });
    return this;
  }
}

// No "blocking" vs. "blocked" directionality: only suitable for bidirectional block checks
export type BlockEntry = {
  blockUri: string | undefined;
};

export class GraphHydrator {
  constructor(public dataplane: DataPlane) {}

  async getBidirectionalBlocks(pairs: RelationshipPair[]): Promise<Blocks> {
    if (!pairs.length) return new Blocks();
    const deduped = dedupePairs(pairs).map(([a, b]) => ({ a, b }));
    const res = await this.dataplane.relationships.getBlockExistence(deduped);
    const blocks = new Blocks();
    for (let i = 0; i < deduped.length; i++) {
      const pair = deduped[i];
      const block = res.blocks[i];
      blocks.set(pair.a, pair.b, {
        blockUri: block.blockedBy || block.blocking || undefined,
      });
    }
    return blocks;
  }

  async getFollows(uris: string[], includeTakedowns = false): Promise<Follows> {
    if (!uris.length) return new HydrationMap<Follow>();
    const res = await this.dataplane.records.getFollowRecords(uris);
    return uris.reduce((acc, uri, i) => {
      const record = parseRecord<FollowRecord>(
        res.records[i],
        includeTakedowns,
      );
      return acc.set(uri, record ?? null);
    }, new HydrationMap<Follow>());
  }

  async getBlocks(
    uris: string[],
    includeTakedowns = false,
  ): Promise<HydrationMap<Block>> {
    if (!uris.length) return new HydrationMap<Block>();
    const res = await this.dataplane.records.getBlockRecords(uris);
    return uris.reduce((acc, uri, i) => {
      const record = parseRecord<BlockRecord>(res.records[i], includeTakedowns);
      return acc.set(uri, record ?? null);
    }, new HydrationMap<Block>());
  }

  async getActorFollows(input: {
    did: string;
    cursor?: string;
    limit?: number;
  }): Promise<{ follows: FollowInfo[]; cursor: string | undefined }> {
    const { did, cursor, limit } = input;
    const res = await this.dataplane.follows.getFollows(
      did,
      limit,
      cursor,
    );
    return { follows: res.follows, cursor: res.cursor };
  }

  async getActorFollowers(input: {
    did: string;
    cursor?: string;
    limit?: number;
  }): Promise<{ followers: FollowInfo[]; cursor: string | undefined }> {
    const { did, cursor, limit } = input;
    const res = await this.dataplane.follows.getFollowers(
      did,
      limit,
      cursor,
    );
    return { followers: res.followers, cursor: res.cursor };
  }
}
