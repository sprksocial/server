/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { validate as _validate } from "../../../../lexicons.ts";
import type { ValidationResult } from "@atp/lexicon";
import { type $Typed, is$typed as _is$typed } from "../../../../util.ts";
import type * as ComAtprotoLabelDefs from "../../../com/atproto/label/defs.ts";
import type * as AppBskyGraphDefs from "../graph/defs.ts";
import type * as ComAtprotoRepoStrongRef from "../../../com/atproto/repo/strongRef.ts";
import type * as AppBskyNotificationDefs from "../notification/defs.ts";
import type * as AppBskyFeedThreadgate from "../feed/threadgate.ts";
import type * as AppBskyFeedPostgate from "../feed/postgate.ts";
import type * as AppBskyEmbedExternal from "../embed/external.ts";

const is$typed = _is$typed, validate = _validate;
const id = "app.bsky.actor.defs";

export interface ProfileViewBasic {
  $type?: "app.bsky.actor.defs#profileViewBasic";
  did: string;
  handle: string;
  displayName?: string;
  pronouns?: string;
  avatar?: string;
  associated?: ProfileAssociated;
  viewer?: ViewerState;
  labels?: (ComAtprotoLabelDefs.Label)[];
  createdAt?: string;
  verification?: VerificationState;
  status?: StatusView;
  /** Debug information for internal development */
  debug?: { [_ in string]: unknown };
}

const hashProfileViewBasic = "profileViewBasic";

export function isProfileViewBasic<V>(v: V): v is ProfileViewBasic & V {
  return is$typed(v, id, hashProfileViewBasic);
}

export function validateProfileViewBasic<V>(
  v: V,
): ValidationResult<ProfileViewBasic & V> {
  return validate<ProfileViewBasic & V>(v, id, hashProfileViewBasic);
}

export interface ProfileView {
  $type?: "app.bsky.actor.defs#profileView";
  did: string;
  handle: string;
  displayName?: string;
  pronouns?: string;
  description?: string;
  avatar?: string;
  associated?: ProfileAssociated;
  indexedAt?: string;
  createdAt?: string;
  viewer?: ViewerState;
  labels?: (ComAtprotoLabelDefs.Label)[];
  verification?: VerificationState;
  status?: StatusView;
  /** Debug information for internal development */
  debug?: { [_ in string]: unknown };
}

const hashProfileView = "profileView";

export function isProfileView<V>(v: V): v is ProfileView & V {
  return is$typed(v, id, hashProfileView);
}

export function validateProfileView<V>(
  v: V,
): ValidationResult<ProfileView & V> {
  return validate<ProfileView & V>(v, id, hashProfileView);
}

export interface ProfileViewDetailed {
  $type?: "app.bsky.actor.defs#profileViewDetailed";
  did: string;
  handle: string;
  displayName?: string;
  description?: string;
  pronouns?: string;
  website?: string;
  avatar?: string;
  banner?: string;
  followersCount?: number;
  followsCount?: number;
  postsCount?: number;
  associated?: ProfileAssociated;
  joinedViaStarterPack?: AppBskyGraphDefs.StarterPackViewBasic;
  indexedAt?: string;
  createdAt?: string;
  viewer?: ViewerState;
  labels?: (ComAtprotoLabelDefs.Label)[];
  pinnedPost?: ComAtprotoRepoStrongRef.Main;
  verification?: VerificationState;
  status?: StatusView;
  /** Debug information for internal development */
  debug?: { [_ in string]: unknown };
}

const hashProfileViewDetailed = "profileViewDetailed";

export function isProfileViewDetailed<V>(v: V): v is ProfileViewDetailed & V {
  return is$typed(v, id, hashProfileViewDetailed);
}

export function validateProfileViewDetailed<V>(
  v: V,
): ValidationResult<ProfileViewDetailed & V> {
  return validate<ProfileViewDetailed & V>(v, id, hashProfileViewDetailed);
}

export interface ProfileAssociated {
  $type?: "app.bsky.actor.defs#profileAssociated";
  lists?: number;
  feedgens?: number;
  starterPacks?: number;
  labeler?: boolean;
  chat?: ProfileAssociatedChat;
  activitySubscription?: ProfileAssociatedActivitySubscription;
  germ?: ProfileAssociatedGerm;
}

const hashProfileAssociated = "profileAssociated";

export function isProfileAssociated<V>(v: V): v is ProfileAssociated & V {
  return is$typed(v, id, hashProfileAssociated);
}

export function validateProfileAssociated<V>(
  v: V,
): ValidationResult<ProfileAssociated & V> {
  return validate<ProfileAssociated & V>(v, id, hashProfileAssociated);
}

export interface ProfileAssociatedChat {
  $type?: "app.bsky.actor.defs#profileAssociatedChat";
  allowIncoming:
    | "all"
    | "none"
    | "following"
    | (string & globalThis.Record<PropertyKey, never>);
}

const hashProfileAssociatedChat = "profileAssociatedChat";

export function isProfileAssociatedChat<V>(
  v: V,
): v is ProfileAssociatedChat & V {
  return is$typed(v, id, hashProfileAssociatedChat);
}

export function validateProfileAssociatedChat<V>(
  v: V,
): ValidationResult<ProfileAssociatedChat & V> {
  return validate<ProfileAssociatedChat & V>(v, id, hashProfileAssociatedChat);
}

export interface ProfileAssociatedGerm {
  $type?: "app.bsky.actor.defs#profileAssociatedGerm";
  messageMeUrl: string;
  showButtonTo:
    | "usersIFollow"
    | "everyone"
    | (string & globalThis.Record<PropertyKey, never>);
}

const hashProfileAssociatedGerm = "profileAssociatedGerm";

export function isProfileAssociatedGerm<V>(
  v: V,
): v is ProfileAssociatedGerm & V {
  return is$typed(v, id, hashProfileAssociatedGerm);
}

export function validateProfileAssociatedGerm<V>(
  v: V,
): ValidationResult<ProfileAssociatedGerm & V> {
  return validate<ProfileAssociatedGerm & V>(v, id, hashProfileAssociatedGerm);
}

export interface ProfileAssociatedActivitySubscription {
  $type?: "app.bsky.actor.defs#profileAssociatedActivitySubscription";
  allowSubscriptions:
    | "followers"
    | "mutuals"
    | "none"
    | (string & globalThis.Record<PropertyKey, never>);
}

const hashProfileAssociatedActivitySubscription =
  "profileAssociatedActivitySubscription";

export function isProfileAssociatedActivitySubscription<V>(
  v: V,
): v is ProfileAssociatedActivitySubscription & V {
  return is$typed(v, id, hashProfileAssociatedActivitySubscription);
}

export function validateProfileAssociatedActivitySubscription<V>(
  v: V,
): ValidationResult<ProfileAssociatedActivitySubscription & V> {
  return validate<ProfileAssociatedActivitySubscription & V>(
    v,
    id,
    hashProfileAssociatedActivitySubscription,
  );
}

/** Metadata about the requesting account's relationship with the subject account. Only has meaningful content for authed requests. */
export interface ViewerState {
  $type?: "app.bsky.actor.defs#viewerState";
  muted?: boolean;
  mutedByList?: AppBskyGraphDefs.ListViewBasic;
  blockedBy?: boolean;
  blocking?: string;
  blockingByList?: AppBskyGraphDefs.ListViewBasic;
  following?: string;
  followedBy?: string;
  knownFollowers?: KnownFollowers;
  activitySubscription?: AppBskyNotificationDefs.ActivitySubscription;
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

/** The subject's followers whom you also follow */
export interface KnownFollowers {
  $type?: "app.bsky.actor.defs#knownFollowers";
  count: number;
  followers: (ProfileViewBasic)[];
}

const hashKnownFollowers = "knownFollowers";

export function isKnownFollowers<V>(v: V): v is KnownFollowers & V {
  return is$typed(v, id, hashKnownFollowers);
}

export function validateKnownFollowers<V>(
  v: V,
): ValidationResult<KnownFollowers & V> {
  return validate<KnownFollowers & V>(v, id, hashKnownFollowers);
}

/** Represents the verification information about the user this object is attached to. */
export interface VerificationState {
  $type?: "app.bsky.actor.defs#verificationState";
  /** All verifications issued by trusted verifiers on behalf of this user. Verifications by untrusted verifiers are not included. */
  verifications: (VerificationView)[];
  /** The user's status as a verified account. */
  verifiedStatus:
    | "valid"
    | "invalid"
    | "none"
    | (string & globalThis.Record<PropertyKey, never>);
  /** The user's status as a trusted verifier. */
  trustedVerifierStatus:
    | "valid"
    | "invalid"
    | "none"
    | (string & globalThis.Record<PropertyKey, never>);
}

const hashVerificationState = "verificationState";

export function isVerificationState<V>(v: V): v is VerificationState & V {
  return is$typed(v, id, hashVerificationState);
}

export function validateVerificationState<V>(
  v: V,
): ValidationResult<VerificationState & V> {
  return validate<VerificationState & V>(v, id, hashVerificationState);
}

/** An individual verification for an associated subject. */
export interface VerificationView {
  $type?: "app.bsky.actor.defs#verificationView";
  /** The user who issued this verification. */
  issuer: string;
  /** The AT-URI of the verification record. */
  uri: string;
  /** True if the verification passes validation, otherwise false. */
  isValid: boolean;
  /** Timestamp when the verification was created. */
  createdAt: string;
}

const hashVerificationView = "verificationView";

export function isVerificationView<V>(v: V): v is VerificationView & V {
  return is$typed(v, id, hashVerificationView);
}

export function validateVerificationView<V>(
  v: V,
): ValidationResult<VerificationView & V> {
  return validate<VerificationView & V>(v, id, hashVerificationView);
}

export type Preferences = (
  | $Typed<AdultContentPref>
  | $Typed<ContentLabelPref>
  | $Typed<SavedFeedsPref>
  | $Typed<SavedFeedsPrefV2>
  | $Typed<PersonalDetailsPref>
  | $Typed<DeclaredAgePref>
  | $Typed<FeedViewPref>
  | $Typed<ThreadViewPref>
  | $Typed<InterestsPref>
  | $Typed<MutedWordsPref>
  | $Typed<HiddenPostsPref>
  | $Typed<BskyAppStatePref>
  | $Typed<LabelersPref>
  | $Typed<PostInteractionSettingsPref>
  | $Typed<VerificationPrefs>
  | $Typed<LiveEventPreferences>
  | { $type: string }
)[];

export interface AdultContentPref {
  $type?: "app.bsky.actor.defs#adultContentPref";
  enabled: boolean;
}

const hashAdultContentPref = "adultContentPref";

export function isAdultContentPref<V>(v: V): v is AdultContentPref & V {
  return is$typed(v, id, hashAdultContentPref);
}

export function validateAdultContentPref<V>(
  v: V,
): ValidationResult<AdultContentPref & V> {
  return validate<AdultContentPref & V>(v, id, hashAdultContentPref);
}

export interface ContentLabelPref {
  $type?: "app.bsky.actor.defs#contentLabelPref";
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

export function isContentLabelPref<V>(v: V): v is ContentLabelPref & V {
  return is$typed(v, id, hashContentLabelPref);
}

export function validateContentLabelPref<V>(
  v: V,
): ValidationResult<ContentLabelPref & V> {
  return validate<ContentLabelPref & V>(v, id, hashContentLabelPref);
}

export interface SavedFeed {
  $type?: "app.bsky.actor.defs#savedFeed";
  id: string;
  type:
    | "feed"
    | "list"
    | "timeline"
    | (string & globalThis.Record<PropertyKey, never>);
  value: string;
  pinned: boolean;
}

const hashSavedFeed = "savedFeed";

export function isSavedFeed<V>(v: V): v is SavedFeed & V {
  return is$typed(v, id, hashSavedFeed);
}

export function validateSavedFeed<V>(v: V): ValidationResult<SavedFeed & V> {
  return validate<SavedFeed & V>(v, id, hashSavedFeed);
}

export interface SavedFeedsPrefV2 {
  $type?: "app.bsky.actor.defs#savedFeedsPrefV2";
  items: (SavedFeed)[];
}

const hashSavedFeedsPrefV2 = "savedFeedsPrefV2";

export function isSavedFeedsPrefV2<V>(v: V): v is SavedFeedsPrefV2 & V {
  return is$typed(v, id, hashSavedFeedsPrefV2);
}

export function validateSavedFeedsPrefV2<V>(
  v: V,
): ValidationResult<SavedFeedsPrefV2 & V> {
  return validate<SavedFeedsPrefV2 & V>(v, id, hashSavedFeedsPrefV2);
}

export interface SavedFeedsPref {
  $type?: "app.bsky.actor.defs#savedFeedsPref";
  pinned: (string)[];
  saved: (string)[];
  timelineIndex?: number;
}

const hashSavedFeedsPref = "savedFeedsPref";

export function isSavedFeedsPref<V>(v: V): v is SavedFeedsPref & V {
  return is$typed(v, id, hashSavedFeedsPref);
}

export function validateSavedFeedsPref<V>(
  v: V,
): ValidationResult<SavedFeedsPref & V> {
  return validate<SavedFeedsPref & V>(v, id, hashSavedFeedsPref);
}

export interface PersonalDetailsPref {
  $type?: "app.bsky.actor.defs#personalDetailsPref";
  /** The birth date of account owner. */
  birthDate?: string;
}

const hashPersonalDetailsPref = "personalDetailsPref";

export function isPersonalDetailsPref<V>(v: V): v is PersonalDetailsPref & V {
  return is$typed(v, id, hashPersonalDetailsPref);
}

export function validatePersonalDetailsPref<V>(
  v: V,
): ValidationResult<PersonalDetailsPref & V> {
  return validate<PersonalDetailsPref & V>(v, id, hashPersonalDetailsPref);
}

/** Read-only preference containing value(s) inferred from the user's declared birthdate. Absence of this preference object in the response indicates that the user has not made a declaration. */
export interface DeclaredAgePref {
  $type?: "app.bsky.actor.defs#declaredAgePref";
  /** Indicates if the user has declared that they are over 13 years of age. */
  isOverAge13?: boolean;
  /** Indicates if the user has declared that they are over 16 years of age. */
  isOverAge16?: boolean;
  /** Indicates if the user has declared that they are over 18 years of age. */
  isOverAge18?: boolean;
}

const hashDeclaredAgePref = "declaredAgePref";

export function isDeclaredAgePref<V>(v: V): v is DeclaredAgePref & V {
  return is$typed(v, id, hashDeclaredAgePref);
}

export function validateDeclaredAgePref<V>(
  v: V,
): ValidationResult<DeclaredAgePref & V> {
  return validate<DeclaredAgePref & V>(v, id, hashDeclaredAgePref);
}

export interface FeedViewPref {
  $type?: "app.bsky.actor.defs#feedViewPref";
  /** The URI of the feed, or an identifier which describes the feed. */
  feed: string;
  /** Hide replies in the feed. */
  hideReplies?: boolean;
  /** Hide replies in the feed if they are not by followed users. */
  hideRepliesByUnfollowed: boolean;
  /** Hide replies in the feed if they do not have this number of likes. */
  hideRepliesByLikeCount?: number;
  /** Hide reposts in the feed. */
  hideReposts?: boolean;
  /** Hide quote posts in the feed. */
  hideQuotePosts?: boolean;
}

const hashFeedViewPref = "feedViewPref";

export function isFeedViewPref<V>(v: V): v is FeedViewPref & V {
  return is$typed(v, id, hashFeedViewPref);
}

export function validateFeedViewPref<V>(
  v: V,
): ValidationResult<FeedViewPref & V> {
  return validate<FeedViewPref & V>(v, id, hashFeedViewPref);
}

export interface ThreadViewPref {
  $type?: "app.bsky.actor.defs#threadViewPref";
  /** Sorting mode for threads. */
  sort?:
    | "oldest"
    | "newest"
    | "most-likes"
    | "random"
    | "hotness"
    | (string & globalThis.Record<PropertyKey, never>);
}

const hashThreadViewPref = "threadViewPref";

export function isThreadViewPref<V>(v: V): v is ThreadViewPref & V {
  return is$typed(v, id, hashThreadViewPref);
}

export function validateThreadViewPref<V>(
  v: V,
): ValidationResult<ThreadViewPref & V> {
  return validate<ThreadViewPref & V>(v, id, hashThreadViewPref);
}

export interface InterestsPref {
  $type?: "app.bsky.actor.defs#interestsPref";
  /** A list of tags which describe the account owner's interests gathered during onboarding. */
  tags: (string)[];
}

const hashInterestsPref = "interestsPref";

export function isInterestsPref<V>(v: V): v is InterestsPref & V {
  return is$typed(v, id, hashInterestsPref);
}

export function validateInterestsPref<V>(
  v: V,
): ValidationResult<InterestsPref & V> {
  return validate<InterestsPref & V>(v, id, hashInterestsPref);
}

export type MutedWordTarget =
  | "content"
  | "tag"
  | (string & globalThis.Record<PropertyKey, never>);

/** A word that the account owner has muted. */
export interface MutedWord {
  $type?: "app.bsky.actor.defs#mutedWord";
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

export function isMutedWord<V>(v: V): v is MutedWord & V {
  return is$typed(v, id, hashMutedWord);
}

export function validateMutedWord<V>(v: V): ValidationResult<MutedWord & V> {
  return validate<MutedWord & V>(v, id, hashMutedWord);
}

export interface MutedWordsPref {
  $type?: "app.bsky.actor.defs#mutedWordsPref";
  /** A list of words the account owner has muted. */
  items: (MutedWord)[];
}

const hashMutedWordsPref = "mutedWordsPref";

export function isMutedWordsPref<V>(v: V): v is MutedWordsPref & V {
  return is$typed(v, id, hashMutedWordsPref);
}

export function validateMutedWordsPref<V>(
  v: V,
): ValidationResult<MutedWordsPref & V> {
  return validate<MutedWordsPref & V>(v, id, hashMutedWordsPref);
}

export interface HiddenPostsPref {
  $type?: "app.bsky.actor.defs#hiddenPostsPref";
  /** A list of URIs of posts the account owner has hidden. */
  items: (string)[];
}

const hashHiddenPostsPref = "hiddenPostsPref";

export function isHiddenPostsPref<V>(v: V): v is HiddenPostsPref & V {
  return is$typed(v, id, hashHiddenPostsPref);
}

export function validateHiddenPostsPref<V>(
  v: V,
): ValidationResult<HiddenPostsPref & V> {
  return validate<HiddenPostsPref & V>(v, id, hashHiddenPostsPref);
}

export interface LabelersPref {
  $type?: "app.bsky.actor.defs#labelersPref";
  labelers: (LabelerPrefItem)[];
}

const hashLabelersPref = "labelersPref";

export function isLabelersPref<V>(v: V): v is LabelersPref & V {
  return is$typed(v, id, hashLabelersPref);
}

export function validateLabelersPref<V>(
  v: V,
): ValidationResult<LabelersPref & V> {
  return validate<LabelersPref & V>(v, id, hashLabelersPref);
}

export interface LabelerPrefItem {
  $type?: "app.bsky.actor.defs#labelerPrefItem";
  did: string;
}

const hashLabelerPrefItem = "labelerPrefItem";

export function isLabelerPrefItem<V>(v: V): v is LabelerPrefItem & V {
  return is$typed(v, id, hashLabelerPrefItem);
}

export function validateLabelerPrefItem<V>(
  v: V,
): ValidationResult<LabelerPrefItem & V> {
  return validate<LabelerPrefItem & V>(v, id, hashLabelerPrefItem);
}

/** A grab bag of state that's specific to the bsky.app program. Third-party apps shouldn't use this. */
export interface BskyAppStatePref {
  $type?: "app.bsky.actor.defs#bskyAppStatePref";
  activeProgressGuide?: BskyAppProgressGuide;
  /** An array of tokens which identify nudges (modals, popups, tours, highlight dots) that should be shown to the user. */
  queuedNudges?: (string)[];
  /** Storage for NUXs the user has encountered. */
  nuxs?: (Nux)[];
}

const hashBskyAppStatePref = "bskyAppStatePref";

export function isBskyAppStatePref<V>(v: V): v is BskyAppStatePref & V {
  return is$typed(v, id, hashBskyAppStatePref);
}

export function validateBskyAppStatePref<V>(
  v: V,
): ValidationResult<BskyAppStatePref & V> {
  return validate<BskyAppStatePref & V>(v, id, hashBskyAppStatePref);
}

/** If set, an active progress guide. Once completed, can be set to undefined. Should have unspecced fields tracking progress. */
export interface BskyAppProgressGuide {
  $type?: "app.bsky.actor.defs#bskyAppProgressGuide";
  guide: string;
}

const hashBskyAppProgressGuide = "bskyAppProgressGuide";

export function isBskyAppProgressGuide<V>(v: V): v is BskyAppProgressGuide & V {
  return is$typed(v, id, hashBskyAppProgressGuide);
}

export function validateBskyAppProgressGuide<V>(
  v: V,
): ValidationResult<BskyAppProgressGuide & V> {
  return validate<BskyAppProgressGuide & V>(v, id, hashBskyAppProgressGuide);
}

/** A new user experiences (NUX) storage object */
export interface Nux {
  $type?: "app.bsky.actor.defs#nux";
  id: string;
  completed: boolean;
  /** Arbitrary data for the NUX. The structure is defined by the NUX itself. Limited to 300 characters. */
  data?: string;
  /** The date and time at which the NUX will expire and should be considered completed. */
  expiresAt?: string;
}

const hashNux = "nux";

export function isNux<V>(v: V): v is Nux & V {
  return is$typed(v, id, hashNux);
}

export function validateNux<V>(v: V): ValidationResult<Nux & V> {
  return validate<Nux & V>(v, id, hashNux);
}

/** Preferences for how verified accounts appear in the app. */
export interface VerificationPrefs {
  $type?: "app.bsky.actor.defs#verificationPrefs";
  /** Hide the blue check badges for verified accounts and trusted verifiers. */
  hideBadges: boolean;
}

const hashVerificationPrefs = "verificationPrefs";

export function isVerificationPrefs<V>(v: V): v is VerificationPrefs & V {
  return is$typed(v, id, hashVerificationPrefs);
}

export function validateVerificationPrefs<V>(
  v: V,
): ValidationResult<VerificationPrefs & V> {
  return validate<VerificationPrefs & V>(v, id, hashVerificationPrefs);
}

/** Preferences for live events. */
export interface LiveEventPreferences {
  $type?: "app.bsky.actor.defs#liveEventPreferences";
  /** A list of feed IDs that the user has hidden from live events. */
  hiddenFeedIds?: (string)[];
  /** Whether to hide all feeds from live events. */
  hideAllFeeds: boolean;
}

const hashLiveEventPreferences = "liveEventPreferences";

export function isLiveEventPreferences<V>(v: V): v is LiveEventPreferences & V {
  return is$typed(v, id, hashLiveEventPreferences);
}

export function validateLiveEventPreferences<V>(
  v: V,
): ValidationResult<LiveEventPreferences & V> {
  return validate<LiveEventPreferences & V>(v, id, hashLiveEventPreferences);
}

/** Default post interaction settings for the account. These values should be applied as default values when creating new posts. These refs should mirror the threadgate and postgate records exactly. */
export interface PostInteractionSettingsPref {
  $type?: "app.bsky.actor.defs#postInteractionSettingsPref";
  /** Matches threadgate record. List of rules defining who can reply to this users posts. If value is an empty array, no one can reply. If value is undefined, anyone can reply. */
  threadgateAllowRules?: (
    | $Typed<AppBskyFeedThreadgate.MentionRule>
    | $Typed<AppBskyFeedThreadgate.FollowerRule>
    | $Typed<AppBskyFeedThreadgate.FollowingRule>
    | $Typed<AppBskyFeedThreadgate.ListRule>
    | { $type: string }
  )[];
  /** Matches postgate record. List of rules defining who can embed this users posts. If value is an empty array or is undefined, no particular rules apply and anyone can embed. */
  postgateEmbeddingRules?:
    ($Typed<AppBskyFeedPostgate.DisableRule> | { $type: string })[];
}

const hashPostInteractionSettingsPref = "postInteractionSettingsPref";

export function isPostInteractionSettingsPref<V>(
  v: V,
): v is PostInteractionSettingsPref & V {
  return is$typed(v, id, hashPostInteractionSettingsPref);
}

export function validatePostInteractionSettingsPref<V>(
  v: V,
): ValidationResult<PostInteractionSettingsPref & V> {
  return validate<PostInteractionSettingsPref & V>(
    v,
    id,
    hashPostInteractionSettingsPref,
  );
}

export interface StatusView {
  $type?: "app.bsky.actor.defs#statusView";
  uri?: string;
  cid?: string;
  /** The status for the account. */
  status:
    | "app.bsky.actor.status#live"
    | (string & globalThis.Record<PropertyKey, never>);
  record: { [_ in string]: unknown };
  embed?: $Typed<AppBskyEmbedExternal.View> | { $type: string };
  labels?: (ComAtprotoLabelDefs.Label)[];
  /** The date when this status will expire. The application might choose to no longer return the status after expiration. */
  expiresAt?: string;
  /** True if the status is not expired, false if it is expired. Only present if expiration was set. */
  isActive?: boolean;
  /** True if the user's go-live access has been disabled by a moderator, false otherwise. */
  isDisabled?: boolean;
}

const hashStatusView = "statusView";

export function isStatusView<V>(v: V): v is StatusView & V {
  return is$typed(v, id, hashStatusView);
}

export function validateStatusView<V>(v: V): ValidationResult<StatusView & V> {
  return validate<StatusView & V>(v, id, hashStatusView);
}
