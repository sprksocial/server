import assert from "node:assert";
import { mapDefined } from "@atproto/common";
import { AtUri } from "@atproto/syntax";
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
  Reposts,
  ThreadContexts,
  ThreadRef,
  VideoMappings,
} from "./feed.ts";
import {
  BlockEntry,
  Follows,
  GraphHydrator,
  RelationshipPair,
} from "./graph.ts";
import {
  HydrationMap,
  ItemRef,
  mergeManyMaps,
  mergeMaps,
  RecordInfo,
} from "./util.ts";
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
  postAggs?: PostAggs;
  postViewers?: PostViewerStates;
  threadContexts?: ThreadContexts;
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

  constructor(
    public dataplane: DataPlane,
  ) {
    this.actor = new ActorHydrator(dataplane);
    this.feed = new FeedHydrator(dataplane);
    this.graph = new GraphHydrator(dataplane);
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
    const uris = refs.map((ref) => ref.uri);

    state.posts ??= new HydrationMap<Post>();
    const addPostsToHydrationState = (posts: Posts) => {
      posts.forEach((post, uri) => {
        state.posts ??= new HydrationMap<Post>();
        state.posts.set(uri, post);
      });
    };

    // layer 0: the posts in the thread
    const postsLayer0 = await this.feed.getPosts(
      uris,
      ctx.includeTakedowns,
      state.posts,
    );
    addPostsToHydrationState(postsLayer0);

    const additionalRootUris = rootUrisFromPosts(postsLayer0); // supports computing threadgates
    const threadRootUris = new Set<string>();
    for (const [uri, post] of postsLayer0) {
      if (post) {
        threadRootUris.add(rootUriFromPost(post) ?? uri);
      }
    }

    // fetch additional root URIs for threadgates
    const postsLayer1 = await this.feed.getPosts(
      additionalRootUris,
      ctx.includeTakedowns,
      state.posts,
    );
    addPostsToHydrationState(postsLayer1);

    const posts = mergeManyMaps(postsLayer0, postsLayer1) ?? postsLayer0;
    const allPostUris = [...posts.keys()];
    const allRefs = refs;
    const threadRefs = allRefs.map((ref) => ({
      ...ref,
      threadRoot: posts.get(ref.uri)?.record.reply?.root.uri ?? ref.uri,
    }));

    const [
      postAggs,
      postViewers,
      postBlocks,
      profileState,
      feedGenState,
    ] = await Promise.all([
      this.feed.getPostAggregates(allRefs),
      ctx.viewer
        ? this.feed.getPostViewerStates(threadRefs, ctx.viewer)
        : undefined,
      this.hydratePostBlocks(posts),
      this.hydrateProfiles(allPostUris.map(didFromUri), ctx),
      this.hydrateFeedGens([], ctx),
    ]);
    // combine all hydration state
    return mergeManyStates(
      profileState,
      feedGenState,
      {
        posts,
        postAggs,
        postViewers,
        postBlocks,
        ctx,
      },
    );
  }

  private async hydratePostBlocks(
    posts: Posts,
  ): Promise<PostBlocks> {
    const postBlocks = new HydrationMap<PostBlock>();
    const postBlocksPairs = new Map<string, PostBlockPairs>();
    const relationships: RelationshipPair[] = [];
    for (const [uri, item] of posts) {
      if (!item) continue;
      const post = item.record;
      const creator = didFromUri(uri);
      const postBlockPairs: PostBlockPairs = {};
      postBlocksPairs.set(uri, postBlockPairs);
      // 3p block for replies
      const parentUri = post.reply?.parent.uri;
      const parentDid = parentUri && didFromUri(parentUri);
      if (parentDid && parentDid !== creator) {
        const pair: RelationshipPair = [creator, parentDid];
        relationships.push(pair);
        postBlockPairs.parent = pair;
      }
      const rootUri = post.reply?.root.uri;
      const rootDid = rootUri && didFromUri(rootUri);
      if (rootDid && rootDid !== creator) {
        const pair: RelationshipPair = [creator, rootDid];
        relationships.push(pair);
        postBlockPairs.root = pair;
      }
      // No embed blocking - nested record logic removed
    }
    // replace embed/parent/root pairs with block state
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
    // get posts, collect reply refs
    const posts = await this.feed.getPosts(
      items.map((item) => item.post.uri),
      ctx.includeTakedowns,
    );
    const rootUris: string[] = [];
    const parentUris: string[] = [];
    const postAndReplyRefs: ItemRef[] = [];
    posts.forEach((post, uri) => {
      if (!post) return;
      postAndReplyRefs.push({ uri, cid: post.cid });
      if (post.record.reply) {
        rootUris.push(post.record.reply.root.uri);
        parentUris.push(post.record.reply.parent.uri);
        postAndReplyRefs.push(post.record.reply.root, post.record.reply.parent);
      }
    });
    // get replies, collect reply parent authors
    const replies = await this.feed.getPosts(
      [...rootUris, ...parentUris],
      ctx.includeTakedowns,
    );
    const replyParentAuthors: string[] = [];
    parentUris.forEach((uri) => {
      const parent = replies.get(uri);
      if (!parent?.record.reply) return;
      replyParentAuthors.push(didFromUri(parent.record.reply.parent.uri));
    });
    // hydrate state for all posts, reposts, authors of reposts + reply parent authors
    const repostUris = mapDefined(items, (item) => item.repost?.uri);
    const [postState, repostProfileState, reposts] = await Promise.all([
      this.hydratePosts(postAndReplyRefs, ctx, {
        posts: posts.merge(replies), // avoids refetches of posts
      }),
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

  // so.sprk.feed.defs#threadViewPost
  // - post
  //   - profile
  //     - list basic
  //   - list
  //     - profile
  //       - list basic
  //   - feedgen
  //     - profile
  //       - list basic
  async hydrateThreadPosts(
    refs: ItemRef[],
    ctx: HydrateCtx,
  ): Promise<HydrationState> {
    const postsState = await this.hydratePosts(refs, ctx);

    const { posts } = postsState;
    const postsList = posts ? Array.from(posts.entries()) : [];

    const isDefined = (
      entry: [string, Post | null],
    ): entry is [string, Post] => {
      const [, post] = entry;
      return !!post;
    };

    const threadRefs: ThreadRef[] = postsList
      .filter(isDefined)
      .map(([uri, post]) => ({
        uri,
        cid: post.cid,
        threadRoot: post.record.reply?.root.uri ?? uri,
      }));

    const threadContexts = await this.feed.getThreadContexts(threadRefs);

    return mergeStates(postsState, { threadContexts });
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

const rootUrisFromPosts = (posts: Posts): string[] => {
  const uris: string[] = [];
  for (const item of posts.values()) {
    const rootUri = item && rootUriFromPost(item);
    if (rootUri) {
      uris.push(rootUri);
    }
  }
  return uris;
};

const rootUriFromPost = (post: Post): string | undefined => {
  return post.record.reply?.root.uri;
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
    postAggs: mergeMaps(stateA.postAggs, stateB.postAggs),
    postViewers: mergeMaps(stateA.postViewers, stateB.postViewers),
    threadContexts: mergeMaps(stateA.threadContexts, stateB.threadContexts),
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
