import { AtUri, ComAtprotoRepoStrongRef } from "@atproto/api";
import { HydrationState } from "../hydration/index.ts";
import {
  FeedViewPost,
  isPostView,
  isReplyView,
  PostView,
  ReasonPin,
  ReasonRepost,
  ReplyRef,
  ReplyView,
  ThreadContext,
  ThreadViewPost,
} from "../lex/types/so/sprk/feed/defs.ts";
import { StoriesByAuthor, StoryView } from "../lex/types/so/sprk/story/defs.ts";
import {
  isRecord as isReplyRecord,
  Record as ReplyRecord,
} from "../lex/types/so/sprk/feed/reply.ts";
import { ids } from "../lex/lexicons.ts";
import {
  KnownFollowers,
  ProfileView,
  ProfileViewBasic,
  ProfileViewDetailed,
  ViewerState as ProfileViewer,
} from "../lex/types/so/sprk/actor/defs.ts";
import {
  BlockedPost,
  GeneratorView,
  ImagesMedia,
  ImagesMediaView,
  isImagesMedia,
  isVideoMedia,
  MaybePostView,
  Media,
  MediaView,
  NotFoundPost,
  VideoMedia,
  VideoMediaView,
} from "./types.ts";
import {
  isMain as isImageMedia,
  Main as ImageMedia,
  View as ImageView,
} from "../lex/types/so/sprk/media/image.ts";
import {
  isMain as isVideoMediaMain,
} from "../lex/types/so/sprk/media/video.ts";
import type { Main as VideoMediaMainType } from "../lex/types/so/sprk/media/video.ts";
import { AudioView } from "../lex/types/so/sprk/sound/defs.ts";
import { INVALID_HANDLE } from "@atp/syntax";
import { cidFromBlobJson } from "./util.ts";
import { uriToDid } from "../utils/uris.ts";
import { mapDefined } from "@atp/common";
import { FeedItem, Repost } from "../hydration/feed.ts";
import {
  QueryParams as GetThreadQueryParams,
  ThreadItem,
} from "../lex/types/so/sprk/feed/getPostThread.ts";
import { $Typed, Un$Typed } from "../lex/util.ts";
import { BlobRef } from "@atp/lexicon";

export class Views {
  public indexedAtEpoch?: Date | undefined;

  private videoCdn?: string;
  private mediaCdn?: string;
  private thumbCdn?: string;

  constructor(
    opts: {
      indexedAtEpoch?: Date | undefined;
      videoCdn?: string;
      mediaCdn?: string;
      thumbCdn?: string;
    },
  ) {
    this.indexedAtEpoch = opts?.indexedAtEpoch;
    this.videoCdn = opts?.videoCdn;
    this.mediaCdn = opts?.mediaCdn;
    this.thumbCdn = opts?.thumbCdn;
  }

  thread(
    skeleton: { anchor: string; uris: string[] },
    state: HydrationState,
    opts: {
      depth?: GetThreadQueryParams["depth"];
    } = {},
  ): ThreadItem[] {
    const maxDepth = opts.depth !== undefined && opts.depth >= 0
      ? opts.depth
      : undefined;
    const depthCache = new Map<string, number>();
    depthCache.set(skeleton.anchor, 0);

    const computeDepth = (uri: string, stack = new Set<string>()): number => {
      const cached = depthCache.get(uri);
      if (cached !== undefined) return cached;

      if (stack.has(uri)) {
        depthCache.set(uri, 0);
        return 0;
      }

      stack.add(uri);

      const replyInfo = state.replies?.get(uri) ?? undefined;
      const parentUri = replyInfo?.record.reply?.parent.uri;
      if (!parentUri) {
        depthCache.set(uri, 0);
        stack.delete(uri);
        return 0;
      }

      const depth = computeDepth(parentUri, stack) + 1;
      depthCache.set(uri, depth);
      stack.delete(uri);
      return depth;
    };

    const items: ThreadItem[] = [];
    for (const uri of skeleton.uris) {
      const depth = computeDepth(uri);
      if (!Number.isFinite(depth)) continue;
      if (maxDepth !== undefined && depth > maxDepth) continue;

      const value = this.threadItemValue(uri, state);
      items.push({
        $type: "so.sprk.feed.getPostThread#threadItem",
        uri,
        depth,
        value,
      });
    }

    return items;
  }

  threadItemValue(
    uri: string,
    state: HydrationState,
  ): ThreadItem["value"] {
    const authorDid = uriToDid(uri);

    if (!state.ctx?.include3pBlocks) {
      const blockInfo = state.postBlocks?.get(uri) ?? undefined;
      if (blockInfo && (blockInfo.parent || blockInfo.root)) {
        return this.blockedPost(uri, authorDid, state);
      }
    }

    if (this.viewerBlockExists(authorDid, state)) {
      return this.blockedPost(uri, authorDid, state);
    }

    const threadViewPost = this.threadViewPost(uri, state);
    if (threadViewPost) {
      return threadViewPost;
    }
    return this.notFoundPost(uri);
  }

  threadViewPost(
    uri: string,
    state: HydrationState,
  ): $Typed<ThreadViewPost> | undefined {
    const postView = this.post(uri, state) ??
      this.reply(uri, state);
    if (postView) {
      return {
        $type: "so.sprk.feed.defs#threadViewPost",
        post: postView,
        threadContext: this.threadContext(uri, state),
      } as $Typed<ThreadViewPost>;
    }
  }

  threadContext(
    uri: string,
    state: HydrationState,
  ): ThreadContext | undefined {
    const context = state.threadContexts?.get(uri) ?? undefined;
    if (!context) return undefined;
    const { like } = context;
    return {
      $type: "so.sprk.feed.defs#threadContext",
      ...(like ? { rootAuthorLike: like } : {}),
    };
  }

  post(
    uri: string,
    state: HydrationState,
  ): Un$Typed<PostView> | undefined {
    const recordInfo = state.posts?.get(uri) ?? state.replies?.get(uri);
    if (!recordInfo) return;

    const parsedUri = new AtUri(uri);
    const collection = parsedUri.collection;
    const isReply = collection === ids.SoSprkFeedReply;
    const authorDid = parsedUri.hostname;
    const author = this.profileBasic(authorDid, state);
    if (!author) return;

    const postAgg = state.postAggs?.get(uri);
    const replyAgg = state.replyAggs?.get(uri);
    const repliesCount = isReply
      ? replyAgg?.replies ?? 0
      : postAgg?.replies ?? 0;
    const likeCount = isReply ? replyAgg?.likes ?? 0 : postAgg?.likes ?? 0;
    const repostCount = !isReply ? postAgg?.reposts ?? 0 : undefined;
    const viewer = state.postViewers?.get(uri);
    const mediaRecord = !isReply && "media" in recordInfo.record
      ? recordInfo.record.media
      : undefined;

    const soundRecord = "sound" in recordInfo.record
      ? recordInfo.record.sound as ComAtprotoRepoStrongRef.Main
      : undefined;

    return {
      uri,
      cid: recordInfo.cid,
      author,
      record: recordInfo.record,
      media: mediaRecord ? this.media(uri, mediaRecord as Media) : undefined,
      sound: soundRecord ? this.soundView(soundRecord.uri, state) : undefined,
      replyCount: repliesCount,
      repostCount,
      likeCount,
      indexedAt: this.indexedAt(recordInfo)?.toISOString() ??
        new Date().toISOString(),
      viewer: viewer
        ? {
          repost: viewer.repost,
          like: viewer.like,
        }
        : undefined,
    };
  }

  reply(
    uri: string,
    state: HydrationState,
  ): Un$Typed<ReplyView> | undefined {
    const replyInfo = state.replies?.get(uri);
    if (!replyInfo) return;

    const parsedUri = new AtUri(uri);
    const authorDid = parsedUri.hostname;
    const author = this.profileBasic(authorDid, state);
    if (!author) return;

    const aggs = state.replyAggs?.get(uri);
    const viewer = state.postViewers?.get(uri);

    return {
      uri,
      cid: replyInfo.cid,
      author,
      record: replyInfo.record,
      media: replyInfo.record.media
        ? this.imageMedia(uri, replyInfo.record.media as ImageMedia)
        : undefined,
      replyCount: aggs?.replies ?? 0,
      likeCount: aggs?.likes ?? 0,
      indexedAt: this.indexedAt(replyInfo)?.toISOString() ??
        new Date().toISOString(),
      viewer: viewer
        ? {
          repost: viewer.repost,
          like: viewer.like,
        }
        : undefined,
    };
  }

  story(
    uri: string,
    state: HydrationState,
  ): Un$Typed<StoryView> | undefined {
    const storyInfo = state.stories?.get(uri);
    if (!storyInfo) return;

    const parsedUri = new AtUri(uri);
    const authorDid = parsedUri.hostname;
    const author = this.profileBasic(authorDid, state);
    if (!author) return;

    const mediaRecord = storyInfo.record.media;

    return {
      uri,
      cid: storyInfo.cid,
      author,
      record: storyInfo.record,
      media: mediaRecord ? this.storyMedia(uri, mediaRecord) : undefined,
      indexedAt: this.indexedAt(storyInfo)?.toISOString() ??
        new Date().toISOString(),
    };
  }

  storiesByAuthor(
    stories: StoryView[],
  ): StoriesByAuthor[] {
    if (stories.length === 0) {
      return [];
    }

    // Group stories by author
    const storiesGroupedByAuthor = new Map<string, {
      author: ProfileViewBasic;
      stories: StoryView[];
    }>();

    for (const story of stories) {
      const authorDid = story.author.did;

      if (!storiesGroupedByAuthor.has(authorDid)) {
        storiesGroupedByAuthor.set(authorDid, {
          author: story.author,
          stories: [],
        });
      }

      storiesGroupedByAuthor.get(authorDid)!.stories.push(story);
    }

    // Convert to array and sort stories within each group
    const storiesByAuthor = Array.from(storiesGroupedByAuthor.values()).map(
      (group) => ({
        author: group.author,
        stories: group.stories.sort(
          (a, b) =>
            new Date(a.indexedAt).getTime() - new Date(b.indexedAt).getTime(),
        ),
      }),
    );

    // Sort author groups by the latest story from each author (newest first)
    storiesByAuthor.sort((a, b) => {
      const latestA = Math.max(
        ...a.stories.map((s) => new Date(s.indexedAt).getTime()),
      );
      const latestB = Math.max(
        ...b.stories.map((s) => new Date(s.indexedAt).getTime()),
      );
      return latestB - latestA;
    });

    return storiesByAuthor;
  }

  storyMedia(
    storyUri: string,
    media: $Typed<ImageMedia> | $Typed<VideoMedia> | { $type: string },
  ): (ImageView | VideoMediaView) & { $type: string } | undefined {
    const authorDid = uriToDid(storyUri);

    // Check if it's an image media
    if (isImageMedia(media)) {
      return this.imageMedia(authorDid, media);
    }

    // Check if it's a video media
    if (isVideoMediaMain(media)) {
      const videoMedia = media as VideoMediaMainType;
      return this.videoMedia(authorDid, videoMedia);
    }

    return undefined;
  }

  feedViewPost(
    item: FeedItem,
    state: HydrationState,
  ): FeedViewPost | undefined {
    let reason;
    if (item.authorPinned) {
      reason = this.reasonPin();
    } else if (item.repost) {
      const repost = state.reposts?.get(item.repost.uri);
      if (!repost || !repost?.record.subject) return;
      if (repost.record.subject.uri !== item.post.uri) return;
      reason = this.reasonRepost(item.repost.uri, repost, state);
      if (!reason) return;
    }
    const post = this.post(item.post.uri, state);
    if (!post) return;
    return {
      post,
      reason,
    };
  }

  replyRef(uri: string, state: HydrationState): ReplyRef | undefined {
    const replyRecord = state.replies?.get(uri)?.record;
    if (!replyRecord?.reply) return;

    let root = this.maybePost(replyRecord.reply.root.uri, state);
    let parent = this.maybePost(replyRecord.reply.parent.uri, state);
    const parentForContext = parent;

    if (!state.ctx?.include3pBlocks) {
      const childBlocks = state.postBlocks?.get(uri) ?? undefined;
      const parentBlocks = state.postBlocks?.get(parent.uri) ?? undefined;

      if (
        (isPostView(parent) || isReplyView(parent)) &&
        childBlocks?.parent
      ) {
        parent = this.blockedPost(parent.uri, parent.author.did, state);
      }

      if (
        (isPostView(root) || isReplyView(root)) &&
        (childBlocks?.root || parentBlocks?.root)
      ) {
        root = this.blockedPost(root.uri, root.author.did, state);
      }
    }

    let grandparentAuthor: ProfileViewBasic | undefined;
    if (
      isReplyView(parentForContext) &&
      isReplyRecord(parentForContext.record)
    ) {
      const grandparentUri =
        (parentForContext.record as ReplyRecord).reply.parent.uri;
      if (grandparentUri) {
        grandparentAuthor = this.profileBasic(
          uriToDid(grandparentUri),
          state,
        );
      }
    }

    return {
      root,
      parent,
      grandparentAuthor,
    };
  }

  reasonPin(): $Typed<ReasonPin> {
    return {
      $type: "so.sprk.feed.defs#reasonPin",
    };
  }

  reasonRepost(
    uri: string,
    repost: Repost,
    state: HydrationState,
  ): $Typed<ReasonRepost> | undefined {
    const creatorDid = uriToDid(uri);
    const creator = this.profileBasic(creatorDid, state);
    if (!creator) return;
    return {
      $type: "so.sprk.feed.defs#reasonRepost",
      by: creator,
      indexedAt: this.indexedAt(repost).toISOString(),
    };
  }

  maybePost(uri: string, state: HydrationState): $Typed<MaybePostView> {
    const reply = this.reply(uri, state);
    if (reply) {
      if (this.viewerBlockExists(reply.author.did, state)) {
        return this.blockedPost(uri, reply.author.did, state);
      }
      return {
        ...reply,
        $type: "so.sprk.feed.defs#replyView",
      };
    }

    const post = this.post(uri, state);
    if (!post) {
      return this.notFoundPost(uri);
    }
    if (this.viewerBlockExists(post.author.did, state)) {
      return this.blockedPost(uri, post.author.did, state);
    }
    return {
      ...post,
      $type: "so.sprk.feed.defs#postView",
    };
  }

  blockedPost(
    uri: string,
    authorDid: string,
    state: HydrationState,
  ): $Typed<BlockedPost> {
    return {
      $type: "so.sprk.feed.defs#blockedPost",
      uri,
      blocked: true,
      author: {
        did: authorDid,
        viewer: this.blockedProfileViewer(authorDid, state),
      },
    };
  }

  notFoundPost(uri: string): $Typed<NotFoundPost> {
    return {
      $type: "so.sprk.feed.defs#notFoundPost",
      uri,
      notFound: true,
    };
  }

  feedItemBlocksAndMutes(
    item: FeedItem,
    state: HydrationState,
  ): {
    originatorMuted: boolean;
    originatorBlocked: boolean;
    authorMuted: boolean;
    authorBlocked: boolean;
  } {
    const authorDid = uriToDid(item.post.uri);
    const originatorDid = item.repost ? uriToDid(item.repost.uri) : authorDid;

    return {
      originatorMuted: this.viewerMuteExists(originatorDid, state),
      originatorBlocked: this.viewerBlockExists(originatorDid, state),
      authorMuted: this.viewerMuteExists(authorDid, state),
      authorBlocked: this.viewerBlockExists(authorDid, state),
    };
  }

  profile(
    did: string,
    state: HydrationState,
  ): ProfileView | undefined {
    const actor = state.actors?.get(did);
    if (!actor) return;
    const basicView = this.profileBasic(did, state);
    if (!basicView) return;
    return {
      ...basicView,
      $type: "so.sprk.actor.defs#profileView",
      description: actor.profile?.description || undefined,
      indexedAt: actor.indexedAt && actor.sortedAt
        ? this.indexedAt({
          sortedAt: actor.sortedAt,
          indexedAt: actor.indexedAt,
        }).toISOString()
        : undefined,
    };
  }

  profileDetailed(
    did: string,
    state: HydrationState,
  ): ProfileViewDetailed | undefined {
    const actor = state.actors?.get(did);
    if (!actor) return;
    const baseView = this.profile(did, state);
    if (!baseView) return;
    const knownFollowers = this.knownFollowers(did, state);
    const profileAggs = state.profileAggs?.get(did);

    return {
      ...baseView,
      $type: "so.sprk.actor.defs#profileViewDetailed",
      viewer: baseView.viewer
        ? {
          ...baseView.viewer,
          knownFollowers,
        }
        : undefined,
      followersCount: profileAggs?.followers ?? 0,
      followsCount: profileAggs?.follows ?? 0,
      postsCount: profileAggs?.posts ?? 0,
      associated: {
        feedgens: profileAggs?.feeds,
      },
    };
  }

  profileBasic(
    did: string,
    state: HydrationState,
  ): ProfileViewBasic | undefined {
    const actor = state.actors?.get(did);
    if (!actor) return;
    return {
      did,
      handle: actor.handle ?? INVALID_HANDLE,
      displayName: actor.profile?.displayName,
      avatar: actor.profile?.avatar
        ? `${this.mediaCdn}/avatar/medium/${did}/${
          cidFromBlobJson(actor.profile.avatar)
        }/webp`
        : undefined,
      viewer: this.profileViewer(did, state),
      createdAt: actor.createdAt?.toISOString(),
    };
  }

  profileViewer(did: string, state: HydrationState): ProfileViewer | undefined {
    const viewer = state.profileViewers?.get(did);
    if (!viewer) return;
    const blockedByUri = viewer.blockedBy;
    const blockingUri = viewer.blocking;
    const block = !!blockedByUri || !!blockingUri;
    return {
      blockedBy: !!blockedByUri,
      blocking: blockingUri,
      following: viewer.following && !block ? viewer.following : undefined,
      followedBy: viewer.followedBy && !block ? viewer.followedBy : undefined,
    };
  }

  viewerMuteExists(did: string, state: HydrationState): boolean {
    const viewer = state.profileViewers?.get(did);
    if (!viewer) return false;
    return !!viewer.muted;
  }

  blockedProfileViewer(
    did: string,
    state: HydrationState,
  ): ProfileViewer | undefined {
    const viewer = state.profileViewers?.get(did);
    if (!viewer) return;
    const blockedByUri = viewer.blockedBy;
    const blockingUri = viewer.blocking;
    return {
      blockedBy: !!blockedByUri,
      blocking: blockingUri,
    };
  }

  knownFollowers(
    did: string,
    state: HydrationState,
  ): KnownFollowers | undefined {
    const knownFollowers = state.knownFollowers?.get(did);
    if (!knownFollowers) return;
    const blocks = state.bidirectionalBlocks?.get(did);
    const followers = mapDefined(knownFollowers.followers, (followerDid) => {
      if (this.viewerBlockExists(followerDid, state)) {
        return undefined;
      }
      if (blocks?.get(followerDid)) {
        return undefined;
      }
      if (this.actorIsNoHosted(followerDid, state)) {
        // @TODO only needed right now to work around getProfile's { includeTakedowns: true }
        return undefined;
      }
      return this.profileBasic(followerDid, state);
    });
    return { count: knownFollowers.count, followers };
  }

  media(
    postUri: string,
    media: Media | { $type: string },
  ): (MediaView & { $type: string }) | undefined {
    if (isImagesMedia(media)) {
      return this.imagesMedia(uriToDid(postUri), media);
    } else if (isVideoMedia(media)) {
      const authorDid = uriToDid(postUri);
      return this.videoMedia(authorDid, media);
    } else {
      return undefined;
    }
  }

  imageMedia(
    did: string,
    image: ImageMedia,
  ): ImageView & { $type: string } {
    const cid = cidFromBlobJson(image.image);
    return {
      $type: "so.sprk.media.image#view" as const,
      thumb: `${this.mediaCdn}/img/medium/${did}/${cid}/webp`,
      fullsize: `${this.mediaCdn}/img/full/${did}/${cid}/webp`,
      alt: image.alt,
      aspectRatio: image.aspectRatio,
    };
  }

  imagesMedia(
    did: string,
    media: ImagesMedia,
  ): ImagesMediaView & { $type: string } {
    const imgViews = media.images.map((img) => ({
      thumb: `${this.mediaCdn}/img/medium/${did}/${
        cidFromBlobJson(img.image)
      }/webp`,
      fullsize: `${this.mediaCdn}/img/full/${did}/${
        cidFromBlobJson(img.image)
      }/webp`,
      alt: img.alt,
      aspectRatio: img.aspectRatio,
    }));
    return {
      $type: "so.sprk.media.images#view" as const,
      images: imgViews,
    };
  }

  videoMedia(
    did: string,
    media: VideoMedia,
  ): VideoMediaView & { $type: string } {
    const cid = cidFromBlobJson(media.video);

    const playlist = `${this.videoCdn}/watch/${did}/${cid}/playlist.m3u8`;
    const thumbnail = `${this.thumbCdn}/${did}/${cid}/thumbnail`;

    return {
      $type: "so.sprk.media.video#view",
      cid,
      playlist,
      thumbnail,
      alt: media.alt,
      aspectRatio: media.aspectRatio,
    };
  }

  soundView(
    uri: string,
    state: HydrationState,
  ): Un$Typed<AudioView> | undefined {
    const soundInfo = state.sounds?.get(uri);
    if (!soundInfo) {
      return;
    }

    const parsedUri = new AtUri(uri);
    const authorDid = parsedUri.hostname;
    const author = this.profileBasic(authorDid, state);
    if (!author) {
      return;
    }

    const soundAgg = state.soundAggs?.get(uri);

    let coverArtUrl: string;
    if (soundInfo.record.coverArt) {
      const coverArtCid = cidFromBlobJson(soundInfo.record.coverArt as BlobRef);
      coverArtUrl =
        `${this.mediaCdn}/img/medium/${authorDid}/${coverArtCid}/webp`;
    } else {
      coverArtUrl = author.avatar ?? "";
    }

    const details = soundInfo.record.details
      ? {
        artist: soundInfo.record.details.artist,
        title: soundInfo.record.details.title,
      }
      : undefined;

    const record = {
      title: soundInfo.record.title,
      origin: soundInfo.record.origin ?? undefined,
      sound: soundInfo.record.sound ?? undefined,
      labels: soundInfo.record.labels ?? undefined,
      createdAt: soundInfo.record.createdAt,
    } as Record<string, unknown>;

    const audioCid = cidFromBlobJson(soundInfo.record.sound);
    const audioUrl = `https://media.sprk.so/sound/${
      encodeURIComponent(authorDid)
    }/${encodeURIComponent(audioCid)}`;

    const indexedAt = this.indexedAt(soundInfo)?.toISOString() ??
      new Date().toISOString();

    const audioView = {
      uri,
      cid: soundInfo.cid,
      author,
      title: soundInfo.record.title,
      coverArt: coverArtUrl,
      record,
      useCount: soundAgg?.uses ?? 0,
      details,
      indexedAt,
      audio: audioUrl,
      labels: undefined,
    };

    return audioView;
  }

  generator(
    uri: string,
    state: HydrationState,
  ): Un$Typed<GeneratorView> | undefined {
    const generatorInfo = state.feedgens?.get(uri);
    if (!generatorInfo) return;

    const parsedUri = new AtUri(uri);
    const authorDid = parsedUri.hostname;
    const creator = this.profile(authorDid, state);
    if (!creator) return;

    const generatorAgg = state.feedgenAggs?.get(uri);
    const viewer = state.feedgenViewers?.get(uri);

    const avatar = generatorInfo.record.avatar
      ? `${this.mediaCdn}/avatar/medium/${authorDid}/${
        cidFromBlobJson(generatorInfo.record.avatar as BlobRef)
      }/webp`
      : undefined;

    return {
      uri,
      cid: generatorInfo.cid,
      did: generatorInfo.record.did,
      creator,
      displayName: generatorInfo.record.displayName,
      description: generatorInfo.record.description,
      descriptionFacets: generatorInfo.record.descriptionFacets,
      avatar,
      likeCount: generatorAgg?.likes ?? 0,
      acceptsInteractions: generatorInfo.record.acceptsInteractions,
      viewer: viewer?.like ? { like: viewer.like } : undefined,
      indexedAt: this.indexedAt(generatorInfo)?.toISOString() ??
        new Date().toISOString(),
    };
  }
  indexedAt({ sortedAt, indexedAt }: { sortedAt: Date; indexedAt: Date }) {
    if (!this.indexedAtEpoch) return sortedAt;
    return indexedAt && indexedAt > this.indexedAtEpoch ? indexedAt : sortedAt;
  }
  viewerBlockExists(did: string, state: HydrationState): boolean {
    const viewer = state.profileViewers?.get(did);
    if (!viewer) return false;
    return !!(
      viewer.blockedBy ||
      viewer.blocking
    );
  }
  actorIsNoHosted(did: string, state: HydrationState): boolean {
    return (
      this.actorIsDeactivated(did, state) || this.actorIsTakendown(did, state)
    );
  }
  actorIsDeactivated(did: string, state: HydrationState): boolean {
    if (state.actors?.get(did)?.upstreamStatus === "deactivated") return true;
    return false;
  }

  actorIsTakendown(did: string, state: HydrationState): boolean {
    const actor = state.actors?.get(did);
    if (actor?.takedownRef) return true;
    if (actor?.upstreamStatus === "takendown") return true;
    if (actor?.upstreamStatus === "suspended") return true;
    return false;
  }
}
