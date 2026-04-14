/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { validate as _validate } from "../../../../lexicons.ts";
import type { ValidationResult } from "@atp/lexicon";
import { type $Typed, is$typed as _is$typed } from "../../../../util.ts";
import type * as SoSprkActorDefs from "../actor/defs.ts";
import type * as SoSprkMediaImages from "../media/images.ts";
import type * as SoSprkMediaVideo from "../media/video.ts";
import type * as SoSprkSoundDefs from "../sound/defs.ts";
import type * as ComAtprotoLabelDefs from "../../../com/atproto/label/defs.ts";
import type * as SoSprkMediaImage from "../media/image.ts";
import type * as SoSprkRichtextFacet from "../richtext/facet.ts";

const is$typed = _is$typed, validate = _validate;
const id = "so.sprk.feed.defs";

export interface PostView {
  $type?: "so.sprk.feed.defs#postView";
  uri: string;
  cid: string;
  author: SoSprkActorDefs.ProfileViewBasic;
  record: { [_ in string]: unknown };
  media?: $Typed<SoSprkMediaImages.View> | $Typed<SoSprkMediaVideo.View> | {
    $type: string;
  };
  sound?: SoSprkSoundDefs.AudioView;
  replyCount?: number;
  repostCount?: number;
  likeCount?: number;
  indexedAt: string;
  viewer?: ViewerState;
  labels?: (ComAtprotoLabelDefs.Label)[];
  threadgate?: ThreadgateView;
}

const hashPostView = "postView";

export function isPostView<V>(v: V): v is PostView & V {
  return is$typed(v, id, hashPostView);
}

export function validatePostView<V>(v: V): ValidationResult<PostView & V> {
  return validate<PostView & V>(v, id, hashPostView);
}

export interface ReplyView {
  $type?: "so.sprk.feed.defs#replyView";
  uri: string;
  cid: string;
  author: SoSprkActorDefs.ProfileViewBasic;
  record: { [_ in string]: unknown };
  media?: $Typed<SoSprkMediaImage.View> | { $type: string };
  replyCount?: number;
  likeCount?: number;
  indexedAt: string;
  viewer?: ReplyViewerState;
  labels?: (ComAtprotoLabelDefs.Label)[];
}

const hashReplyView = "replyView";

export function isReplyView<V>(v: V): v is ReplyView & V {
  return is$typed(v, id, hashReplyView);
}

export function validateReplyView<V>(v: V): ValidationResult<ReplyView & V> {
  return validate<ReplyView & V>(v, id, hashReplyView);
}

/** Metadata about the requesting account's relationship with the subject content. Only has meaningful content for authed requests. */
export interface ReplyViewerState {
  $type?: "so.sprk.feed.defs#replyViewerState";
  like?: string;
  threadMuted?: boolean;
  replyDisabled?: boolean;
  embeddingDisabled?: boolean;
}

const hashReplyViewerState = "replyViewerState";

export function isReplyViewerState<V>(v: V): v is ReplyViewerState & V {
  return is$typed(v, id, hashReplyViewerState);
}

export function validateReplyViewerState<V>(
  v: V,
): ValidationResult<ReplyViewerState & V> {
  return validate<ReplyViewerState & V>(v, id, hashReplyViewerState);
}

/** Metadata about the requesting account's relationship with the subject content. Only has meaningful content for authed requests. */
export interface ViewerState {
  $type?: "so.sprk.feed.defs#viewerState";
  repost?: string;
  like?: string;
  threadMuted?: boolean;
  replyDisabled?: boolean;
  embeddingDisabled?: boolean;
  knownInteractions?:
    ($Typed<KnownRepost> | $Typed<KnownLike> | $Typed<KnownReply> | {
      $type: string;
    })[];
}

const hashViewerState = "viewerState";

export function isViewerState<V>(v: V): v is ViewerState & V {
  return is$typed(v, id, hashViewerState);
}

export function validateViewerState<V>(
  v: V,
): ValidationResult<ViewerState & V> {
  return validate<ViewerState & V>(v, id, hashViewerState);
}

export interface KnownRepost {
  $type?: "so.sprk.feed.defs#knownRepost";
  by: SoSprkActorDefs.ProfileViewBasic;
  uri?: string;
  cid?: string;
  indexedAt: string;
}

const hashKnownRepost = "knownRepost";

export function isKnownRepost<V>(v: V): v is KnownRepost & V {
  return is$typed(v, id, hashKnownRepost);
}

export function validateKnownRepost<V>(
  v: V,
): ValidationResult<KnownRepost & V> {
  return validate<KnownRepost & V>(v, id, hashKnownRepost);
}

export interface KnownLike {
  $type?: "so.sprk.feed.defs#knownLike";
  by: SoSprkActorDefs.ProfileViewBasic;
  uri?: string;
  cid?: string;
  indexedAt: string;
}

const hashKnownLike = "knownLike";

export function isKnownLike<V>(v: V): v is KnownLike & V {
  return is$typed(v, id, hashKnownLike);
}

export function validateKnownLike<V>(v: V): ValidationResult<KnownLike & V> {
  return validate<KnownLike & V>(v, id, hashKnownLike);
}

export interface KnownReply {
  $type?: "so.sprk.feed.defs#knownReply";
  by: SoSprkActorDefs.ProfileViewBasic;
  uri?: string;
  cid?: string;
  indexedAt: string;
  text?: string;
}

const hashKnownReply = "knownReply";

export function isKnownReply<V>(v: V): v is KnownReply & V {
  return is$typed(v, id, hashKnownReply);
}

export function validateKnownReply<V>(v: V): ValidationResult<KnownReply & V> {
  return validate<KnownReply & V>(v, id, hashKnownReply);
}

/** Metadata about this post within the context of the thread it is in. */
export interface ThreadContext {
  $type?: "so.sprk.feed.defs#threadContext";
  rootAuthorLike?: string;
}

const hashThreadContext = "threadContext";

export function isThreadContext<V>(v: V): v is ThreadContext & V {
  return is$typed(v, id, hashThreadContext);
}

export function validateThreadContext<V>(
  v: V,
): ValidationResult<ThreadContext & V> {
  return validate<ThreadContext & V>(v, id, hashThreadContext);
}

export interface FeedViewPost {
  $type?: "so.sprk.feed.defs#feedViewPost";
  post: PostView;
  /** Context provided by feed generator that may be passed back alongside interactions. */
  feedContext?: string;
}

const hashFeedViewPost = "feedViewPost";

export function isFeedViewPost<V>(v: V): v is FeedViewPost & V {
  return is$typed(v, id, hashFeedViewPost);
}

export function validateFeedViewPost<V>(
  v: V,
): ValidationResult<FeedViewPost & V> {
  return validate<FeedViewPost & V>(v, id, hashFeedViewPost);
}

export interface ReplyRef {
  $type?: "so.sprk.feed.defs#replyRef";
  root: $Typed<PostView> | $Typed<NotFoundPost> | $Typed<BlockedPost> | {
    $type: string;
  };
  parent:
    | $Typed<PostView>
    | $Typed<ReplyView>
    | $Typed<NotFoundPost>
    | $Typed<BlockedPost>
    | { $type: string };
  grandparentAuthor?: SoSprkActorDefs.ProfileViewBasic;
}

const hashReplyRef = "replyRef";

export function isReplyRef<V>(v: V): v is ReplyRef & V {
  return is$typed(v, id, hashReplyRef);
}

export function validateReplyRef<V>(v: V): ValidationResult<ReplyRef & V> {
  return validate<ReplyRef & V>(v, id, hashReplyRef);
}

export interface ThreadViewPost {
  $type?: "so.sprk.feed.defs#threadViewPost";
  post: $Typed<PostView> | $Typed<ReplyView> | { $type: string };
  parent?:
    | $Typed<ThreadViewPost>
    | $Typed<NotFoundPost>
    | $Typed<BlockedPost>
    | { $type: string };
  replies?:
    ($Typed<ThreadViewPost> | $Typed<NotFoundPost> | $Typed<BlockedPost> | {
      $type: string;
    })[];
  threadContext?: ThreadContext;
}

const hashThreadViewPost = "threadViewPost";

export function isThreadViewPost<V>(v: V): v is ThreadViewPost & V {
  return is$typed(v, id, hashThreadViewPost);
}

export function validateThreadViewPost<V>(
  v: V,
): ValidationResult<ThreadViewPost & V> {
  return validate<ThreadViewPost & V>(v, id, hashThreadViewPost);
}

export interface NotFoundPost {
  $type?: "so.sprk.feed.defs#notFoundPost";
  uri: string;
  notFound: true;
}

const hashNotFoundPost = "notFoundPost";

export function isNotFoundPost<V>(v: V): v is NotFoundPost & V {
  return is$typed(v, id, hashNotFoundPost);
}

export function validateNotFoundPost<V>(
  v: V,
): ValidationResult<NotFoundPost & V> {
  return validate<NotFoundPost & V>(v, id, hashNotFoundPost);
}

export interface BlockedPost {
  $type?: "so.sprk.feed.defs#blockedPost";
  uri: string;
  blocked: true;
  author: BlockedAuthor;
}

const hashBlockedPost = "blockedPost";

export function isBlockedPost<V>(v: V): v is BlockedPost & V {
  return is$typed(v, id, hashBlockedPost);
}

export function validateBlockedPost<V>(
  v: V,
): ValidationResult<BlockedPost & V> {
  return validate<BlockedPost & V>(v, id, hashBlockedPost);
}

export interface BlockedAuthor {
  $type?: "so.sprk.feed.defs#blockedAuthor";
  did: string;
  viewer?: SoSprkActorDefs.ViewerState;
}

const hashBlockedAuthor = "blockedAuthor";

export function isBlockedAuthor<V>(v: V): v is BlockedAuthor & V {
  return is$typed(v, id, hashBlockedAuthor);
}

export function validateBlockedAuthor<V>(
  v: V,
): ValidationResult<BlockedAuthor & V> {
  return validate<BlockedAuthor & V>(v, id, hashBlockedAuthor);
}

export interface GeneratorView {
  $type?: "so.sprk.feed.defs#generatorView";
  uri: string;
  cid: string;
  did: string;
  creator: SoSprkActorDefs.ProfileView;
  displayName: string;
  description?: string;
  descriptionFacets?: (SoSprkRichtextFacet.Main)[];
  avatar?: string;
  likeCount?: number;
  acceptsInteractions?: boolean;
  labels?: (ComAtprotoLabelDefs.Label)[];
  viewer?: GeneratorViewerState;
  indexedAt: string;
}

const hashGeneratorView = "generatorView";

export function isGeneratorView<V>(v: V): v is GeneratorView & V {
  return is$typed(v, id, hashGeneratorView);
}

export function validateGeneratorView<V>(
  v: V,
): ValidationResult<GeneratorView & V> {
  return validate<GeneratorView & V>(v, id, hashGeneratorView);
}

export interface GeneratorViewerState {
  $type?: "so.sprk.feed.defs#generatorViewerState";
  like?: string;
}

const hashGeneratorViewerState = "generatorViewerState";

export function isGeneratorViewerState<V>(v: V): v is GeneratorViewerState & V {
  return is$typed(v, id, hashGeneratorViewerState);
}

export function validateGeneratorViewerState<V>(
  v: V,
): ValidationResult<GeneratorViewerState & V> {
  return validate<GeneratorViewerState & V>(v, id, hashGeneratorViewerState);
}

export interface SkeletonFeedPost {
  $type?: "so.sprk.feed.defs#skeletonFeedPost";
  post: string;
  /** Context that will be passed through to client and may be passed to feed generator back alongside interactions. */
  feedContext?: string;
}

const hashSkeletonFeedPost = "skeletonFeedPost";

export function isSkeletonFeedPost<V>(v: V): v is SkeletonFeedPost & V {
  return is$typed(v, id, hashSkeletonFeedPost);
}

export function validateSkeletonFeedPost<V>(
  v: V,
): ValidationResult<SkeletonFeedPost & V> {
  return validate<SkeletonFeedPost & V>(v, id, hashSkeletonFeedPost);
}

export interface ThreadgateView {
  $type?: "so.sprk.feed.defs#threadgateView";
  uri?: string;
  cid?: string;
  record?: { [_ in string]: unknown };
}

const hashThreadgateView = "threadgateView";

export function isThreadgateView<V>(v: V): v is ThreadgateView & V {
  return is$typed(v, id, hashThreadgateView);
}

export function validateThreadgateView<V>(
  v: V,
): ValidationResult<ThreadgateView & V> {
  return validate<ThreadgateView & V>(v, id, hashThreadgateView);
}

export interface Interaction {
  $type?: "so.sprk.feed.defs#interaction";
  item?: string;
  event?:
    | "so.sprk.feed.defs#requestLess"
    | "so.sprk.feed.defs#requestMore"
    | "so.sprk.feed.defs#clickthroughItem"
    | "so.sprk.feed.defs#clickthroughAuthor"
    | "so.sprk.feed.defs#clickthroughReposter"
    | "so.sprk.feed.defs#clickthroughEmbed"
    | "so.sprk.feed.defs#interactionSeen"
    | "so.sprk.feed.defs#interactionLike"
    | "so.sprk.feed.defs#interactionRepost"
    | "so.sprk.feed.defs#interactionReply"
    | "so.sprk.feed.defs#interactionShare"
    | (string & globalThis.Record<PropertyKey, never>);
  /** Context on a feed item that was originally supplied by the feed generator on getFeedSkeleton. */
  feedContext?: string;
}

const hashInteraction = "interaction";

export function isInteraction<V>(v: V): v is Interaction & V {
  return is$typed(v, id, hashInteraction);
}

export function validateInteraction<V>(
  v: V,
): ValidationResult<Interaction & V> {
  return validate<Interaction & V>(v, id, hashInteraction);
}

/** Request that less content like the given feed item be shown in the feed */
export const REQUESTLESS: string = `${id}#requestLess`;
/** Request that more content like the given feed item be shown in the feed */
export const REQUESTMORE: string = `${id}#requestMore`;
/** User clicked through to the feed item */
export const CLICKTHROUGHITEM: string = `${id}#clickthroughItem`;
/** User clicked through to the author of the feed item */
export const CLICKTHROUGHAUTHOR: string = `${id}#clickthroughAuthor`;
/** User clicked through to the reposter of the feed item */
export const CLICKTHROUGHREPOSTER: string = `${id}#clickthroughReposter`;
/** User clicked through to the embedded content of the feed item */
export const CLICKTHROUGHEMBED: string = `${id}#clickthroughEmbed`;
/** Feed item was seen by user */
export const INTERACTIONSEEN: string = `${id}#interactionSeen`;
/** User liked the feed item */
export const INTERACTIONLIKE: string = `${id}#interactionLike`;
/** User reposted the feed item */
export const INTERACTIONREPOST: string = `${id}#interactionRepost`;
/** User replied to the feed item */
export const INTERACTIONREPLY: string = `${id}#interactionReply`;
/** User shared the feed item */
export const INTERACTIONSHARE: string = `${id}#interactionShare`;
