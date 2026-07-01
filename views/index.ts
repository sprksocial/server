import { HydrationState } from "../hydration/index.ts";
import type {
  AtUriString,
  BlobRef,
  CidString,
  DatetimeString,
  DidString,
  HandleString,
  UriString,
} from "@atp/lex";
import { AtUri, INVALID_HANDLE, normalizeDatetimeAlways } from "@atp/syntax";
import { mapDefined } from "@atp/common";
import * as so from "../lex/so.ts";
import * as fm from "../lex/fm.ts";
import { cidFromBlobJson } from "./util.ts";
import { uriToDid } from "../utils/uris.ts";
import { FeedItem, Like, Post, Reply, Repost } from "../hydration/feed.ts";
import { Follow } from "../hydration/graph.ts";
import { RecordInfo } from "../hydration/util.ts";
import { Notification } from "../data-plane/routes/notifs.ts";
import {
  $Typed,
  AudioRecord,
  AudioView,
  BlockedPost,
  FeedGenRecord,
  FeedViewPost,
  FollowRecord,
  GeneratorView,
  GetThreadQueryParams,
  ImageMedia,
  ImagesMedia,
  ImagesMediaView,
  ImageView,
  isAudioRecord,
  isFeedGenRecord,
  isImageMedia,
  isImagesMedia,
  isLabelerRecord,
  isPostRecord,
  isPostView,
  isProfileRecord,
  isReplyRecord,
  isReplyView,
  isSelfLabels,
  isVideoMedia,
  isVideoMediaMain,
  KnownFollowers,
  KnownLike,
  KnownReply,
  KnownRepost,
  Label,
  LabelerRecord,
  LabelerView,
  LabelerViewDetailed,
  LikeRecord,
  MaybePostView,
  Media,
  MediaView,
  MentionEmbed,
  NotFoundPost,
  NotificationView,
  PostRecord,
  PostView,
  ProfileRecord,
  ProfileView,
  ProfileViewBasic,
  ProfileViewDetailed,
  ProfileViewer,
  RecordEmbed,
  ReplyRecord,
  ReplyRef,
  ReplyView,
  RepostRecord,
  StoriesByAuthor,
  StoryView,
  StrongRef,
  ThreadContext,
  ThreadItem,
  ThreadViewPost,
  Un$Typed,
  VideoMedia,
  VideoMediaMainType,
  VideoMediaView,
} from "./types.ts";

const asAtUri = (value: string) => value as AtUriString;
const asCid = (value: string) => value as CidString;
const asDatetime = (value: string) => value as DatetimeString;
const asDid = (value: string) => value as DidString;
const asHandle = (value: string) => value as HandleString;
const asUri = (value: string) => value as UriString;

export class Views {
  public indexedAtEpoch?: Date | undefined;

  private videoCdn: string;
  private mediaCdn: string;
  private thumbCdn: string;

  constructor(
    opts: {
      indexedAtEpoch?: Date | undefined;
      videoCdn?: string;
      mediaCdn?: string;
      thumbCdn?: string;
    },
  ) {
    this.indexedAtEpoch = opts?.indexedAtEpoch;
    this.videoCdn = opts?.videoCdn ?? "https://video.sprk.so";
    this.mediaCdn = opts?.mediaCdn ?? "https://media.sprk.so";
    this.thumbCdn = opts?.thumbCdn ?? "https://thumb.sprk.so";
  }

  // Labels
  // ------------

  selfLabels({
    uri,
    cid,
    record,
  }: {
    uri?: string;
    cid?: string;
    record?:
      | PostRecord
      | ReplyRecord
      | LikeRecord
      | RepostRecord
      | FollowRecord
      | FeedGenRecord
      | AudioRecord
      | ProfileRecord
      | LabelerRecord;
  }): Label[] {
    if (!uri || !cid || !record) return [];

    // Only these have a "labels" property:
    if (
      !isPostRecord(record) &&
      !isReplyRecord(record) &&
      !isFeedGenRecord(record) &&
      !isAudioRecord(record) &&
      !isProfileRecord(record) &&
      !isLabelerRecord(record)
    ) {
      return [];
    }

    const selfLabels = "labels" in record ? record.labels : undefined;

    // Ignore if no labels defines
    if (!isSelfLabels(selfLabels) || !selfLabels.values.length) {
      return [];
    }

    const src = uriToDid(uri); // record creator
    const cts = typeof record.createdAt === "string"
      ? normalizeDatetimeAlways(record.createdAt)
      : new Date(0).toISOString();
    return selfLabels.values.map(({ val }) => {
      return {
        src: asDid(src),
        uri: asUri(uri),
        cid: asCid(cid),
        val,
        cts: asDatetime(cts),
      };
    });
  }

  labels({
    uri,
    cid,
    record,
    state,
  }: {
    uri: string;
    cid?: string;
    record?:
      | PostRecord
      | ReplyRecord
      | FeedGenRecord
      | AudioRecord
      | ProfileRecord
      | LabelerRecord;
    state: HydrationState;
  }): Label[] {
    return [
      ...(state.labels?.getBySubject(uri) ?? []),
      ...this.selfLabels({ uri, cid, record }),
    ];
  }

  labeler(
    did: string,
    state: HydrationState,
  ): $Typed<LabelerView, "so.sprk.labeler.defs#labelerView"> | undefined {
    const labeler = state.labelers?.get(did);
    if (!labeler) return;
    const creator = this.profile(did, state);
    if (!creator) return;
    const viewer = state.labelerViewers?.get(did);
    const aggs = state.labelerAggs?.get(did);

    const uri = AtUri.make(
      did,
      so.sprk.labeler.service.$type,
      "self",
    ).toString();
    const labels = [
      ...(state.labels?.getBySubject(uri) ?? []),
      ...this.selfLabels({
        uri,
        cid: labeler.cid.toString(),
        record: labeler.record,
      }),
    ];

    return {
      $type: "so.sprk.labeler.defs#labelerView",
      uri: asAtUri(uri),
      cid: asCid(labeler.cid.toString()),
      creator,
      likeCount: aggs?.likes ?? 0,
      viewer: viewer
        ? {
          like: viewer.like ? asAtUri(viewer.like) : undefined,
        }
        : undefined,
      indexedAt: asDatetime(this.indexedAt(labeler).toISOString()),
      labels,
    };
  }

  labelerDetailed(
    did: string,
    state: HydrationState,
  ):
    | $Typed<LabelerViewDetailed, "so.sprk.labeler.defs#labelerViewDetailed">
    | undefined {
    const baseView = this.labeler(did, state);
    if (!baseView) return;
    const labeler = state.labelers?.get(did);
    if (!labeler) return;

    return {
      ...baseView,
      $type: "so.sprk.labeler.defs#labelerViewDetailed",
      policies: labeler.record.policies,
      reasonTypes: labeler.record.reasonTypes,
      subjectTypes: labeler.record.subjectTypes,
      subjectCollections: labeler.record.subjectCollections,
    };
  }

  // Threads
  // ------------

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
        uri: asAtUri(uri),
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
    const post = this.post(uri, state) ?? this.reply(uri, state);
    if (post) {
      return {
        $type: "so.sprk.feed.defs#threadViewPost",
        post,
        threadContext: this.threadContext(uri, state),
      };
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
      ...(like ? { rootAuthorLike: asAtUri(like) } : {}),
    };
  }

  // Feed
  // ------------

  post(
    uri: string,
    state: HydrationState,
  ): $Typed<PostView> | undefined {
    const recordInfo = state.posts?.get(uri) ?? state.replies?.get(uri);
    if (!recordInfo) return;

    const parsedUri = new AtUri(uri);
    const collection = parsedUri.collection;
    const isReply = collection === so.sprk.feed.reply.$type;
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
      ? recordInfo.record.sound as StrongRef
      : undefined;
    const labels = this.labels({
      uri,
      cid: recordInfo.cid,
      record: recordInfo.record,
      state,
    });

    return {
      $type: "so.sprk.feed.defs#postView",
      uri: asAtUri(uri),
      cid: asCid(recordInfo.cid),
      author,
      record: recordInfo.record,
      media: mediaRecord ? this.media(uri, mediaRecord as Media) : undefined,
      sound: soundRecord ? this.sound(soundRecord.uri, state) : undefined,
      replyCount: repliesCount,
      repostCount,
      likeCount,
      indexedAt: asDatetime(
        this.indexedAt(recordInfo)?.toISOString() ?? new Date().toISOString(),
      ),
      viewer: viewer
        ? {
          repost: viewer.repost ? asAtUri(viewer.repost) : undefined,
          like: viewer.like ? asAtUri(viewer.like) : undefined,
          knownInteractions: this.knownInteractions(uri, state),
        }
        : undefined,
      labels,
    };
  }

  reply(
    uri: string,
    state: HydrationState,
  ): $Typed<ReplyView> | undefined {
    const replyInfo = state.replies?.get(uri);
    if (!replyInfo) return;

    const parsedUri = new AtUri(uri);
    const authorDid = parsedUri.hostname;
    const author = this.profileBasic(authorDid, state);
    if (!author) return;

    const aggs = state.replyAggs?.get(uri);
    const viewer = state.postViewers?.get(uri);
    const labels = this.labels({
      uri,
      cid: replyInfo.cid,
      record: replyInfo.record,
      state,
    });

    return {
      $type: "so.sprk.feed.defs#replyView",
      uri: asAtUri(uri),
      cid: asCid(replyInfo.cid),
      author,
      record: replyInfo.record,
      media: replyInfo.record.media
        ? this.imageMedia(uri, replyInfo.record.media as ImageMedia)
        : undefined,
      replyCount: aggs?.replies ?? 0,
      likeCount: aggs?.likes ?? 0,
      indexedAt: asDatetime(
        this.indexedAt(replyInfo)?.toISOString() ?? new Date().toISOString(),
      ),
      viewer: viewer
        ? {
          like: viewer.like ? asAtUri(viewer.like) : undefined,
        }
        : undefined,
      labels,
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
      uri: asAtUri(uri),
      cid: asCid(storyInfo.cid),
      author,
      record: storyInfo.record,
      media: mediaRecord ? this.storyMedia(uri, mediaRecord) : undefined,
      sound: storyInfo.record.sound
        ? this.sound(storyInfo.record.sound.uri, state)
        : undefined,
      embeds: this.storyEmbeds(storyInfo.record.embeds, state),
      indexedAt: asDatetime(
        this.indexedAt(storyInfo)?.toISOString() ?? new Date().toISOString(),
      ),
    };
  }

  private isMentionEmbed(embed: unknown): embed is MentionEmbed {
    if (!embed || typeof embed !== "object") return false;
    const e = embed as Record<string, unknown>;
    return e["$type"] === "so.sprk.embed.mention" &&
      typeof e["did"] === "string" &&
      (e["did"] as string).length > 0 &&
      !!e["placement"] &&
      typeof e["placement"] === "object" &&
      !!(e["placement"] as Record<string, unknown>)["frame"] &&
      typeof (e["placement"] as Record<string, unknown>)["frame"] === "object";
  }

  private isRecordEmbed(embed: unknown): embed is RecordEmbed {
    if (!embed || typeof embed !== "object") return false;
    const e = embed as Record<string, unknown>;
    const post = e["post"] as Record<string, unknown> | undefined;
    return e["$type"] === "so.sprk.embed.record" &&
      typeof post?.["uri"] === "string" &&
      !!e["placement"] &&
      typeof e["placement"] === "object" &&
      !!(e["placement"] as Record<string, unknown>)["frame"] &&
      typeof (e["placement"] as Record<string, unknown>)["frame"] === "object";
  }

  storyEmbeds(
    embeds: unknown,
    state: HydrationState,
  ): StoryView["embeds"] | undefined {
    if (!Array.isArray(embeds) || embeds.length === 0) {
      return undefined;
    }

    const views = mapDefined(embeds, (embed) => {
      if (this.isMentionEmbed(embed)) {
        return {
          $type: "so.sprk.embed.mention#view",
          placement: embed.placement,
          did: embed.did,
          actor: this.profileBasic(embed.did, state),
        };
      }

      if (this.isRecordEmbed(embed)) {
        const embedded = this.maybePost(embed.post.uri, state);
        return {
          $type: "so.sprk.embed.record#view",
          placement: embed.placement,
          post: isReplyView(embedded)
            ? this.notFoundPost(embed.post.uri)
            : embedded,
        };
      }

      return undefined;
    });

    return views.length > 0 ? views as StoryView["embeds"] : undefined;
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
    const post = this.post(item.post.uri, state);
    if (!post) return;
    return {
      post,
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
      root: isReplyView(root) ? this.notFoundPost(root.uri) : root,
      parent,
      grandparentAuthor,
    };
  }

  maybePost(uri: string, state: HydrationState): $Typed<MaybePostView> {
    const reply = this.reply(uri, state);
    if (reply) {
      if (this.viewerBlockExists(reply.author.did, state)) {
        return this.blockedPost(uri, reply.author.did, state);
      }
      return reply;
    }

    const post = this.post(uri, state);
    if (!post) {
      return this.notFoundPost(uri);
    }
    if (this.viewerBlockExists(post.author.did, state)) {
      return this.blockedPost(uri, post.author.did, state);
    }
    return post;
  }

  blockedPost(
    uri: string,
    authorDid: string,
    state: HydrationState,
  ): $Typed<BlockedPost> {
    return {
      $type: "so.sprk.feed.defs#blockedPost",
      uri: asAtUri(uri),
      blocked: true,
      author: {
        did: asDid(authorDid),
        viewer: this.blockedProfileViewer(authorDid, state),
      },
    };
  }

  notFoundPost(uri: string): $Typed<NotFoundPost> {
    return {
      $type: "so.sprk.feed.defs#notFoundPost",
      uri: asAtUri(uri),
      notFound: true,
    };
  }

  feedItemBlocksAndMutes(
    item: FeedItem,
    state: HydrationState,
  ): {
    authorMuted: boolean;
    authorBlocked: boolean;
  } {
    const authorDid = uriToDid(item.post.uri);

    return {
      authorMuted: this.viewerMuteExists(authorDid, state),
      authorBlocked: this.viewerBlockExists(authorDid, state),
    };
  }

  feedGenerator(
    uri: string,
    state: HydrationState,
  ): Un$Typed<GeneratorView> | undefined {
    const feedgen = state.feedgens?.get(uri);
    if (!feedgen) return;
    const creatorDid = uriToDid(uri);
    const creator = this.profile(creatorDid, state);
    if (!creator) return;
    const viewer = state.feedgenViewers?.get(uri);
    const aggs = state.feedgenAggs?.get(uri);
    const labels = this.labels({
      uri,
      cid: feedgen.cid,
      record: feedgen.record,
      state,
    });

    return {
      uri: asAtUri(uri),
      cid: asCid(feedgen.cid),
      did: asDid(feedgen.record.did),
      creator,
      displayName: feedgen.record.displayName,
      description: feedgen.record.description,
      descriptionFacets: feedgen.record.descriptionFacets,
      avatar: feedgen.record?.avatar
        ? asUri(
          `${this.mediaCdn}/avatar/medium/${creatorDid}/${
            cidFromBlobJson(feedgen.record.avatar)
          }/webp`,
        )
        : undefined,
      likeCount: aggs?.likes ?? 0,
      acceptsInteractions: feedgen.record.acceptsInteractions,
      labels,
      viewer: viewer
        ? {
          like: viewer.like ? asAtUri(viewer.like) : undefined,
        }
        : undefined,
      indexedAt: asDatetime(this.indexedAt(feedgen).toISOString()),
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
    const stories = mapDefined(
      state.actorStoryRefs?.get(did) ?? [],
      (story) => this.story(story.uri, state),
    );
    return {
      ...basicView,
      $type: "so.sprk.actor.defs#profileView",
      description: actor.profile?.description || undefined,
      indexedAt: actor.indexedAt && actor.sortedAt
        ? asDatetime(
          this.indexedAt({
            sortedAt: actor.sortedAt,
            indexedAt: actor.indexedAt,
          }).toISOString(),
        )
        : undefined,
      stories: stories.length > 0 ? stories : undefined,
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
    const profileUri = AtUri.make(
      did,
      so.sprk.actor.profile.$type,
      "self",
    ).toString();
    const labels = [
      ...(state.labels?.getBySubject(did) ?? []),
      ...this.labels({
        uri: profileUri,
        cid: actor.profileCid,
        record: actor.profile,
        state,
      }),
    ];
    return {
      did: asDid(did),
      handle: asHandle(actor.handle ?? INVALID_HANDLE),
      displayName: actor.profile?.displayName,
      avatar: actor.profile?.avatar
        ? asUri(
          `${this.mediaCdn}/avatar/medium/${did}/${
            cidFromBlobJson(actor.profile.avatar)
          }/webp`,
        )
        : undefined,
      viewer: this.profileViewer(did, state),
      labels,
      createdAt: actor.createdAt
        ? asDatetime(actor.createdAt.toISOString())
        : undefined,
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
      blocking: blockingUri ? asAtUri(blockingUri) : undefined,
      following: viewer.following && !block
        ? asAtUri(viewer.following)
        : undefined,
      followedBy: viewer.followedBy && !block
        ? asAtUri(viewer.followedBy)
        : undefined,
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
      blocking: blockingUri ? asAtUri(blockingUri) : undefined,
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

  knownInteractions(
    uri: string,
    state: HydrationState,
  ):
    | ($Typed<KnownRepost> | $Typed<KnownLike> | $Typed<KnownReply>)[]
    | undefined {
    const interactions = state.knownInteractions?.get(uri);
    if (!interactions || interactions.length === 0) return undefined;

    const postAuthorDid = uriToDid(uri);
    const blocks = state.bidirectionalBlocks?.get(postAuthorDid);

    const result = mapDefined(interactions, (interaction) => {
      // Filter blocked users
      if (this.viewerBlockExists(interaction.by, state)) return undefined;
      if (blocks?.get(interaction.by)) return undefined;
      if (this.actorIsNoHosted(interaction.by, state)) return undefined;

      const by = this.profileBasic(interaction.by, state);
      if (!by) return undefined;

      const base = {
        by,
        uri: asAtUri(interaction.uri),
        cid: asCid(interaction.cid),
        indexedAt: asDatetime(interaction.indexedAt.toISOString()),
      };

      switch (interaction.type) {
        case "like":
          return {
            $type: "so.sprk.feed.defs#knownLike" as const,
            ...base,
          };
        case "repost":
          return {
            $type: "so.sprk.feed.defs#knownRepost" as const,
            ...base,
          };
        case "reply":
          return {
            $type: "so.sprk.feed.defs#knownReply" as const,
            ...base,
            text: interaction.text,
          };
      }
    });

    return result.length > 0 ? result : undefined;
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
      thumb: asUri(`${this.mediaCdn}/img/medium/${did}/${cid}/webp`),
      fullsize: asUri(`${this.mediaCdn}/img/full/${did}/${cid}/webp`),
      alt: image.alt,
      aspectRatio: image.aspectRatio,
    };
  }

  imagesMedia(
    did: string,
    media: ImagesMedia,
  ): ImagesMediaView & { $type: string } {
    const imgViews = media.images.map((img) => ({
      thumb: asUri(
        `${this.mediaCdn}/img/medium/${did}/${cidFromBlobJson(img.image)}/webp`,
      ),
      fullsize: asUri(
        `${this.mediaCdn}/img/full/${did}/${cidFromBlobJson(img.image)}/webp`,
      ),
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
      cid: asCid(cid),
      playlist: asUri(playlist),
      thumbnail: asUri(thumbnail),
      alt: media.alt,
      aspectRatio: media.aspectRatio,
    };
  }

  sound(
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
    const record = soundInfo.record;
    const isPlyrTrack = fm.plyr.track.$matches(record);
    const plyrRecord = isPlyrTrack ? record as fm.plyr.track.Main : undefined;
    const sparkRecord = !isPlyrTrack ? record as AudioRecord : undefined;

    let coverArtUrl: UriString;
    const coverArt = sparkRecord
      ? (sparkRecord as { coverArt?: BlobRef }).coverArt
      : undefined;
    if (plyrRecord?.imageUrl) {
      coverArtUrl = asUri(plyrRecord.imageUrl);
    } else if (coverArt) {
      const coverArtCid = cidFromBlobJson(coverArt);
      coverArtUrl = asUri(
        `${this.mediaCdn}/img/medium/${authorDid}/${coverArtCid}/webp`,
      );
    } else {
      coverArtUrl = author.avatar ?? asUri("https://media.sprk.so");
    }

    const details = plyrRecord
      ? { artist: plyrRecord.artist, title: plyrRecord.title }
      : sparkRecord?.details
      ? {
        artist: sparkRecord.details.artist,
        title: sparkRecord.details.title,
      }
      : undefined;

    const isGatedPlyrTrack = !!plyrRecord?.supportGate;
    const viewRecord = plyrRecord
      ? isGatedPlyrTrack
        ? (({ audioBlob: _audioBlob, audioUrl: _audioUrl, ...record }) =>
          record)(plyrRecord)
        : plyrRecord as Record<string, unknown>
      : {
        title: sparkRecord?.title,
        origin: sparkRecord?.origin ?? undefined,
        sound: sparkRecord?.sound ?? undefined,
        labels: sparkRecord?.labels ?? undefined,
        createdAt: sparkRecord?.createdAt,
      } as Record<string, unknown>;

    let audioUrl: UriString | undefined;
    const audioBlob = plyrRecord ? plyrRecord.audioBlob : sparkRecord?.sound;
    if (audioBlob && !isGatedPlyrTrack) {
      const audioCid = cidFromBlobJson(audioBlob);
      audioUrl = asUri(
        `https://media.sprk.so/sound/${encodeURIComponent(authorDid)}/${
          encodeURIComponent(audioCid)
        }`,
      );
    }

    const indexedAt = asDatetime(
      this.indexedAt(soundInfo)?.toISOString() ?? new Date().toISOString(),
    );
    const labels = this.labels({
      uri,
      cid: soundInfo.cid,
      record: sparkRecord,
      state,
    });

    const audioView = {
      uri: asAtUri(uri),
      cid: asCid(soundInfo.cid),
      author,
      title: record.title,
      coverArt: coverArtUrl,
      record: viewRecord,
      useCount: soundAgg?.uses ?? 0,
      details,
      indexedAt,
      audio: audioUrl,
      labels,
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
    const labels = this.labels({
      uri,
      cid: generatorInfo.cid,
      record: generatorInfo.record,
      state,
    });

    const avatar = generatorInfo.record.avatar
      ? asUri(
        `${this.mediaCdn}/avatar/medium/${authorDid}/${
          cidFromBlobJson(generatorInfo.record.avatar as BlobRef)
        }/webp`,
      )
      : undefined;

    return {
      uri: asAtUri(uri),
      cid: asCid(generatorInfo.cid),
      did: asDid(generatorInfo.record.did),
      creator,
      displayName: generatorInfo.record.displayName,
      description: generatorInfo.record.description,
      descriptionFacets: generatorInfo.record.descriptionFacets,
      avatar,
      likeCount: generatorAgg?.likes ?? 0,
      acceptsInteractions: generatorInfo.record.acceptsInteractions,
      labels,
      viewer: viewer?.like ? { like: asAtUri(viewer.like) } : undefined,
      indexedAt: asDatetime(
        this.indexedAt(generatorInfo)?.toISOString() ??
          new Date().toISOString(),
      ),
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

  viewerSeesNeedsReview(
    { did, uri }: { did?: string; uri?: string },
    state: HydrationState,
  ): boolean {
    const { labels, profileViewers, ctx } = state;
    did = did || (uri && uriToDid(uri));
    if (!did) {
      return true;
    }
    if (
      labels?.get(did)?.needsReview ||
      (uri && labels?.get(uri)?.needsReview)
    ) {
      // content marked as needs review
      return ctx?.viewer === did || !!profileViewers?.get(did)?.following;
    }
    return true;
  }

  notification(
    notif: Notification,
    lastSeenAt: string | undefined,
    state: HydrationState,
  ): Un$Typed<NotificationView> | undefined {
    if (!notif.sortAt || !notif.reason) return;
    const uri = new AtUri(notif.uri);
    const authorDid = notif.authorDid;
    const author = this.profile(authorDid, state);
    if (!author) return;

    let recordInfo:
      | Post
      | Reply
      | Like
      | Repost
      | Follow
      | RecordInfo<ProfileRecord>
      | undefined
      | null;

    if (uri.collection === so.sprk.feed.post.$type) {
      recordInfo = state.posts?.get(notif.uri);
    } else if (uri.collection === so.sprk.feed.reply.$type) {
      recordInfo = state.replies?.get(notif.uri);
    } else if (uri.collection === so.sprk.feed.like.$type) {
      recordInfo = state.likes?.get(notif.uri);
    } else if (uri.collection === so.sprk.feed.repost.$type) {
      recordInfo = state.reposts?.get(notif.uri);
    } else if (uri.collection === so.sprk.graph.follow.$type) {
      recordInfo = state.follows?.get(notif.uri);
    } else if (uri.collection === so.sprk.actor.profile.$type) {
      const actor = state.actors?.get(authorDid);
      recordInfo = actor && actor.profile && actor.profileCid
        ? {
          record: actor.profile,
          cid: actor.profileCid,
          sortedAt: actor.sortedAt ?? new Date(0), // @NOTE will be present since profile record is present
          indexedAt: actor.indexedAt ?? new Date(0), // @NOTE will be present since profile record is present
          takedownRef: actor.profileTakedownRef,
        }
        : undefined;
    }
    if (!recordInfo) return;

    const labels = state.labels?.getBySubject(notif.uri) ?? [];
    // selfLabels only applies to posts and profiles, safe to pass the record
    const selfLabels = isPostRecord(recordInfo.record) ||
        isProfileRecord(recordInfo.record)
      ? this.selfLabels({
        uri: notif.uri,
        cid: recordInfo.cid,
        record: recordInfo.record,
      })
      : [];
    const indexedAt = notif.sortAt;

    // For like/repost/reply notifications, include the subject record (post/reply) in the response
    let recordWithSubject = recordInfo.record;
    if (
      (notif.reason === "like" ||
        notif.reason === "repost" ||
        notif.reason === "reply") &&
      notif.reasonSubject
    ) {
      const subjectUri = new AtUri(notif.reasonSubject);
      let subjectRecord: Post | Reply | undefined;
      const isSubjectReply = subjectUri.collection === so.sprk.feed.reply.$type;
      if (subjectUri.collection === so.sprk.feed.post.$type) {
        subjectRecord = state.posts?.get(notif.reasonSubject) ?? undefined;
      } else if (isSubjectReply) {
        subjectRecord = state.replies?.get(notif.reasonSubject) ?? undefined;
      }

      // Embed subject record and media view in the notification record for client access
      // This allows the client to display the subject's text and media preview
      if (subjectRecord) {
        // Get the raw media from the record and convert to view with URLs
        const rawMedia = subjectRecord.record.media;
        let mediaView: unknown;
        if (rawMedia) {
          if (isSubjectReply) {
            // Replies only support image media
            if (isImageMedia(rawMedia)) {
              mediaView = this.imageMedia(
                subjectUri.hostname,
                rawMedia as ImageMedia,
              );
            }
          } else {
            // Posts support images or video
            mediaView = this.media(notif.reasonSubject, rawMedia as Media);
          }
        }

        recordWithSubject = {
          ...recordInfo.record,
          subject: subjectRecord.record,
          subjectMedia: mediaView,
        } as unknown as typeof recordInfo.record;
      }
    }

    return {
      uri: asAtUri(notif.uri),
      cid: asCid(recordInfo.cid),
      author,
      reason: notif.reason as NotificationView["reason"],
      reasonSubject: notif.reasonSubject
        ? asAtUri(notif.reasonSubject)
        : undefined,
      record: recordWithSubject,
      // @NOTE works with a hack in listNotifications so that when there's no last-seen time,
      // the user's first notification is marked unread, and all previous read. in this case,
      // the last seen time will be equal to the first notification's indexed time.
      isRead: lastSeenAt ? lastSeenAt >= indexedAt : true,
      indexedAt: asDatetime(notif.sortAt),
      labels: [...labels, ...selfLabels],
    };
  }
}
