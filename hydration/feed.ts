import { Record as FeedGenRecord } from "../lex/types/app/bsky/feed/generator.ts";
import { Record as LikeRecord } from "../lex/types/so/sprk/feed/like.ts";
import { Record as PostRecord } from "../lex/types/so/sprk/feed/post.ts";
import { Record as RepostRecord } from "../lex/types/app/bsky/feed/repost.ts";
import { VideoMappingDocument } from "../data-plane/db/models.ts";
import { uriToDid as didFromUri } from "../utils/uris.ts";
import {
  HydrationMap,
  ItemRef,
  parseRecord,
  parseString,
  RecordInfo,
  split,
} from "./util.ts";
import { DataPlane } from "../data-plane/index.ts";

export type Post = RecordInfo<PostRecord>;
export type Posts = HydrationMap<Post>;

export type VideoMapping = VideoMappingDocument;
export type VideoMappings = HydrationMap<VideoMapping>;

export type PostViewerState = {
  like?: string;
  repost?: string;
  threadMuted?: boolean;
};

export type PostViewerStates = HydrationMap<PostViewerState>;

export type ThreadContext = {
  // Whether the root author has liked the post.
  like?: string;
};

export type ThreadContexts = HydrationMap<ThreadContext>;

export type PostAgg = {
  likes: number;
  replies: number;
  reposts: number;
};

export type PostAggs = HydrationMap<PostAgg>;

export type Like = RecordInfo<LikeRecord>;
export type Likes = HydrationMap<Like>;

export type Repost = RecordInfo<RepostRecord>;
export type Reposts = HydrationMap<Repost>;

export type FeedGenAgg = {
  likes: number;
};

export type FeedGenAggs = HydrationMap<FeedGenAgg>;

export type FeedGen = RecordInfo<FeedGenRecord>;
export type FeedGens = HydrationMap<FeedGen>;

export type FeedGenViewerState = {
  like?: string;
};

export type FeedGenViewerStates = HydrationMap<FeedGenViewerState>;

export type ThreadRef = ItemRef & { threadRoot: string };

// @NOTE the feed item types in the protos for author feeds and timelines
// technically have additional fields, not supported by the mock dataplane.
export type FeedItem = {
  post: ItemRef;
  repost?: ItemRef;
  /**
   * If true, overrides the `reason` with `app.bsky.feed.defs#reasonPin`. Used
   * only in author feeds.
   */
  authorPinned?: boolean;
};

export class FeedHydrator {
  constructor(public dataplane: DataPlane) {}

  getVideoMappings(
    keys: string[],
  ): VideoMappings {
    if (!keys.length) return new HydrationMap<VideoMapping>();

    // This would need to be implemented in the dataplane client
    // For now, return empty mappings
    return new HydrationMap<VideoMapping>();
  }

  async getPosts(
    uris: string[],
    includeTakedowns = false,
    given = new HydrationMap<Post>(),
  ): Promise<Posts> {
    const [have, need] = split(uris, (uri) => given.has(uri));
    const base = have.reduce(
      (acc, uri) => acc.set(uri, given.get(uri) ?? null),
      new HydrationMap<Post>(),
    );
    if (!need.length) return base;
    const res = await this.dataplane.records.getPostRecords(need);

    return need.reduce((acc, uri, i) => {
      const record = parseRecord<PostRecord>(res.records[i], includeTakedowns);
      return acc.set(
        uri,
        record ? record : null,
      );
    }, base);
  }

  async getPostViewerStates(
    refs: ThreadRef[],
    viewer: string,
  ): Promise<PostViewerStates> {
    if (!refs.length) return new HydrationMap<PostViewerState>();
    const [likes, reposts] = await Promise.all([
      await this.dataplane.likes.byActorAndSubjects(viewer, refs),
      await this.dataplane.reposts.byActorAndSubjects(
        viewer,
        refs,
      ),
    ]);
    return refs.reduce((acc, { uri }, i) => {
      return acc.set(uri, {
        like: parseString(likes.uris[i]),
        repost: parseString(reposts.uris[i]),
      });
    }, new HydrationMap<PostViewerState>());
  }

  async getThreadContexts(refs: ThreadRef[]): Promise<ThreadContexts> {
    if (!refs.length) return new HydrationMap<ThreadContext>();

    const refsByRootAuthor = refs.reduce((acc, ref) => {
      const { threadRoot } = ref;
      const rootAuthor = didFromUri(threadRoot);
      const existingValue = acc.get(rootAuthor) ?? [];
      return acc.set(rootAuthor, [...existingValue, ref]);
    }, new Map<string, ThreadRef[]>());
    const refsByRootAuthorEntries = Array.from(refsByRootAuthor.entries());

    const likesPromises = refsByRootAuthorEntries.map(
      ([rootAuthor, refsForAuthor]) =>
        this.dataplane.likes.byActorAndSubjects(
          rootAuthor,
          refsForAuthor.map(({ uri, cid }) => ({ uri, cid })),
        ),
    );

    const rootAuthorsLikes = await Promise.all(likesPromises);

    const likesByUri = refsByRootAuthorEntries.reduce(
      (acc, [_rootAuthor, refsForAuthor], i) => {
        const likesForRootAuthor = rootAuthorsLikes[i];
        refsForAuthor.forEach(({ uri }, j) => {
          acc.set(uri, likesForRootAuthor.uris[j]);
        });
        return acc;
      },
      new Map<string, string>(),
    );

    return refs.reduce((acc, { uri }) => {
      return acc.set(uri, {
        like: parseString(likesByUri.get(uri)),
      });
    }, new HydrationMap<ThreadContext>());
  }

  async getPostAggregates(
    refs: ItemRef[],
  ): Promise<PostAggs> {
    if (!refs.length) return new HydrationMap<PostAgg>();
    const counts = await this.dataplane.interactions.getInteractionCounts(refs);
    return refs.reduce((acc, { uri }, i) => {
      return acc.set(uri, {
        likes: counts.likes[i] ?? 0,
        reposts: counts.reposts[i] ?? 0,
        replies: counts.replies[i] ?? 0,
      });
    }, new HydrationMap<PostAgg>());
  }

  async getFeedGens(
    uris: string[],
    includeTakedowns = false,
  ): Promise<FeedGens> {
    if (!uris.length) return new HydrationMap<FeedGen>();
    const res = await this.dataplane.records.getFeedGeneratorRecords(uris);
    return uris.reduce((acc, uri, i) => {
      const record = parseRecord<FeedGenRecord>(
        res.records[i],
        includeTakedowns,
      );
      return acc.set(uri, record ?? null);
    }, new HydrationMap<FeedGen>());
  }

  async getFeedGenViewerStates(
    uris: string[],
    viewer: string,
  ): Promise<FeedGenViewerStates> {
    if (!uris.length) return new HydrationMap<FeedGenViewerState>();
    const likes = await this.dataplane.likes.byActorAndSubjects(
      viewer,
      uris.map((uri) => ({ uri })),
    );
    return uris.reduce((acc, uri, i) => {
      return acc.set(uri, {
        like: parseString(likes.uris[i]),
      });
    }, new HydrationMap<FeedGenViewerState>());
  }

  async getFeedGenAggregates(
    refs: ItemRef[],
  ): Promise<FeedGenAggs> {
    if (!refs.length) return new HydrationMap<FeedGenAgg>();
    const counts = await this.dataplane.interactions.getInteractionCounts(refs);
    return refs.reduce((acc, { uri }, i) => {
      return acc.set(uri, {
        likes: counts.likes[i] ?? 0,
      });
    }, new HydrationMap<FeedGenAgg>());
  }

  async getLikes(uris: string[], includeTakedowns = false): Promise<Likes> {
    if (!uris.length) return new HydrationMap<Like>();
    const res = await this.dataplane.records.getLikeRecords(uris);
    return uris.reduce((acc, uri, i) => {
      const record = parseRecord<LikeRecord>(res.records[i], includeTakedowns);
      return acc.set(uri, record ?? null);
    }, new HydrationMap<Like>());
  }

  async getReposts(uris: string[], includeTakedowns = false): Promise<Reposts> {
    if (!uris.length) return new HydrationMap<Repost>();
    const res = await this.dataplane.records.getRepostRecords(uris);
    return uris.reduce((acc, uri, i) => {
      const record = parseRecord<RepostRecord>(
        res.records[i],
        includeTakedowns,
      );
      return acc.set(uri, record ?? null);
    }, new HydrationMap<Repost>());
  }
}
