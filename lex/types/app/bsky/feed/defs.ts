/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { validate as _validate } from "../../../../lexicons.ts";
import type { ValidationResult } from "@atp/lexicon";
import { type $Typed, is$typed as _is$typed } from "../../../../util.ts";
import type * as AppBskyActorDefs from "../actor/defs.ts";
import type * as AppBskyEmbedImages from "../embed/images.ts";
import type * as AppBskyEmbedVideo from "../embed/video.ts";
import type * as AppBskyEmbedExternal from "../embed/external.ts";
import type * as AppBskyEmbedRecord from "../embed/record.ts";
import type * as AppBskyEmbedRecordWithMedia from "../embed/recordWithMedia.ts";
import type * as ComAtprotoLabelDefs from "../../../com/atproto/label/defs.ts";
import type * as AppBskyRichtextFacet from "../richtext/facet.ts";
import type * as AppBskyGraphDefs from "../graph/defs.ts";

const is$typed = _is$typed, validate = _validate;
const id = "app.bsky.feed.defs";

export interface PostView {
  $type?: "app.bsky.feed.defs#postView";
  uri: string;
  cid: string;
  author: AppBskyActorDefs.ProfileViewBasic;
  record: { [_ in string]: unknown };
  embed?:
    | $Typed<AppBskyEmbedImages.View>
    | $Typed<AppBskyEmbedVideo.View>
    | $Typed<AppBskyEmbedExternal.View>
    | $Typed<AppBskyEmbedRecord.View>
    | $Typed<AppBskyEmbedRecordWithMedia.View>
    | { $type: string };
  bookmarkCount?: number;
  replyCount?: number;
  repostCount?: number;
  likeCount?: number;
  quoteCount?: number;
  indexedAt: string;
  viewer?: ViewerState;
  labels?: (ComAtprotoLabelDefs.Label)[];
  threadgate?: ThreadgateView;
  /** Debug information for internal development */
  debug?: { [_ in string]: unknown };
}

const hashPostView = "postView";

export function isPostView<V>(v: V): v is PostView & V {
  return is$typed(v, id, hashPostView);
}

export function validatePostView<V>(v: V): ValidationResult<PostView & V> {
  return validate<PostView & V>(v, id, hashPostView);
}

/** Metadata about the requesting account's relationship with the subject content. Only has meaningful content for authed requests. */
export interface ViewerState {
  $type?: "app.bsky.feed.defs#viewerState";
  repost?: string;
  like?: string;
  bookmarked?: boolean;
  threadMuted?: boolean;
  replyDisabled?: boolean;
  embeddingDisabled?: boolean;
  pinned?: boolean;
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

/** Metadata about this post within the context of the thread it is in. */
export interface ThreadContext {
  $type?: "app.bsky.feed.defs#threadContext";
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
  $type?: "app.bsky.feed.defs#feedViewPost";
  post: PostView;
  reply?: ReplyRef;
  reason?: $Typed<ReasonRepost> | $Typed<ReasonPin> | { $type: string };
  /** Context provided by feed generator that may be passed back alongside interactions. */
  feedContext?: string;
  /** Unique identifier per request that may be passed back alongside interactions. */
  reqId?: string;
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
  $type?: "app.bsky.feed.defs#replyRef";
  root: $Typed<PostView> | $Typed<NotFoundPost> | $Typed<BlockedPost> | {
    $type: string;
  };
  parent: $Typed<PostView> | $Typed<NotFoundPost> | $Typed<BlockedPost> | {
    $type: string;
  };
  grandparentAuthor?: AppBskyActorDefs.ProfileViewBasic;
}

const hashReplyRef = "replyRef";

export function isReplyRef<V>(v: V): v is ReplyRef & V {
  return is$typed(v, id, hashReplyRef);
}

export function validateReplyRef<V>(v: V): ValidationResult<ReplyRef & V> {
  return validate<ReplyRef & V>(v, id, hashReplyRef);
}

export interface ReasonRepost {
  $type?: "app.bsky.feed.defs#reasonRepost";
  by: AppBskyActorDefs.ProfileViewBasic;
  uri?: string;
  cid?: string;
  indexedAt: string;
}

const hashReasonRepost = "reasonRepost";

export function isReasonRepost<V>(v: V): v is ReasonRepost & V {
  return is$typed(v, id, hashReasonRepost);
}

export function validateReasonRepost<V>(
  v: V,
): ValidationResult<ReasonRepost & V> {
  return validate<ReasonRepost & V>(v, id, hashReasonRepost);
}

export interface ReasonPin {
  $type?: "app.bsky.feed.defs#reasonPin";
}

const hashReasonPin = "reasonPin";

export function isReasonPin<V>(v: V): v is ReasonPin & V {
  return is$typed(v, id, hashReasonPin);
}

export function validateReasonPin<V>(v: V): ValidationResult<ReasonPin & V> {
  return validate<ReasonPin & V>(v, id, hashReasonPin);
}

export interface ThreadViewPost {
  $type?: "app.bsky.feed.defs#threadViewPost";
  post: PostView;
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
  $type?: "app.bsky.feed.defs#notFoundPost";
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
  $type?: "app.bsky.feed.defs#blockedPost";
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
  $type?: "app.bsky.feed.defs#blockedAuthor";
  did: string;
  viewer?: AppBskyActorDefs.ViewerState;
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
  $type?: "app.bsky.feed.defs#generatorView";
  uri: string;
  cid: string;
  did: string;
  creator: AppBskyActorDefs.ProfileView;
  displayName: string;
  description?: string;
  descriptionFacets?: (AppBskyRichtextFacet.Main)[];
  avatar?: string;
  likeCount?: number;
  acceptsInteractions?: boolean;
  labels?: (ComAtprotoLabelDefs.Label)[];
  viewer?: GeneratorViewerState;
  contentMode?:
    | "app.bsky.feed.defs#contentModeUnspecified"
    | "app.bsky.feed.defs#contentModeVideo"
    | (string & globalThis.Record<PropertyKey, never>);
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
  $type?: "app.bsky.feed.defs#generatorViewerState";
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
  $type?: "app.bsky.feed.defs#skeletonFeedPost";
  post: string;
  reason?: $Typed<SkeletonReasonRepost> | $Typed<SkeletonReasonPin> | {
    $type: string;
  };
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

export interface SkeletonReasonRepost {
  $type?: "app.bsky.feed.defs#skeletonReasonRepost";
  repost: string;
}

const hashSkeletonReasonRepost = "skeletonReasonRepost";

export function isSkeletonReasonRepost<V>(v: V): v is SkeletonReasonRepost & V {
  return is$typed(v, id, hashSkeletonReasonRepost);
}

export function validateSkeletonReasonRepost<V>(
  v: V,
): ValidationResult<SkeletonReasonRepost & V> {
  return validate<SkeletonReasonRepost & V>(v, id, hashSkeletonReasonRepost);
}

export interface SkeletonReasonPin {
  $type?: "app.bsky.feed.defs#skeletonReasonPin";
}

const hashSkeletonReasonPin = "skeletonReasonPin";

export function isSkeletonReasonPin<V>(v: V): v is SkeletonReasonPin & V {
  return is$typed(v, id, hashSkeletonReasonPin);
}

export function validateSkeletonReasonPin<V>(
  v: V,
): ValidationResult<SkeletonReasonPin & V> {
  return validate<SkeletonReasonPin & V>(v, id, hashSkeletonReasonPin);
}

export interface ThreadgateView {
  $type?: "app.bsky.feed.defs#threadgateView";
  uri?: string;
  cid?: string;
  record?: { [_ in string]: unknown };
  lists?: (AppBskyGraphDefs.ListViewBasic)[];
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
  $type?: "app.bsky.feed.defs#interaction";
  item?: string;
  event?:
    | "app.bsky.feed.defs#requestLess"
    | "app.bsky.feed.defs#requestMore"
    | "app.bsky.feed.defs#clickthroughItem"
    | "app.bsky.feed.defs#clickthroughAuthor"
    | "app.bsky.feed.defs#clickthroughReposter"
    | "app.bsky.feed.defs#clickthroughEmbed"
    | "app.bsky.feed.defs#interactionSeen"
    | "app.bsky.feed.defs#interactionLike"
    | "app.bsky.feed.defs#interactionRepost"
    | "app.bsky.feed.defs#interactionReply"
    | "app.bsky.feed.defs#interactionQuote"
    | "app.bsky.feed.defs#interactionShare"
    | (string & globalThis.Record<PropertyKey, never>);
  /** Context on a feed item that was originally supplied by the feed generator on getFeedSkeleton. */
  feedContext?: string;
  /** Unique identifier per request that may be passed back alongside interactions. */
  reqId?: string;
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
/** Declares the feed generator returns any types of posts. */
export const CONTENTMODEUNSPECIFIED: string = `${id}#contentModeUnspecified`;
/** Declares the feed generator returns posts containing app.bsky.embed.video embeds. */
export const CONTENTMODEVIDEO: string = `${id}#contentModeVideo`;
/** Feed item was seen by user */
export const INTERACTIONSEEN: string = `${id}#interactionSeen`;
/** User liked the feed item */
export const INTERACTIONLIKE: string = `${id}#interactionLike`;
/** User reposted the feed item */
export const INTERACTIONREPOST: string = `${id}#interactionRepost`;
/** User replied to the feed item */
export const INTERACTIONREPLY: string = `${id}#interactionReply`;
/** User quoted the feed item */
export const INTERACTIONQUOTE: string = `${id}#interactionQuote`;
/** User shared the feed item */
export const INTERACTIONSHARE: string = `${id}#interactionShare`;
