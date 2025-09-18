import { DataPlane } from "../data-plane/index.ts";
import { Record as ProfileRecord } from "../lex/types/so/sprk/actor/profile.ts";
import {
  HydrationMap,
  parseRecord,
  parseString,
  safeTakedownRef,
} from "./util.ts";

export type Actor = {
  did: string;
  handle?: string;
  profile?: ProfileRecord;
  profileCid?: string;
  profileTakedownRef?: string;
  indexedAt?: Date;
  createdAt?: Date;
  sortedAt?: Date;
  takedownRef?: string;
  upstreamStatus?: string;
};

export type Actors = HydrationMap<Actor>;

export type ProfileViewerState = {
  muted?: boolean;
  blockedBy?: string;
  blocking?: string;
  following?: string;
  followedBy?: string;
};

export type ProfileViewerStates = HydrationMap<ProfileViewerState>;

type ActivitySubscriptionState = {
  post: boolean;
  reply: boolean;
};

export type ActivitySubscriptionStates = HydrationMap<
  ActivitySubscriptionState | undefined
>;

type KnownFollowersState = {
  count: number;
  followers: string[];
};

export type KnownFollowersStates = HydrationMap<
  KnownFollowersState | undefined
>;

export type ProfileAgg = {
  followers: number;
  follows: number;
  posts: number;
  feeds: number;
};

export type ProfileAggs = HydrationMap<ProfileAgg>;

export class ActorHydrator {
  constructor(public dataplane: DataPlane) {}

  async getRepoRevSafe(did: string | null): Promise<string | null> {
    if (!did) return null;
    try {
      const res = await this.dataplane.sync.latestRev(did);
      return parseString(res.rev) ?? null;
    } catch {
      return null;
    }
  }

  async getDids(
    handleOrDids: string[],
  ): Promise<(string | undefined)[]> {
    const handles = handleOrDids.filter((actor) => !actor.startsWith("did:"));
    const res = handles.length
      ? await this.dataplane.actors.getDidsByHandles(handles)
      : { dids: [] };
    const didByHandle = handles.reduce(
      (acc, cur, i) => {
        const did = res.dids[i];
        if (did && did.length > 0) {
          return acc.set(cur, did);
        }
        return acc;
      },
      new Map() as Map<string, string>,
    );
    return handleOrDids.map((id) =>
      id.startsWith("did:") ? id : didByHandle.get(id)
    );
  }

  async getDidsDefined(handleOrDids: string[]): Promise<string[]> {
    const res = await this.getDids(handleOrDids);
    return res.filter((did) => did !== undefined);
  }

  async getActors(
    dids: string[],
    opts: {
      includeTakedowns?: boolean;
    } = {},
  ): Promise<Actors> {
    const { includeTakedowns = false } = opts;
    if (!dids.length) return new HydrationMap<Actor>();
    const res = await this.dataplane.actors.getActors(dids);
    return dids.reduce((acc, did, i) => {
      const actor = res.actors[i];
      const isNoHosted = actor.takenDown ||
        (actor.upstreamStatus && actor.upstreamStatus !== "active");
      if (
        !actor.exists ||
        (isNoHosted && !includeTakedowns) ||
        !!actor.tombstonedAt
      ) {
        return acc.set(did, null);
      }

      const profile = actor.profile
        ? parseRecord<ProfileRecord>(actor.profile, includeTakedowns)
        : undefined;

      return acc.set(did, {
        did,
        handle: parseString(actor.handle),
        profile: profile?.record,
        profileCid: profile?.cid,
        sortedAt: profile?.sortedAt ?? new Date(0),
        profileTakedownRef: profile?.takedownRef,
        indexedAt: profile?.indexedAt,
        takedownRef: safeTakedownRef(actor),
        upstreamStatus: actor.upstreamStatus || undefined,
        createdAt: new Date(actor.createdAt ?? 0),
      });
    }, new HydrationMap<Actor>());
  }

  // "naive" because this method does not verify the existence of the list itself
  // a later check in the main hydrator will remove list uris that have been deleted or
  // repurposed to "curate lists"
  async getProfileViewerStatesNaive(
    dids: string[],
    viewer: string,
  ): Promise<ProfileViewerStates> {
    if (!dids.length) return new HydrationMap<ProfileViewerState>();
    const res = await this.dataplane.relationships.getRelationships(
      viewer,
      dids,
    );

    return dids.reduce((acc, did, i) => {
      const rels = res.relationships[i];
      if (viewer === did) {
        // ignore self-follows, self-mutes, self-blocks, self-activity-subscriptions
        return acc.set(did, {});
      }
      return acc.set(did, {
        muted: rels.muted ?? false,
        blockedBy: parseString(rels.blockedBy),
        blocking: parseString(rels.blocking),
        following: parseString(rels.following),
        followedBy: parseString(rels.followedBy),
      });
    }, new HydrationMap<ProfileViewerState>());
  }

  async getKnownFollowers(
    dids: string[],
    viewer: string | null,
  ): Promise<KnownFollowersStates> {
    if (!viewer) return new HydrationMap<KnownFollowersState | undefined>();
    const { results: knownFollowersResults } = await this.dataplane
      .follows.getFollowsFollowing(viewer, dids);
    return dids.reduce((acc, did, i) => {
      const result = knownFollowersResults[i]?.dids;
      return acc.set(
        did,
        result && result.length > 0
          ? {
            count: result.length,
            followers: result.slice(0, 5),
          }
          : undefined,
      );
    }, new HydrationMap<KnownFollowersState | undefined>());
  }

  async getProfileAggregates(dids: string[]): Promise<ProfileAggs> {
    if (!dids.length) return new HydrationMap<ProfileAgg>();
    const counts = await this.dataplane.interactions.getCountsForUsers(dids);
    return dids.reduce((acc, did, i) => {
      return acc.set(did, {
        followers: counts.followers[i] ?? 0,
        follows: counts.following[i] ?? 0,
        posts: counts.posts[i] ?? 0,
        feeds: counts.feeds[i] ?? 0,
      });
    }, new HydrationMap<ProfileAgg>());
  }
}
