import { assert } from "@std/assert";
import { mapDefined } from "@atp/common";
import { AtUri } from "@atp/syntax";
import { DataPlane } from "../data-plane/index.ts";
import { ids } from "../lex/lexicons.ts";
import { Record as ProfileRecord } from "../lex/types/so/sprk/actor/profile.ts";
import { uriToDid as didFromUri } from "../utils/uris.ts";
import {
  ActivitySubscriptionStates,
  ActorHydrator,
  Actors,
  KnownFollowersStates,
  ProfileAggs,
  ProfileViewerStates,
} from "./actor.ts";
import {
  FeedGenAggs,
  FeedGens,
  FeedGenViewerStates,
  FeedHydrator,
  FeedItem,
  Likes,
  Post,
  PostAggs,
  Posts,
  PostViewerStates,
  Replies,
  Reply,
  ReplyAggs,
  Reposts,
  SoundAggs,
  Sounds,
  ThreadContexts,
  ThreadRef,
  VideoMappings,
} from "./feed.ts";
import {
  Stories,
  StoryHydrator,
} from "./story.ts";

import {
  BlockEntry,
  Follows,
  GraphHydrator,
  RelationshipPair,
} from "./graph.ts";
import { HydrationMap, ItemRef, mergeMaps, RecordInfo } from "./util.ts";
import { getLogger } from "@logtape/logtape";

export class HydrateCtx {
  viewer: string | null;
  includeTakedowns?: boolean;
  includeActorTakedowns?: boolean;
  include3pBlocks?: boolean;

  constructor(private vals: HydrateCtxVals) {
    this.viewer = this.vals.viewer !== null
      ? serviceRefToDid(this.vals.viewer)
      : null;
    this.includeTakedowns = this.vals.includeTakedowns;
    this.includeActorTakedowns = this.vals.includeActorTakedowns;
    this.include3pBlocks = this.vals.include3pBlocks;
  }
  // Convenience with use with dataplane.getActors cache control
  get skipCacheForViewer() {
    if (!this.viewer) return undefined;
    return [this.viewer];
  }
  copy<V extends Partial<HydrateCtxVals>>(vals?: V): HydrateCtx & V {
    return new HydrateCtx({ ...this.vals, ...vals }) as HydrateCtx & V;
  }
}

export type HydrateCtxVals = {
  viewer: string | null;
  includeTakedowns?: boolean;
  includeActorTakedowns?: boolean;
  include3pBlocks?: boolean;
};

export type HydrationState = {
  ctx?: HydrateCtx;
  actors?: Actors;
  profileViewers?: ProfileViewerStates;
  profileAggs?: ProfileAggs;
  posts?: Posts;
  replies?: Replies;
  postAggs?: PostAggs;
  replyAggs?: ReplyAggs;
  postViewers?: PostViewerStates;
  threadContexts?: ThreadContexts;
  sounds?: Sounds;
  soundAggs?: SoundAggs;
  stories?: Stories;

  postBlocks?: PostBlocks;
  reposts?: Reposts;
  follows?: Follows;
  followBlocks?: FollowBlocks;
  likes?: Likes;
  likeBlocks?: LikeBlocks;
  feedgens?: FeedGens;
  feedgenViewers?: FeedGenViewerStates;
  feedgenAggs?: FeedGenAggs;
  knownFollowers?: KnownFollowersStates;
  activitySubscriptions?: ActivitySubscriptionStates;
  bidirectionalBlocks?: BidirectionalBlocks;
  videoMappings?: VideoMappings;
};

export type PostBlock = { embed: boolean; parent: boolean; root: boolean };
export type PostBlocks = HydrationMap<PostBlock>;
type PostBlockPairs = {
  embed?: RelationshipPair;
  parent?: RelationshipPair;
  root?: RelationshipPair;
};

export type LikeBlock = boolean;
export type LikeBlocks = HydrationMap<LikeBlock>;

export type FollowBlock = boolean;
export type FollowBlocks = HydrationMap<FollowBlock>;

export type BidirectionalBlocks = HydrationMap<HydrationMap<boolean>>;

const hydrationLogger = getLogger(["appview", "hydrator"]);

export class Hydrator {
  actor: ActorHydrator;
  feed: FeedHydrator;
  graph: GraphHydrator;
  story: StoryHydrator;

  constructor(
    public dataplane: DataPlane,
  ) {
    this.actor = new ActorHydrator(dataplane);
    this.feed = new FeedHydrator(dataplane);
    this.graph = new GraphHydrator(dataplane);
    this.story = new StoryHydrator(dataplane);
  }

  // so.sprk.actor.defs#profileView
  // - profile viewer
  // Note: builds on the naive profile viewer hydrator and removes references to lists that have been deleted
  async hydrateProfileViewers(
    dids: string[],
    ctx: HydrateCtx,
  ): Promise<HydrationState> {
    const viewer = ctx.viewer;
    if (!viewer) return {};
    const profileViewers = await this.actor.getProfileViewerStatesNaive(
      dids,
      viewer,
    );

    return {
      profileViewers,
      ctx,
    };
  }

  // so.sprk.actor.defs#profileView
  // - profile
  //   - list basic
  async hydrateProfiles(
    dids: string[],
    ctx: HydrateCtx,
  ): Promise<HydrationState> {
    const includeTakedowns = ctx.includeTakedowns || ctx.includeActorTakedowns;
    const [actors, profileViewersState] = await Promise.all([
      this.actor.getActors(dids, {
        includeTakedowns,
      }),
      this.hydrateProfileViewers(dids, ctx),
    ]);
    return mergeStates(profileViewersState ?? {}, {
      actors,
      ctx,
    });
  }

  // so.sprk.actor.defs#profileViewBasic
  // - profile basic
  //   - profile
  //     - list basic
  hydrateProfilesBasic(
    dids: string[],
    ctx: HydrateCtx,
  ): Promise<HydrationState> {
    return this.hydrateProfiles(dids, ctx);
  }

  // so.sprk.actor.defs#profileViewDetailed
  // - profile detailed
  //   - profile
  //     - list basic
  //   - starterpack
  //     - profile
  //       - list basic
  //     - labels
  async hydrateProfilesDetailed(
    dids: string[],
    ctx: HydrateCtx,
  ): Promise<HydrationState> {
    let knownFollowers: KnownFollowersStates = new HydrationMap();
    try {
      knownFollowers = await this.actor.getKnownFollowers(dids, ctx.viewer);
    } catch (err) {
      hydrationLogger.error(
        "Failed to get known followers for profiles",
        { err },
      );
    }

    const subjectsToKnownFollowersMap = Array.from(
      knownFollowers.keys(),
    ).reduce((acc, did) => {
      const known = knownFollowers.get(did);
      if (known) {
        acc.set(did, known.followers);
      }
      return acc;
    }, new Map<string, string[]>());
    const allKnownFollowerDids = Array.from(knownFollowers.values())
      .filter(Boolean)
      .flatMap((f) => f!.followers);
    const allDids = Array.from(new Set(dids.concat(allKnownFollowerDids)));
    const [state, profileAggs, bidirectionalBlocks] = await Promise.all([
      this.hydrateProfiles(allDids, ctx),
      this.actor.getProfileAggregates(dids),
      this.hydrateBidirectionalBlocks(subjectsToKnownFollowersMap),
    ]);
    return mergeManyStates(state, {
      profileAggs,
      knownFollowers,
      ctx,
      bidirectionalBlocks,
    });
  }

  // so.sprk.feed.defs#postView
  // - post
  //   - profile
  //     - list basic
  //   - list
  //     - profile
  //       - list basic
  //   - feedgen
  //     - profile
  //       - list basic
  //   - mod service
  //     - profile
  //       - list basic
  async hydratePosts(
    refs: ItemRef[],
    ctx: HydrateCtx,
    state: HydrationState = {},
  ): Promise<HydrationState> {
    const postRefs = refs.filter((ref) =>
      new AtUri(ref.uri).collection === ids.SoSprkFeedPost
    );
    const replyRefs = refs.filter((ref) =>
      new AtUri(ref.uri).collection === ids.SoSprkFeedReply
    );

    state.posts ??= new HydrationMap<Post>();
    state.replies ??= new HydrationMap<Reply>();

    const [postsLayer0, repliesLayer0] = await Promise.all([
      this.feed.getPosts(
        postRefs.map((ref) => ref.uri),
        ctx.includeTakedowns,
        state.posts,
      ),
      this.feed.getReplies(
        replyRefs.map((ref) => ref.uri),
        ctx.includeTakedowns,
        state.replies,
      ),
    ]);

    postsLayer0.forEach((post, uri) => {
      state.posts!.set(uri, post);
    });
    repliesLayer0.forEach((reply, uri) => {
      state.replies!.set(uri, reply);
    });

    const additionalRootUris = rootUrisFromReplies(repliesLayer0).filter(
      (uri) => !state.posts!.has(uri),
    );

    const postsLayer1 = await this.feed.getPosts(
      additionalRootUris,
      ctx.includeTakedowns,
      state.posts,
    );
    postsLayer1.forEach((post, uri) => {
      state.posts!.set(uri, post);
    });

    const threadRefs: ThreadRef[] = [];
    for (const ref of refs) {
      const collection = new AtUri(ref.uri).collection;
      if (collection === ids.SoSprkFeedPost) {
        const post = state.posts!.get(ref.uri);
        if (!post) continue;
        threadRefs.push({
          uri: ref.uri,
          cid: post.cid,
          threadRoot: ref.uri,
        });
      } else if (collection === ids.SoSprkFeedReply) {
        const reply = state.replies!.get(ref.uri);
        if (!reply) continue;
        const rootUri = reply.record.reply?.root.uri ?? ref.uri;
        threadRefs.push({
          uri: ref.uri,
          cid: reply.cid,
          threadRoot: rootUri,
        });
      }
    }

    const authorUris = Array.from(
      new Set<string>([
        ...state.posts!.keys(),
        ...state.replies!.keys(),
      ]),
    );
    const authorDids = authorUris.map(didFromUri);

    const [
      postAggs,
      replyAggs,
      postViewers,
      postBlocks,
      profileState,
      feedGenState,
      threadContexts,
    ] = await Promise.all([
      this.feed.getPostAggregates(postRefs),
      this.feed.getReplyAggregates(replyRefs),
      ctx.viewer
        ? this.feed.getPostViewerStates(threadRefs, ctx.viewer)
        : Promise.resolve<PostViewerStates | undefined>(undefined),
      this.hydratePostBlocks(state.posts!, state.replies!),
      this.hydrateProfiles(authorDids, ctx),
      this.hydrateFeedGens([], ctx),
      this.feed.getThreadContexts(threadRefs),
    ]);

    return mergeManyStates(
      profileState,
      feedGenState,
      {
        posts: state.posts,
        replies: state.replies,
        postAggs,
        replyAggs,
        postViewers,
        postBlocks,
        threadContexts,
        ctx,
      },
    );
  }

  private async hydratePostBlocks(
    posts: Posts,
    replies: Replies,
  ): Promise<PostBlocks> {
    const postBlocks = new HydrationMap<PostBlock>();
    const postBlocksPairs = new Map<string, PostBlockPairs>();
    const relationships: RelationshipPair[] = [];

    for (const [uri, item] of posts) {
      if (!item) continue;
      postBlocksPairs.set(uri, {});
    }

    for (const [uri, item] of replies) {
      if (!item) continue;
      const reply = item.record;
      const creator = didFromUri(uri);
      const pairs = postBlocksPairs.get(uri) ?? {};
      postBlocksPairs.set(uri, pairs);

      const parentUri = reply.reply?.parent.uri;
      const parentDid = parentUri && didFromUri(parentUri);
      if (parentDid && parentDid !== creator) {
        const pair: RelationshipPair = [creator, parentDid];
        relationships.push(pair);
        pairs.parent = pair;
      }

      const rootUri = reply.reply?.root.uri;
      const rootDid = rootUri && didFromUri(rootUri);
      if (rootDid && rootDid !== creator) {
        const pair: RelationshipPair = [creator, rootDid];
        relationships.push(pair);
        pairs.root = pair;
      }
    }

    const blocks = await this.hydrateBidirectionalBlocks(
      pairsToMap(relationships),
    );

    for (const [uri, { embed, parent, root }] of postBlocksPairs) {
      postBlocks.set(uri, {
        embed: !!embed && !!isBlocked(blocks, embed),
        parent: !!parent && !!isBlocked(blocks, parent),
        root: !!root && !!isBlocked(blocks, root),
      });
    }

    return postBlocks;
  }

  // so.sprk.feed.defs#feedViewPost
  // - post (+ replies w/ reply parent author)
  //   - profile
  //     - list basic
  //   - list
  //     - profile
  //       - list basic
  //   - feedgen
  //     - profile
  //       - list basic
  // - repost
  //   - profile
  //     - list basic
  //   - post
  //     - ...
  async hydrateFeedItems(
    items: FeedItem[],
    ctx: HydrateCtx,
  ): Promise<HydrationState> {
    const postUris: string[] = [];
    const replyUris: string[] = [];
    const replyRefs: ItemRef[] = [];

    for (const { post } of items) {
      const collection = new AtUri(post.uri).collection;
      if (collection === ids.SoSprkFeedPost) {
        postUris.push(post.uri);
      } else if (collection === ids.SoSprkFeedReply) {
        replyUris.push(post.uri);
        replyRefs.push(post);
      }
    }

    const [posts, replies] = await Promise.all([
      this.feed.getPosts(postUris, ctx.includeTakedowns),
      this.feed.getReplies(replyUris, ctx.includeTakedowns),
    ]);

    const postAndReplyRefsMap = new Map<string, ItemRef>();
    items.forEach((item) => {
      postAndReplyRefsMap.set(item.post.uri, item.post);
    });

    replies.forEach((reply) => {
      if (!reply?.record.reply) return;
      const { root, parent } = reply.record.reply;
      postAndReplyRefsMap.set(root.uri, root);
      postAndReplyRefsMap.set(parent.uri, parent);
    });

    const postAndReplyRefs = Array.from(postAndReplyRefsMap.values());
    const repostUris = mapDefined(items, (item) => item.repost?.uri);

    const postState = await this.hydratePosts(postAndReplyRefs, ctx, {
      posts,
      replies,
    });

    const replyParentAuthors = Array.from(
      new Set(
        replyRefs
          .map((ref) =>
            postState.replies?.get(ref.uri)?.record.reply?.parent.uri
          )
          .filter((uri): uri is string => !!uri)
          .map(didFromUri),
      ),
    );

    const [repostProfileState, reposts] = await Promise.all([
      this.hydrateProfiles(
        [...repostUris.map(didFromUri), ...replyParentAuthors],
        ctx,
      ),
      this.feed.getReposts(repostUris, ctx.includeTakedowns),
    ]);

    return mergeManyStates(postState, repostProfileState, {
      reposts,
      ctx,
    });
  }

  // so.sprk.feed.defs#threadViewReply
  // - reply
  //   - profile
  //     - list basic
  //   - list
  //     - profile
  //       - list basic
  //   - feedgen
  //     - profile
  //       - list basic
  hydrateThreadPosts(
    refs: ItemRef[],
    ctx: HydrateCtx,
  ): Promise<HydrationState> {
    return this.hydratePosts(refs, ctx);
  }

  // so.sprk.feed.defs#generatorView
  // - feedgen
  //   - profile
  //     - list basic
  async hydrateFeedGens(
    uris: string[], // @TODO any way to get refs here?
    ctx: HydrateCtx,
  ): Promise<HydrationState> {
    const [feedgens, feedgenAggs, feedgenViewers, profileState] = await Promise
      .all([
        this.feed.getFeedGens(uris, ctx.includeTakedowns),
        this.feed.getFeedGenAggregates(
          uris.map((uri) => ({ uri })),
        ),
        ctx.viewer
          ? this.feed.getFeedGenViewerStates(uris, ctx.viewer)
          : undefined,
        this.hydrateProfiles(uris.map(didFromUri), ctx),
      ]);
    return mergeStates(profileState, {
      feedgens,
      feedgenAggs,
      feedgenViewers,
      ctx,
    });
  }

  // so.sprk.feed.getLikes#like
  // - like
  //   - profile
  //     - list basic
  async hydrateLikes(
    authorDid: string,
    uris: string[],
    ctx: HydrateCtx,
  ): Promise<HydrationState> {
    const [likes, profileState] = await Promise.all([
      this.feed.getLikes(uris, ctx.includeTakedowns),
      this.hydrateProfiles(uris.map(didFromUri), ctx),
    ]);

    const pairs: RelationshipPair[] = [];
    for (const [uri, like] of likes) {
      if (like) {
        pairs.push([authorDid, didFromUri(uri)]);
      }
    }
    const blocks = await this.hydrateBidirectionalBlocks(
      pairsToMap(pairs),
    );
    const likeBlocks = new HydrationMap<LikeBlock>();
    for (const [uri, like] of likes) {
      if (like) {
        likeBlocks.set(uri, isBlocked(blocks, [authorDid, didFromUri(uri)]));
      } else {
        likeBlocks.set(uri, null);
      }
    }

    return mergeStates(profileState, { likes, likeBlocks, ctx });
  }

  // so.sprk.feed.getRepostedBy#repostedBy
  // - repost
  //   - profile
  //     - list basic
  async hydrateReposts(uris: string[], ctx: HydrateCtx) {
    const [reposts, profileState] = await Promise.all([
      this.feed.getReposts(uris, ctx.includeTakedowns),
      this.hydrateProfiles(uris.map(didFromUri), ctx),
    ]);
    return mergeStates(profileState, { reposts, ctx });
  }

  // so.sprk.sound.defs#audioView
  // - sound
  //   - profile
  //     - list basic
  async hydrateSounds(
    uris: string[],
    ctx: HydrateCtx,
  ): Promise<HydrationState> {
    const [sounds, soundAggs, profileState] = await Promise.all([
      this.feed.getSounds(uris, ctx.includeTakedowns),
      this.feed.getSoundAggregates(uris.map((uri) => ({ uri }))),
      this.hydrateProfiles(uris.map(didFromUri), ctx),
    ]);
    return mergeStates(profileState, { sounds, soundAggs, ctx });
  }

  // provides partial hydration state within getFollows / getFollowers, mainly for applying rules
  async hydrateFollows(
    uris: string[],
  ): Promise<HydrationState> {
    const follows = await this.graph.getFollows(uris);
    const pairs: RelationshipPair[] = [];
    for (const [uri, follow] of follows) {
      if (follow) {
        pairs.push([didFromUri(uri), follow.record.subject]);
      }
    }
    const blocks = await this.hydrateBidirectionalBlocks(
      pairsToMap(pairs),
    );
    const followBlocks = new HydrationMap<FollowBlock>();
    for (const [uri, follow] of follows) {
      if (follow) {
        followBlocks.set(
          uri,
          isBlocked(blocks, [didFromUri(uri), follow.record.subject]),
        );
      } else {
        followBlocks.set(uri, null);
      }
    }
    return { follows, followBlocks };
  }

  async hydrateBidirectionalBlocks(
    didMap: Map<string, string[]>,
  ): Promise<BidirectionalBlocks> {
    const pairs: RelationshipPair[] = [];
    for (const [source, targets] of didMap) {
      for (const target of targets) {
        pairs.push([source, target]);
      }
    }

    const blocks = await this.graph.getBidirectionalBlocks(pairs);

    const result: BidirectionalBlocks = new HydrationMap<
      HydrationMap<boolean>
    >();
    for (const [source, targets] of didMap) {
      const didBlocks = new HydrationMap<boolean>();
      for (const target of targets) {
        const block = blocks.get(source, target);

        const blockEntry: BlockEntry = {
          blockUri: block?.blockUri,
        };

        didBlocks.set(
          target,
          !!blockEntry.blockUri,
        );
      }
      result.set(source, didBlocks);
    }

    return result;
  }

  // ad-hoc record hydration
  // in com.atproto.repo.getRecord
  async getRecord(uri: string, includeTakedowns = false) {
    const parsed = new AtUri(uri);
    const collection = parsed.collection;
    if (collection === ids.SoSprkFeedPost) {
      return (
        (await this.feed.getPosts([uri], includeTakedowns)).get(uri) ??
          undefined
      );
    } else if (collection === ids.SoSprkFeedReply) {
      return (
        (await this.feed.getReplies([uri], includeTakedowns)).get(uri) ??
          undefined
      );
    } else if (collection === ids.AppBskyFeedRepost) {
      return (
        (await this.feed.getReposts([uri], includeTakedowns)).get(uri) ??
          undefined
      );
    } else if (collection === ids.SoSprkFeedLike) {
      return (
        (await this.feed.getLikes([uri], includeTakedowns)).get(uri) ??
          undefined
      );
    } else if (collection === ids.SoSprkSoundAudio) {
      return (
        (await this.feed.getSounds([uri], includeTakedowns)).get(uri) ??
          undefined
      );
    } else if (collection === ids.AppBskyGraphFollow) {
      return (
        (await this.graph.getFollows([uri], includeTakedowns)).get(uri) ??
          undefined
      );
    } else if (collection === ids.AppBskyGraphBlock) {
      return (
        (await this.graph.getBlocks([uri], includeTakedowns)).get(uri) ??
          undefined
      );
    } else if (
      collection === ids.AppBskyFeedGenerator ||
      collection === ids.SoSprkFeedGenerator
    ) {
      return (
        (await this.feed.getFeedGens([uri], includeTakedowns)).get(uri) ??
          undefined
      );
    } else if (collection === ids.SoSprkActorProfile) {
      const did = parsed.hostname;
      const actor = (
        await this.actor.getActors([did], { includeTakedowns })
      ).get(did);
      if (!actor?.profile || !actor?.profileCid) return undefined;
      const recordInfo: RecordInfo<ProfileRecord> = {
        record: actor.profile,
        cid: actor.profileCid,
        sortedAt: actor.sortedAt ?? new Date(0),
        indexedAt: actor.indexedAt ?? new Date(0),
        takedownRef: actor.profileTakedownRef,
      };

      return recordInfo;
    } else if (collection === ids.SoSprkStoryPost) {
      // Get story records through dataplane
      const res = await this.dataplane.records.getStoryRecords([uri]);
      const storyRecord = res.records[0];
      
      if (!storyRecord || !storyRecord.cid) return undefined;
      
      // Parse the record JSON
      const record = JSON.parse(storyRecord.record);
      if (!record || record === null) return undefined;
      
      const recordInfo: RecordInfo<typeof record> = {
        record,
        cid: storyRecord.cid,
        sortedAt: storyRecord.sortedAt
          ? new Date(storyRecord.sortedAt)
          : new Date(storyRecord.createdAt || storyRecord.indexedAt || 0),
        indexedAt: storyRecord.indexedAt
          ? new Date(storyRecord.indexedAt)
          : new Date(0),
        takedownRef: storyRecord.takedownRef,
      };
      
      return recordInfo;
    }
  }

  createContext = (vals: HydrateCtxVals) => {
    return new HydrateCtx({
      viewer: vals.viewer,
      includeTakedowns: vals.includeTakedowns,
      include3pBlocks: vals.include3pBlocks,
    });
  };

  async resolveUri(uriStr: string) {
    const uri = new AtUri(uriStr);
    const [did] = await this.actor.getDids([uri.host]);
    if (!did) return uriStr;
    uri.host = did;
    return uri.toString();
  }
}

// service refs may look like "did:plc:example#service_id". we want to extract the did part "did:plc:example".
const serviceRefToDid = (serviceRef: string) => {
  const idx = serviceRef.indexOf("#");
  return idx !== -1 ? serviceRef.slice(0, idx) : serviceRef;
};

const rootUrisFromReplies = (replies: Replies): string[] => {
  const uris = new Set<string>();
  for (const item of replies.values()) {
    const rootUri = item && rootUriFromReply(item);
    if (rootUri) {
      uris.add(rootUri);
    }
  }
  return Array.from(uris);
};

const rootUriFromReply = (reply: Reply): string | undefined => {
  return reply.record.reply?.root.uri;
};

const isBlocked = (blocks: BidirectionalBlocks, [a, b]: RelationshipPair) => {
  return blocks.get(a)?.get(b) ?? false;
};

const pairsToMap = (pairs: RelationshipPair[]): Map<string, string[]> => {
  const map = new Map<string, string[]>();
  for (const [a, b] of pairs) {
    const list = map.get(a) ?? [];
    list.push(b);
    map.set(a, list);
  }
  return map;
};

export const mergeStates = (
  stateA: HydrationState,
  stateB: HydrationState,
): HydrationState => {
  assert(
    !stateA.ctx?.viewer ||
      !stateB.ctx?.viewer ||
      stateA.ctx?.viewer === stateB.ctx?.viewer,
    "incompatible viewers",
  );
  return {
    ctx: stateA.ctx ?? stateB.ctx,
    actors: mergeMaps(stateA.actors, stateB.actors),
    profileAggs: mergeMaps(stateA.profileAggs, stateB.profileAggs),
    profileViewers: mergeMaps(stateA.profileViewers, stateB.profileViewers),
    posts: mergeMaps(stateA.posts, stateB.posts),
    replies: mergeMaps(stateA.replies, stateB.replies),
    postAggs: mergeMaps(stateA.postAggs, stateB.postAggs),
    replyAggs: mergeMaps(stateA.replyAggs, stateB.replyAggs),
    postViewers: mergeMaps(stateA.postViewers, stateB.postViewers),
    threadContexts: mergeMaps(stateA.threadContexts, stateB.threadContexts),
    sounds: mergeMaps(stateA.sounds, stateB.sounds),
    soundAggs: mergeMaps(stateA.soundAggs, stateB.soundAggs),
    postBlocks: mergeMaps(stateA.postBlocks, stateB.postBlocks),
    reposts: mergeMaps(stateA.reposts, stateB.reposts),
    follows: mergeMaps(stateA.follows, stateB.follows),
    followBlocks: mergeMaps(stateA.followBlocks, stateB.followBlocks),
    likes: mergeMaps(stateA.likes, stateB.likes),
    likeBlocks: mergeMaps(stateA.likeBlocks, stateB.likeBlocks),
    feedgens: mergeMaps(stateA.feedgens, stateB.feedgens),
    feedgenAggs: mergeMaps(stateA.feedgenAggs, stateB.feedgenAggs),
    feedgenViewers: mergeMaps(stateA.feedgenViewers, stateB.feedgenViewers),
    knownFollowers: mergeMaps(stateA.knownFollowers, stateB.knownFollowers),
    videoMappings: mergeMaps(stateA.videoMappings, stateB.videoMappings),
  };
};

export const mergeManyStates = (...states: HydrationState[]) => {
  return states.reduce(mergeStates, {} as HydrationState);
};
