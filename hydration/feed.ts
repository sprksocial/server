import * as so from "../lex/so.ts";
import * as fm from "../lex/fm.ts";
import { AtUri } from "@atp/syntax";
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
import { Record as DataPlaneRecord } from "../data-plane/routes/records.ts";

export type FeedGenRecord = so.sprk.feed.generator.Main;
export type LikeRecord = so.sprk.feed.like.Main;
export type PostRecord = so.sprk.feed.post.Main;
export type ReplyRecord = so.sprk.feed.reply.Main;
export type RepostRecord = so.sprk.feed.repost.Main;
export type AudioRecord = so.sprk.sound.audio.Main;
export type PlyrTrackRecord = fm.plyr.track.Main;
export type SoundRecord = AudioRecord | PlyrTrackRecord;

export type Post = RecordInfo<PostRecord>;
export type Posts = HydrationMap<Post>;
export type Reply = RecordInfo<ReplyRecord>;
export type Replies = HydrationMap<Reply>;
export type Sound = RecordInfo<SoundRecord>;
export type Sounds = HydrationMap<Sound>;

export type SoundAgg = {
  uses: number;
};

export type SoundAggs = HydrationMap<SoundAgg>;

export type PostViewerState = {
  like?: string;
  repost?: string;
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

export type ReplyAgg = {
  likes: number;
  replies: number;
};

export type ReplyAggs = HydrationMap<ReplyAgg>;

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

export type KnownInteractionState = {
  type: "like" | "repost" | "reply";
  by: string; // DID of the person who interacted
  uri: string;
  cid: string;
  indexedAt: Date;
  text?: string; // Only for replies
};

export type KnownInteractionsStates = HydrationMap<
  KnownInteractionState[] | undefined
>;

export type ThreadRef = ItemRef & { threadRoot: string };

export type FeedItem = {
  post: ItemRef;
};

export class FeedHydrator {
  constructor(public dataplane: DataPlane) {}

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
      const record = parseRecord<PostRecord>(
        so.sprk.feed.post.main,
        res.records[i],
        includeTakedowns,
      );
      return acc.set(
        uri,
        record ? record : null,
      );
    }, base);
  }

  async getReplies(
    uris: string[],
    includeTakedowns = false,
    given = new HydrationMap<Reply>(),
  ): Promise<Replies> {
    const [have, need] = split(uris, (uri) => given.has(uri));
    const base = have.reduce(
      (acc, uri) => acc.set(uri, given.get(uri) ?? null),
      new HydrationMap<Reply>(),
    );
    if (!need.length) return base;
    const res = await this.dataplane.records.getReplyRecords(need);

    return need.reduce((acc, uri, i) => {
      const record = parseRecord<ReplyRecord>(
        so.sprk.feed.reply.main,
        res.records[i],
        includeTakedowns,
      );
      return acc.set(
        uri,
        record ? record : null,
      );
    }, base);
  }

  async getSounds(
    uris: string[],
    includeTakedowns = false,
    given = new HydrationMap<Sound>(),
  ): Promise<Sounds> {
    const [have, need] = split(uris, (uri) => given.has(uri));
    const base = have.reduce(
      (acc, uri) => acc.set(uri, given.get(uri) ?? null),
      new HydrationMap<Sound>(),
    );
    if (!need.length) return base;
    const res = await this.dataplane.records.getRecords(need);

    return need.reduce((acc, uri, i) => {
      const record = parseSoundRecord(res.records[i], includeTakedowns);
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

  async getReplyAggregates(
    refs: ItemRef[],
  ): Promise<ReplyAggs> {
    if (!refs.length) return new HydrationMap<ReplyAgg>();
    const counts = await this.dataplane.interactions.getInteractionCounts(refs);
    return refs.reduce((acc, { uri }, i) => {
      return acc.set(uri, {
        likes: counts.likes[i] ?? 0,
        replies: counts.replies[i] ?? 0,
      });
    }, new HydrationMap<ReplyAgg>());
  }

  async getSoundAggregates(
    refs: ItemRef[],
  ): Promise<SoundAggs> {
    if (!refs.length) return new HydrationMap<SoundAgg>();
    const uris = refs.map((ref) => ref.uri);
    const counts = await this.dataplane.interactions.getSoundUsageCounts(uris);
    return refs.reduce((acc, { uri }, i) => {
      return acc.set(uri, {
        uses: counts.uses[i] ?? 0,
      });
    }, new HydrationMap<SoundAgg>());
  }

  async getFeedGens(
    uris: string[],
    includeTakedowns = false,
  ): Promise<FeedGens> {
    if (!uris.length) return new HydrationMap<FeedGen>();
    const res = await this.dataplane.records.getFeedGeneratorRecords(uris);
    return uris.reduce((acc, uri, i) => {
      const record = parseRecord<FeedGenRecord>(
        so.sprk.feed.generator.main,
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
      const record = parseRecord<LikeRecord>(
        so.sprk.feed.like.main,
        res.records[i],
        includeTakedowns,
      );
      return acc.set(uri, record ?? null);
    }, new HydrationMap<Like>());
  }

  async getReposts(uris: string[], includeTakedowns = false): Promise<Reposts> {
    if (!uris.length) return new HydrationMap<Repost>();
    const res = await this.dataplane.records.getRepostRecords(uris);
    return uris.reduce((acc, uri, i) => {
      const record = parseRecord<RepostRecord>(
        so.sprk.feed.repost.main,
        res.records[i],
        includeTakedowns,
      );
      return acc.set(uri, record ?? null);
    }, new HydrationMap<Repost>());
  }

  async getKnownInteractions(
    refs: ItemRef[],
    viewer: string | null,
  ): Promise<KnownInteractionsStates> {
    if (!viewer || !refs.length) {
      return new HydrationMap<KnownInteractionState[] | undefined>();
    }

    const subjectUris = refs.map((ref) => ref.uri);
    const { results } = await this.dataplane.interactions.getKnownInteractions(
      viewer,
      subjectUris,
    );

    return refs.reduce((acc, { uri }) => {
      const interactions = results.get(uri);
      return acc.set(
        uri,
        interactions && interactions.length > 0
          ? interactions.map((i) => ({
            type: i.type,
            by: i.authorDid,
            uri: i.uri,
            cid: i.cid,
            indexedAt: new Date(i.indexedAt),
            text: i.text,
          }))
          : undefined,
      );
    }, new HydrationMap<KnownInteractionState[] | undefined>());
  }
}

const parseSoundRecord = (
  record: DataPlaneRecord,
  includeTakedowns: boolean,
): Sound | undefined => {
  const collection = new AtUri(record.uri).collection;
  if (collection === fm.plyr.track.$type) {
    return parseRecord<PlyrTrackRecord>(
      fm.plyr.track.main,
      record,
      includeTakedowns,
    );
  }
  return parseRecord<AudioRecord>(
    so.sprk.sound.audio.main,
    record,
    includeTakedowns,
  );
};
