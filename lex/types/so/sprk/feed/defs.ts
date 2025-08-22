/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { validate as _validate } from "../../../../lexicons.ts";
import { is$typed as _is$typed } from "../../../../util.ts";
import { type $Typed } from "../../../../util.ts";
import type * as SoSprkActorDefs from "../actor/defs.ts";
import type * as SoSprkEmbedImages from "../embed/images.ts";
import type * as SoSprkEmbedVideo from "../embed/video.ts";
import type * as ComAtprotoLabelDefs from "../../../com/atproto/label/defs.ts";
import type * as SoSprkRichtextFacet from "../richtext/facet.ts";
import type * as SoSprkGraphDefs from "../graph/defs.ts";

const is$typed = _is$typed, validate = _validate;
const id = "so.sprk.feed.defs";

export interface StoryView {
  $type?: "so.sprk.feed.defs#storyView";
  uri: string;
  cid: string;
  author: SoSprkActorDefs.ProfileViewBasic;
  record: { [_ in string]: unknown };
  media?: $Typed<SoSprkEmbedImages.View> | $Typed<SoSprkEmbedVideo.View> | {
    $type: string;
  };
  indexedAt: string;
}

const hashStoryView = "storyView";

export function isStoryView<V>(v: V) {
  return is$typed(v, id, hashStoryView);
}

export function validateStoryView<V>(v: V) {
  return validate<StoryView & V>(v, id, hashStoryView);
}

export interface PostView {
  $type?: "so.sprk.feed.defs#postView";
  uri: string;
  cid: string;
  author: SoSprkActorDefs.ProfileViewBasic;
  record: { [_ in string]: unknown };
  embed?: $Typed<SoSprkEmbedImages.View> | $Typed<SoSprkEmbedVideo.View> | {
    $type: string;
  };
  sound?: AudioView;
  replyCount?: number;
  repostCount?: number;
  likeCount?: number;
  lookCount?: number;
  indexedAt: string;
  viewer?: ViewerState;
  labels?: (ComAtprotoLabelDefs.Label)[];
  threadgate?: ThreadgateView;
}

const hashPostView = "postView";

export function isPostView<V>(v: V) {
  return is$typed(v, id, hashPostView);
}

export function validatePostView<V>(v: V) {
  return validate<PostView & V>(v, id, hashPostView);
}

/** Metadata about the audio content. */
export interface AudioDetails {
  $type?: "so.sprk.feed.defs#audioDetails";
  artist?: string;
  title?: string;
}

const hashAudioDetails = "audioDetails";

export function isAudioDetails<V>(v: V) {
  return is$typed(v, id, hashAudioDetails);
}

export function validateAudioDetails<V>(v: V) {
  return validate<AudioDetails & V>(v, id, hashAudioDetails);
}

export interface AudioView {
  $type?: "so.sprk.feed.defs#audioView";
  uri: string;
  cid: string;
  author: SoSprkActorDefs.ProfileViewBasic;
  record: { [_ in string]: unknown };
  useCount?: number;
  title: string;
  coverArt: string;
  details?: AudioDetails;
  indexedAt: string;
  labels?: (ComAtprotoLabelDefs.Label)[];
}

const hashAudioView = "audioView";

export function isAudioView<V>(v: V) {
  return is$typed(v, id, hashAudioView);
}

export function validateAudioView<V>(v: V) {
  return validate<AudioView & V>(v, id, hashAudioView);
}

/** Metadata about the requesting account's relationship with the subject content. Only has meaningful content for authed requests. */
export interface ViewerState {
  $type?: "so.sprk.feed.defs#viewerState";
  repost?: string;
  like?: string;
  look?: string;
  threadMuted?: boolean;
  replyDisabled?: boolean;
  embeddingDisabled?: boolean;
  pinned?: boolean;
}

const hashViewerState = "viewerState";

export function isViewerState<V>(v: V) {
  return is$typed(v, id, hashViewerState);
}

export function validateViewerState<V>(v: V) {
  return validate<ViewerState & V>(v, id, hashViewerState);
}

/** Metadata about this post within the context of the thread it is in. */
export interface ThreadContext {
  $type?: "so.sprk.feed.defs#threadContext";
  rootAuthorLike?: string;
}

const hashThreadContext = "threadContext";

export function isThreadContext<V>(v: V) {
  return is$typed(v, id, hashThreadContext);
}

export function validateThreadContext<V>(v: V) {
  return validate<ThreadContext & V>(v, id, hashThreadContext);
}

export interface FeedViewPost {
  $type?: "so.sprk.feed.defs#feedViewPost";
  post: PostView;
  reply?: ReplyRef;
  reason?: $Typed<ReasonRepost> | $Typed<ReasonPin> | { $type: string };
  /** Context provided by feed generator that may be passed back alongside interactions. */
  feedContext?: string;
}

const hashFeedViewPost = "feedViewPost";

export function isFeedViewPost<V>(v: V) {
  return is$typed(v, id, hashFeedViewPost);
}

export function validateFeedViewPost<V>(v: V) {
  return validate<FeedViewPost & V>(v, id, hashFeedViewPost);
}

export interface FeedViewStory {
  $type?: "so.sprk.feed.defs#feedViewStory";
  story: StoryView;
}

const hashFeedViewStory = "feedViewStory";

export function isFeedViewStory<V>(v: V) {
  return is$typed(v, id, hashFeedViewStory);
}

export function validateFeedViewStory<V>(v: V) {
  return validate<FeedViewStory & V>(v, id, hashFeedViewStory);
}

export interface StoriesByAuthor {
  $type?: "so.sprk.feed.defs#storiesByAuthor";
  author: SoSprkActorDefs.ProfileViewBasic;
  stories: (StoryView)[];
}

const hashStoriesByAuthor = "storiesByAuthor";

export function isStoriesByAuthor<V>(v: V) {
  return is$typed(v, id, hashStoriesByAuthor);
}

export function validateStoriesByAuthor<V>(v: V) {
  return validate<StoriesByAuthor & V>(v, id, hashStoriesByAuthor);
}

export interface ReplyRef {
  $type?: "so.sprk.feed.defs#replyRef";
  root: $Typed<PostView> | $Typed<NotFoundPost> | $Typed<BlockedPost> | {
    $type: string;
  };
  parent: $Typed<PostView> | $Typed<NotFoundPost> | $Typed<BlockedPost> | {
    $type: string;
  };
  grandparentAuthor?: SoSprkActorDefs.ProfileViewBasic;
}

const hashReplyRef = "replyRef";

export function isReplyRef<V>(v: V) {
  return is$typed(v, id, hashReplyRef);
}

export function validateReplyRef<V>(v: V) {
  return validate<ReplyRef & V>(v, id, hashReplyRef);
}

export interface ReasonRepost {
  $type?: "so.sprk.feed.defs#reasonRepost";
  by: SoSprkActorDefs.ProfileViewBasic;
  indexedAt: string;
}

const hashReasonRepost = "reasonRepost";

export function isReasonRepost<V>(v: V) {
  return is$typed(v, id, hashReasonRepost);
}

export function validateReasonRepost<V>(v: V) {
  return validate<ReasonRepost & V>(v, id, hashReasonRepost);
}

export interface ReasonPin {
  $type?: "so.sprk.feed.defs#reasonPin";
}

const hashReasonPin = "reasonPin";

export function isReasonPin<V>(v: V) {
  return is$typed(v, id, hashReasonPin);
}

export function validateReasonPin<V>(v: V) {
  return validate<ReasonPin & V>(v, id, hashReasonPin);
}

export interface ThreadViewPost {
  $type?: "so.sprk.feed.defs#threadViewPost";
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

export function isThreadViewPost<V>(v: V) {
  return is$typed(v, id, hashThreadViewPost);
}

export function validateThreadViewPost<V>(v: V) {
  return validate<ThreadViewPost & V>(v, id, hashThreadViewPost);
}

export interface NotFoundPost {
  $type?: "so.sprk.feed.defs#notFoundPost";
  uri: string;
  notFound: true;
}

const hashNotFoundPost = "notFoundPost";

export function isNotFoundPost<V>(v: V) {
  return is$typed(v, id, hashNotFoundPost);
}

export function validateNotFoundPost<V>(v: V) {
  return validate<NotFoundPost & V>(v, id, hashNotFoundPost);
}

export interface BlockedPost {
  $type?: "so.sprk.feed.defs#blockedPost";
  uri: string;
  blocked: true;
  author: BlockedAuthor;
}

const hashBlockedPost = "blockedPost";

export function isBlockedPost<V>(v: V) {
  return is$typed(v, id, hashBlockedPost);
}

export function validateBlockedPost<V>(v: V) {
  return validate<BlockedPost & V>(v, id, hashBlockedPost);
}

export interface BlockedAuthor {
  $type?: "so.sprk.feed.defs#blockedAuthor";
  did: string;
  viewer?: SoSprkActorDefs.ViewerState;
}

const hashBlockedAuthor = "blockedAuthor";

export function isBlockedAuthor<V>(v: V) {
  return is$typed(v, id, hashBlockedAuthor);
}

export function validateBlockedAuthor<V>(v: V) {
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
  lookCount?: number;
  acceptsInteractions?: boolean;
  labels?: (ComAtprotoLabelDefs.Label)[];
  viewer?: GeneratorViewerState;
  contentMode?:
    | "so.sprk.feed.defs#contentModeUnspecified"
    | "so.sprk.feed.defs#contentModeVideo"
    | (string & globalThis.Record<PropertyKey, never>);
  indexedAt: string;
}

const hashGeneratorView = "generatorView";

export function isGeneratorView<V>(v: V) {
  return is$typed(v, id, hashGeneratorView);
}

export function validateGeneratorView<V>(v: V) {
  return validate<GeneratorView & V>(v, id, hashGeneratorView);
}

export interface GeneratorViewerState {
  $type?: "so.sprk.feed.defs#generatorViewerState";
  like?: string;
  look?: string;
}

const hashGeneratorViewerState = "generatorViewerState";

export function isGeneratorViewerState<V>(v: V) {
  return is$typed(v, id, hashGeneratorViewerState);
}

export function validateGeneratorViewerState<V>(v: V) {
  return validate<GeneratorViewerState & V>(v, id, hashGeneratorViewerState);
}

export interface SkeletonFeedPost {
  $type?: "so.sprk.feed.defs#skeletonFeedPost";
  post: string;
  reason?: $Typed<SkeletonReasonRepost> | $Typed<SkeletonReasonPin> | {
    $type: string;
  };
  /** Context that will be passed through to client and may be passed to feed generator back alongside interactions. */
  feedContext?: string;
}

const hashSkeletonFeedPost = "skeletonFeedPost";

export function isSkeletonFeedPost<V>(v: V) {
  return is$typed(v, id, hashSkeletonFeedPost);
}

export function validateSkeletonFeedPost<V>(v: V) {
  return validate<SkeletonFeedPost & V>(v, id, hashSkeletonFeedPost);
}

export interface SkeletonReasonRepost {
  $type?: "so.sprk.feed.defs#skeletonReasonRepost";
  repost: string;
}

const hashSkeletonReasonRepost = "skeletonReasonRepost";

export function isSkeletonReasonRepost<V>(v: V) {
  return is$typed(v, id, hashSkeletonReasonRepost);
}

export function validateSkeletonReasonRepost<V>(v: V) {
  return validate<SkeletonReasonRepost & V>(v, id, hashSkeletonReasonRepost);
}

export interface SkeletonReasonPin {
  $type?: "so.sprk.feed.defs#skeletonReasonPin";
}

const hashSkeletonReasonPin = "skeletonReasonPin";

export function isSkeletonReasonPin<V>(v: V) {
  return is$typed(v, id, hashSkeletonReasonPin);
}

export function validateSkeletonReasonPin<V>(v: V) {
  return validate<SkeletonReasonPin & V>(v, id, hashSkeletonReasonPin);
}

export interface ThreadgateView {
  $type?: "so.sprk.feed.defs#threadgateView";
  uri?: string;
  cid?: string;
  record?: { [_ in string]: unknown };
  lists?: (SoSprkGraphDefs.ListViewBasic)[];
}

const hashThreadgateView = "threadgateView";

export function isThreadgateView<V>(v: V) {
  return is$typed(v, id, hashThreadgateView);
}

export function validateThreadgateView<V>(v: V) {
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
    | "so.sprk.feed.defs#interactionQuote"
    | "so.sprk.feed.defs#interactionShare"
    | (string & globalThis.Record<PropertyKey, never>);
  /** Context on a feed item that was originally supplied by the feed generator on getFeedSkeleton. */
  feedContext?: string;
}

const hashInteraction = "interaction";

export function isInteraction<V>(v: V) {
  return is$typed(v, id, hashInteraction);
}

export function validateInteraction<V>(v: V) {
  return validate<Interaction & V>(v, id, hashInteraction);
}

/** Request that less content like the given feed item be shown in the feed */
export const REQUESTLESS = `${id}#requestLess`;
/** Request that more content like the given feed item be shown in the feed */
export const REQUESTMORE = `${id}#requestMore`;
/** User clicked through to the feed item */
export const CLICKTHROUGHITEM = `${id}#clickthroughItem`;
/** User clicked through to the author of the feed item */
export const CLICKTHROUGHAUTHOR = `${id}#clickthroughAuthor`;
/** User clicked through to the reposter of the feed item */
export const CLICKTHROUGHREPOSTER = `${id}#clickthroughReposter`;
/** User clicked through to the embedded content of the feed item */
export const CLICKTHROUGHEMBED = `${id}#clickthroughEmbed`;
/** Declares the feed generator returns any types of posts. */
export const CONTENTMODEUNSPECIFIED = `${id}#contentModeUnspecified`;
/** Declares the feed generator returns posts containing so.sprk.embed.video embeds. */
export const CONTENTMODEVIDEO = `${id}#contentModeVideo`;
/** Feed item was seen by user */
export const INTERACTIONSEEN = `${id}#interactionSeen`;
/** User liked the feed item */
export const INTERACTIONLIKE = `${id}#interactionLike`;
/** User reposted the feed item */
export const INTERACTIONREPOST = `${id}#interactionRepost`;
/** User replied to the feed item */
export const INTERACTIONREPLY = `${id}#interactionReply`;
/** User quoted the feed item */
export const INTERACTIONQUOTE = `${id}#interactionQuote`;
/** User shared the feed item */
export const INTERACTIONSHARE = `${id}#interactionShare`;
