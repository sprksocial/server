import { AtUri } from "@atproto/api";
import { HydrationState } from "../hydration/index.ts";
import {
  FeedViewPost,
  isPostView,
  PostView,
  ReasonPin,
  ReasonRepost,
  ReplyRef,
} from "../lex/types/so/sprk/feed/defs.ts";
import { isRecord as isPostRecord } from "../lex/types/so/sprk/feed/post.ts";
import {
  KnownFollowers,
  ProfileView,
  ProfileViewBasic,
  ProfileViewDetailed,
  ViewerState as ProfileViewer,
} from "../lex/types/so/sprk/actor/defs.ts";
import {
  BlockedPost,
  Embed,
  EmbedView,
  ImagesEmbed,
  ImagesEmbedView,
  isImagesEmbed,
  isVideoEmbed,
  MaybePostView,
  NotFoundPost,
  VideoEmbed,
  VideoEmbedView,
} from "./types.ts";
import { INVALID_HANDLE } from "@atp/syntax";
import { cidFromBlobJson } from "./util.ts";
import { uriToDid } from "../utils/uris.ts";
import { env } from "../utils/env.ts";
import { mapDefined } from "@atp/common";
import { FeedItem, Repost } from "../hydration/feed.ts";
import { $Typed } from "../lex/util.ts";

export class Views {
  public indexedAtEpoch?: Date | undefined;

  constructor(
    opts?: {
      indexedAtEpoch?: Date | undefined;
    },
  ) {
    this.indexedAtEpoch = opts?.indexedAtEpoch;
  }

  post(
    uri: string,
    state: HydrationState,
    depth = 0,
  ): PostView | undefined {
    const post = state.posts?.get(uri);
    if (!post) return;
    const parsedUri = new AtUri(uri);
    const authorDid = parsedUri.hostname;
    const author = this.profileBasic(authorDid, state);
    if (!author) return;
    const aggs = state.postAggs?.get(uri);
    const viewer = state.postViewers?.get(uri);
    return {
      uri,
      cid: post.cid,
      author,
      record: post.record,
      embed: depth < 2 && post.record.embed
        ? this.embed(uri, post.record.embed, state)
        : undefined,
      replyCount: aggs?.replies ?? 0,
      repostCount: aggs?.reposts ?? 0,
      likeCount: aggs?.likes ?? 0,
      indexedAt: this.indexedAt(post)?.toISOString() ??
        new Date().toISOString(),
      viewer: viewer
        ? {
          repost: viewer.repost,
          like: viewer.like,
        }
        : undefined,
    };
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
    const reply = this.replyRef(item.post.uri, state);
    return {
      post,
      reason,
      reply,
    };
  }

  replyRef(uri: string, state: HydrationState): ReplyRef | undefined {
    const postRecord = state.posts?.get(uri.toString())?.record;
    if (!postRecord?.reply) return;
    let root = this.maybePost(postRecord.reply.root.uri, state);
    let parent = this.maybePost(postRecord.reply.parent.uri, state);
    if (!state.ctx?.include3pBlocks) {
      const childBlocks = state.postBlocks?.get(uri);
      const parentBlocks = state.postBlocks?.get(parent.uri);
      // if child blocks parent, block parent
      if (isPostView(parent) && childBlocks?.parent) {
        parent = this.blockedPost(parent.uri, parent.author.did, state);
      }
      // if child or parent blocks root, block root
      if (isPostView(root) && (childBlocks?.root || parentBlocks?.root)) {
        root = this.blockedPost(root.uri, root.author.did, state);
      }
    }
    let grandparentAuthor: ProfileViewBasic | undefined;
    if (
      isPostView(parent) &&
      isPostRecord(parent.record) &&
      parent.record.reply
    ) {
      grandparentAuthor = this.profileBasic(
        // @ts-expect-error isValidPostRecord(parent.record) should be used but the "parent" is not IPDL decoded
        creatorFromUri(parent.record.reply.parent.uri),
        state,
      );
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
    ancestorAuthorBlocked: boolean;
  } {
    const authorDid = uriToDid(item.post.uri);
    const originatorDid = item.repost ? uriToDid(item.repost.uri) : authorDid;
    const post = state.posts?.get(item.post.uri);
    const parentUri = post?.record.reply?.parent.uri;
    const parentAuthorDid = parentUri && uriToDid(parentUri);
    const parent = parentUri ? state.posts?.get(parentUri) : undefined;
    const grandparentUri = parent?.record.reply?.parent.uri;
    const grandparentAuthorDid = grandparentUri && uriToDid(grandparentUri);
    return {
      originatorMuted: this.viewerMuteExists(originatorDid, state),
      originatorBlocked: this.viewerBlockExists(originatorDid, state),
      authorMuted: this.viewerMuteExists(authorDid, state),
      authorBlocked: this.viewerBlockExists(authorDid, state),
      ancestorAuthorBlocked:
        (!!parentAuthorDid && this.viewerBlockExists(parentAuthorDid, state)) ||
        (!!grandparentAuthorDid &&
          this.viewerBlockExists(grandparentAuthorDid, state)),
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
        ? `${env.MEDIA_CDN_URL}/avatar/medium/${did}/${actor.profile.avatar.ref}/webp`
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
    return !viewer.muted;
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

  embed(
    postUri: string,
    embed: Embed | { $type: string },
    state?: HydrationState,
  ): (EmbedView & { $type: string }) | undefined {
    if (isImagesEmbed(embed)) {
      return this.imagesEmbed(uriToDid(postUri), embed);
    } else if (isVideoEmbed(embed)) {
      const authorDid = uriToDid(postUri);
      const videoCid = embed.video ? cidFromBlobJson(embed.video) : "";
      const videoMappingKey = `${authorDid}-${videoCid}`;
      const videoMapping = state?.videoMappings?.get(videoMappingKey) || null;
      return this.videoEmbed(authorDid, embed, videoMapping);
    } else {
      return undefined;
    }
  }

  imagesEmbed(
    did: string,
    embed: ImagesEmbed,
  ): ImagesEmbedView & { $type: string } {
    const imgViews = embed.images.map((img) => ({
      thumb: `${env.MEDIA_CDN_URL}/img/medium/${did}/${
        cidFromBlobJson(img.image)
      }/webp`,
      fullsize: `${env.MEDIA_CDN_URL}/img/full/${did}/${
        cidFromBlobJson(img.image)
      }/webp`,
      alt: img.alt,
      aspectRatio: img.aspectRatio,
    }));
    return {
      $type: "so.sprk.embed.images#view" as const,
      images: imgViews,
    };
  }

  videoEmbed(
    did: string,
    embed: VideoEmbed,
    videoMapping?: { bunnyGuid: string } | null,
  ): VideoEmbedView & { $type: string } {
    const cid = cidFromBlobJson(embed.video);

    let playlist: string;
    let thumbnail: string;

    if (videoMapping) {
      playlist = `${env.HLS_CDN_URL}/${videoMapping.bunnyGuid}/playlist.m3u8`;
      thumbnail = `${env.HLS_CDN_URL}/${videoMapping.bunnyGuid}/thumbnail.jpg`;
    } else {
      playlist = `${env.VIDEO_CDN_URL}/watch/${did}/${cid}/playlist.m3u8`;
      thumbnail = `${env.THUMB_CDN_URL}/${did}/${cid}/thumbnail`;
    }

    return {
      $type: "so.sprk.embed.video#view" as const,
      cid,
      playlist,
      thumbnail,
      alt: embed.alt,
      aspectRatio: embed.aspectRatio,
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
