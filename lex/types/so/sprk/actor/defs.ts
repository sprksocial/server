/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { validate as _validate } from "../../../../lexicons.ts";
import { type $Typed, is$typed as _is$typed } from "../../../../util.ts";
import type * as ComAtprotoLabelDefs from "../../../com/atproto/label/defs.ts";
import type * as ComAtprotoRepoStrongRef from "../../../com/atproto/repo/strongRef.ts";
import type * as SoSprkFeedThreadgate from "../feed/threadgate.ts";

const is$typed = _is$typed, validate = _validate;
const id = "so.sprk.actor.defs";

export interface ProfileViewBasic {
  $type?: "so.sprk.actor.defs#profileViewBasic";
  did: string;
  handle: string;
  displayName?: string;
  avatar?: string;
  associated?: ProfileAssociated;
  viewer?: ViewerState;
  labels?: (ComAtprotoLabelDefs.Label)[];
  createdAt?: string;
  /** Recent stories from this profile author. */
  stories?: (ComAtprotoRepoStrongRef.Main)[];
}

const hashProfileViewBasic = "profileViewBasic";

export function isProfileViewBasic<V>(v: V) {
  return is$typed(v, id, hashProfileViewBasic);
}

export function validateProfileViewBasic<V>(v: V) {
  return validate<ProfileViewBasic & V>(v, id, hashProfileViewBasic);
}

export interface ProfileView {
  $type?: "so.sprk.actor.defs#profileView";
  did: string;
  handle: string;
  displayName?: string;
  description?: string;
  avatar?: string;
  associated?: ProfileAssociated;
  indexedAt?: string;
  createdAt?: string;
  viewer?: ViewerState;
  labels?: (ComAtprotoLabelDefs.Label)[];
}

const hashProfileView = "profileView";

export function isProfileView<V>(v: V) {
  return is$typed(v, id, hashProfileView);
}

export function validateProfileView<V>(v: V) {
  return validate<ProfileView & V>(v, id, hashProfileView);
}

export interface ProfileViewDetailed {
  $type?: "so.sprk.actor.defs#profileViewDetailed";
  did: string;
  handle: string;
  displayName?: string;
  description?: string;
  avatar?: string;
  banner?: string;
  followersCount?: number;
  followsCount?: number;
  postsCount?: number;
  associated?: ProfileAssociated;
  indexedAt?: string;
  createdAt?: string;
  viewer?: ViewerState;
  labels?: (ComAtprotoLabelDefs.Label)[];
  pinnedPost?: ComAtprotoRepoStrongRef.Main;
  /** Recent stories from this profile author. */
  stories?: (ComAtprotoRepoStrongRef.Main)[];
}

const hashProfileViewDetailed = "profileViewDetailed";

export function isProfileViewDetailed<V>(v: V) {
  return is$typed(v, id, hashProfileViewDetailed);
}

export function validateProfileViewDetailed<V>(v: V) {
  return validate<ProfileViewDetailed & V>(v, id, hashProfileViewDetailed);
}

export interface ProfileAssociated {
  $type?: "so.sprk.actor.defs#profileAssociated";
  feedgens?: number;
  labeler?: boolean;
  chat?: ProfileAssociatedChat;
}

const hashProfileAssociated = "profileAssociated";

export function isProfileAssociated<V>(v: V) {
  return is$typed(v, id, hashProfileAssociated);
}

export function validateProfileAssociated<V>(v: V) {
  return validate<ProfileAssociated & V>(v, id, hashProfileAssociated);
}

export interface ProfileAssociatedChat {
  $type?: "so.sprk.actor.defs#profileAssociatedChat";
  allowIncoming:
    | "all"
    | "none"
    | "following"
    | (string & globalThis.Record<PropertyKey, never>);
}

const hashProfileAssociatedChat = "profileAssociatedChat";

export function isProfileAssociatedChat<V>(v: V) {
  return is$typed(v, id, hashProfileAssociatedChat);
}

export function validateProfileAssociatedChat<V>(v: V) {
  return validate<ProfileAssociatedChat & V>(v, id, hashProfileAssociatedChat);
}

/** Metadata about the requesting account's relationship with the subject account. Only has meaningful content for authed requests. */
export interface ViewerState {
  $type?: "so.sprk.actor.defs#viewerState";
  muted?: boolean;
  blockedBy?: boolean;
  blocking?: string;
  following?: string;
  followedBy?: string;
  knownFollowers?: KnownFollowers;
}

const hashViewerState = "viewerState";

export function isViewerState<V>(v: V) {
  return is$typed(v, id, hashViewerState);
}

export function validateViewerState<V>(v: V) {
  return validate<ViewerState & V>(v, id, hashViewerState);
}

/** The subject's followers whom you also follow */
export interface KnownFollowers {
  $type?: "so.sprk.actor.defs#knownFollowers";
  count: number;
  followers: (ProfileViewBasic)[];
}

const hashKnownFollowers = "knownFollowers";

export function isKnownFollowers<V>(v: V) {
  return is$typed(v, id, hashKnownFollowers);
}

export function validateKnownFollowers<V>(v: V) {
  return validate<KnownFollowers & V>(v, id, hashKnownFollowers);
}

export type Preferences = (
  | $Typed<ContentLabelPref>
  | $Typed<SavedFeedsPref>
  | $Typed<PersonalDetailsPref>
  | $Typed<FeedViewPref>
  | $Typed<ThreadViewPref>
  | $Typed<InterestsPref>
  | $Typed<MutedWordsPref>
  | $Typed<HiddenPostsPref>
  | $Typed<LabelersPref>
  | $Typed<PostInteractionSettingsPref>
  | { $type: string }
)[];

export interface ContentLabelPref {
  $type?: "so.sprk.actor.defs#contentLabelPref";
  /** Which labeler does this preference apply to? If undefined, applies globally. */
  labelerDid?: string;
  label: string;
  visibility:
    | "ignore"
    | "show"
    | "warn"
    | "hide"
    | (string & globalThis.Record<PropertyKey, never>);
}

const hashContentLabelPref = "contentLabelPref";

export function isContentLabelPref<V>(v: V) {
  return is$typed(v, id, hashContentLabelPref);
}

export function validateContentLabelPref<V>(v: V) {
  return validate<ContentLabelPref & V>(v, id, hashContentLabelPref);
}

export interface SavedFeed {
  $type?: "so.sprk.actor.defs#savedFeed";
  id: string;
  type: "feed" | "timeline" | (string & globalThis.Record<PropertyKey, never>);
  value: string;
  pinned: boolean;
}

const hashSavedFeed = "savedFeed";

export function isSavedFeed<V>(v: V) {
  return is$typed(v, id, hashSavedFeed);
}

export function validateSavedFeed<V>(v: V) {
  return validate<SavedFeed & V>(v, id, hashSavedFeed);
}

export interface SavedFeedsPref {
  $type?: "so.sprk.actor.defs#savedFeedsPref";
  items: (SavedFeed)[];
}

const hashSavedFeedsPref = "savedFeedsPref";

export function isSavedFeedsPref<V>(v: V) {
  return is$typed(v, id, hashSavedFeedsPref);
}

export function validateSavedFeedsPref<V>(v: V) {
  return validate<SavedFeedsPref & V>(v, id, hashSavedFeedsPref);
}

export interface PersonalDetailsPref {
  $type?: "so.sprk.actor.defs#personalDetailsPref";
  /** The birth date of account owner. */
  birthDate?: string;
}

const hashPersonalDetailsPref = "personalDetailsPref";

export function isPersonalDetailsPref<V>(v: V) {
  return is$typed(v, id, hashPersonalDetailsPref);
}

export function validatePersonalDetailsPref<V>(v: V) {
  return validate<PersonalDetailsPref & V>(v, id, hashPersonalDetailsPref);
}

export interface FeedViewPref {
  $type?: "so.sprk.actor.defs#feedViewPref";
  /** The URI of the feed, or an identifier which describes the feed. */
  feed: string;
  /** Hide replies in the feed. */
  hideReplies?: boolean;
  /** Hide replies in the feed if they are not by followed users. */
  hideRepliesByUnfollowed: boolean;
  /** Hide replies in the feed if they do not have this number of likes. */
  hideRepliesByLikeCount?: number;
  /** Hide replies in the feed if they do not have this number of looks. */
  hideRepliesByLookCount?: number;
  /** Hide reposts in the feed. */
  hideReposts?: boolean;
  /** Hide quote posts in the feed. */
  hideQuotePosts?: boolean;
}

const hashFeedViewPref = "feedViewPref";

export function isFeedViewPref<V>(v: V) {
  return is$typed(v, id, hashFeedViewPref);
}

export function validateFeedViewPref<V>(v: V) {
  return validate<FeedViewPref & V>(v, id, hashFeedViewPref);
}

export interface ThreadViewPref {
  $type?: "so.sprk.actor.defs#threadViewPref";
  /** Sorting mode for threads. */
  sort?:
    | "oldest"
    | "newest"
    | "most-likes"
    | "most-looks"
    | "random"
    | "hotness"
    | (string & globalThis.Record<PropertyKey, never>);
}

const hashThreadViewPref = "threadViewPref";

export function isThreadViewPref<V>(v: V) {
  return is$typed(v, id, hashThreadViewPref);
}

export function validateThreadViewPref<V>(v: V) {
  return validate<ThreadViewPref & V>(v, id, hashThreadViewPref);
}

export interface InterestsPref {
  $type?: "so.sprk.actor.defs#interestsPref";
  /** A list of tags which describe the account owner's interests gathered during onboarding. */
  tags: (string)[];
}

const hashInterestsPref = "interestsPref";

export function isInterestsPref<V>(v: V) {
  return is$typed(v, id, hashInterestsPref);
}

export function validateInterestsPref<V>(v: V) {
  return validate<InterestsPref & V>(v, id, hashInterestsPref);
}

export type MutedWordTarget =
  | "content"
  | "tag"
  | (string & globalThis.Record<PropertyKey, never>);

/** A word that the account owner has muted. */
export interface MutedWord {
  $type?: "so.sprk.actor.defs#mutedWord";
  id?: string;
  /** The muted word itself. */
  value: string;
  /** The intended targets of the muted word. */
  targets: (MutedWordTarget)[];
  /** Groups of users to apply the muted word to. If undefined, applies to all users. */
  actorTarget:
    | "all"
    | "exclude-following"
    | (string & globalThis.Record<PropertyKey, never>);
  /** The date and time at which the muted word will expire and no longer be applied. */
  expiresAt?: string;
}

const hashMutedWord = "mutedWord";

export function isMutedWord<V>(v: V) {
  return is$typed(v, id, hashMutedWord);
}

export function validateMutedWord<V>(v: V) {
  return validate<MutedWord & V>(v, id, hashMutedWord);
}

export interface MutedWordsPref {
  $type?: "so.sprk.actor.defs#mutedWordsPref";
  /** A list of words the account owner has muted. */
  items: (MutedWord)[];
}

const hashMutedWordsPref = "mutedWordsPref";

export function isMutedWordsPref<V>(v: V) {
  return is$typed(v, id, hashMutedWordsPref);
}

export function validateMutedWordsPref<V>(v: V) {
  return validate<MutedWordsPref & V>(v, id, hashMutedWordsPref);
}

export interface HiddenPostsPref {
  $type?: "so.sprk.actor.defs#hiddenPostsPref";
  /** A list of URIs of posts the account owner has hidden. */
  items: (string)[];
}

const hashHiddenPostsPref = "hiddenPostsPref";

export function isHiddenPostsPref<V>(v: V) {
  return is$typed(v, id, hashHiddenPostsPref);
}

export function validateHiddenPostsPref<V>(v: V) {
  return validate<HiddenPostsPref & V>(v, id, hashHiddenPostsPref);
}

export interface LabelersPref {
  $type?: "so.sprk.actor.defs#labelersPref";
  labelers: (LabelerPrefItem)[];
}

const hashLabelersPref = "labelersPref";

export function isLabelersPref<V>(v: V) {
  return is$typed(v, id, hashLabelersPref);
}

export function validateLabelersPref<V>(v: V) {
  return validate<LabelersPref & V>(v, id, hashLabelersPref);
}

export interface LabelerPrefItem {
  $type?: "so.sprk.actor.defs#labelerPrefItem";
  did: string;
}

const hashLabelerPrefItem = "labelerPrefItem";

export function isLabelerPrefItem<V>(v: V) {
  return is$typed(v, id, hashLabelerPrefItem);
}

export function validateLabelerPrefItem<V>(v: V) {
  return validate<LabelerPrefItem & V>(v, id, hashLabelerPrefItem);
}

/** Default post interaction settings for the account. These values should be applied as default values when creating new posts. These refs should mirror the threadgate and postgate records exactly. */
export interface PostInteractionSettingsPref {
  $type?: "so.sprk.actor.defs#postInteractionSettingsPref";
  /** Matches threadgate record. List of rules defining who can reply to this users posts. If value is an empty array, no one can reply. If value is undefined, anyone can reply. */
  threadgateAllowRules?: (
    | $Typed<SoSprkFeedThreadgate.MentionRule>
    | $Typed<SoSprkFeedThreadgate.FollowerRule>
    | $Typed<SoSprkFeedThreadgate.FollowingRule>
    | { $type: string }
  )[];
}

const hashPostInteractionSettingsPref = "postInteractionSettingsPref";

export function isPostInteractionSettingsPref<V>(v: V) {
  return is$typed(v, id, hashPostInteractionSettingsPref);
}

export function validatePostInteractionSettingsPref<V>(v: V) {
  return validate<PostInteractionSettingsPref & V>(
    v,
    id,
    hashPostInteractionSettingsPref,
  );
}
