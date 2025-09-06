import { AtUri } from "@atproto/api";
import { HydrationState } from "../hydration/index.ts";
import { PostView } from "../lex/types/so/sprk/feed/defs.ts";
import {
  KnownFollowers,
  ProfileView,
  ProfileViewBasic,
  ProfileViewDetailed,
  ViewerState as ProfileViewer,
} from "../lex/types/so/sprk/actor/defs.ts";
import {
  Embed,
  EmbedView,
  ImagesEmbed,
  ImagesEmbedView,
  isImagesEmbed,
  isVideoEmbed,
  VideoEmbed,
  VideoEmbedView,
} from "./types.ts";
import { INVALID_HANDLE } from "@atproto/syntax";
import { cidFromBlobJson } from "./util.ts";
import { uriToDid } from "../utils/uris.ts";
import { env } from "../utils/env.ts";
import { mapDefined } from "@atproto/common";

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
      indexedAt: actor.indexedAt && actor.createdAt
        ? this.indexedAt({
          createdAt: actor.createdAt,
          indexedAt: actor.indexedAt,
        })?.toISOString()
        : undefined,
    };
  }
  profileDetailed(
    did: string,
    state: HydrationState,
  ): ProfileViewDetailed | undefined {
    const actor = state.actors?.get(did);
    if (!actor) return;
    console.log(actor);
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
  indexedAt(
    { createdAt, indexedAt }: {
      createdAt: Date | undefined;
      indexedAt: Date | undefined;
    },
  ) {
    if (!this.indexedAtEpoch) return createdAt;
    return indexedAt && indexedAt > this.indexedAtEpoch ? indexedAt : createdAt;
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
