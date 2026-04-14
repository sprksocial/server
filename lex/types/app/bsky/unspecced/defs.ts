/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { validate as _validate } from "../../../../lexicons.ts";
import type { ValidationResult } from "@atp/lexicon";
import { is$typed as _is$typed } from "../../../../util.ts";
import type * as AppBskyActorDefs from "../actor/defs.ts";
import type * as AppBskyFeedDefs from "../feed/defs.ts";

const is$typed = _is$typed, validate = _validate;
const id = "app.bsky.unspecced.defs";

export interface SkeletonSearchPost {
  $type?: "app.bsky.unspecced.defs#skeletonSearchPost";
  uri: string;
}

const hashSkeletonSearchPost = "skeletonSearchPost";

export function isSkeletonSearchPost<V>(v: V): v is SkeletonSearchPost & V {
  return is$typed(v, id, hashSkeletonSearchPost);
}

export function validateSkeletonSearchPost<V>(
  v: V,
): ValidationResult<SkeletonSearchPost & V> {
  return validate<SkeletonSearchPost & V>(v, id, hashSkeletonSearchPost);
}

export interface SkeletonSearchActor {
  $type?: "app.bsky.unspecced.defs#skeletonSearchActor";
  did: string;
}

const hashSkeletonSearchActor = "skeletonSearchActor";

export function isSkeletonSearchActor<V>(v: V): v is SkeletonSearchActor & V {
  return is$typed(v, id, hashSkeletonSearchActor);
}

export function validateSkeletonSearchActor<V>(
  v: V,
): ValidationResult<SkeletonSearchActor & V> {
  return validate<SkeletonSearchActor & V>(v, id, hashSkeletonSearchActor);
}

export interface SkeletonSearchStarterPack {
  $type?: "app.bsky.unspecced.defs#skeletonSearchStarterPack";
  uri: string;
}

const hashSkeletonSearchStarterPack = "skeletonSearchStarterPack";

export function isSkeletonSearchStarterPack<V>(
  v: V,
): v is SkeletonSearchStarterPack & V {
  return is$typed(v, id, hashSkeletonSearchStarterPack);
}

export function validateSkeletonSearchStarterPack<V>(
  v: V,
): ValidationResult<SkeletonSearchStarterPack & V> {
  return validate<SkeletonSearchStarterPack & V>(
    v,
    id,
    hashSkeletonSearchStarterPack,
  );
}

export interface TrendingTopic {
  $type?: "app.bsky.unspecced.defs#trendingTopic";
  topic: string;
  displayName?: string;
  description?: string;
  link: string;
}

const hashTrendingTopic = "trendingTopic";

export function isTrendingTopic<V>(v: V): v is TrendingTopic & V {
  return is$typed(v, id, hashTrendingTopic);
}

export function validateTrendingTopic<V>(
  v: V,
): ValidationResult<TrendingTopic & V> {
  return validate<TrendingTopic & V>(v, id, hashTrendingTopic);
}

export interface SkeletonTrend {
  $type?: "app.bsky.unspecced.defs#skeletonTrend";
  topic: string;
  displayName: string;
  link: string;
  startedAt: string;
  postCount: number;
  status?: "hot" | (string & globalThis.Record<PropertyKey, never>);
  category?: string;
  dids: (string)[];
}

const hashSkeletonTrend = "skeletonTrend";

export function isSkeletonTrend<V>(v: V): v is SkeletonTrend & V {
  return is$typed(v, id, hashSkeletonTrend);
}

export function validateSkeletonTrend<V>(
  v: V,
): ValidationResult<SkeletonTrend & V> {
  return validate<SkeletonTrend & V>(v, id, hashSkeletonTrend);
}

export interface TrendView {
  $type?: "app.bsky.unspecced.defs#trendView";
  topic: string;
  displayName: string;
  link: string;
  startedAt: string;
  postCount: number;
  status?: "hot" | (string & globalThis.Record<PropertyKey, never>);
  category?: string;
  actors: (AppBskyActorDefs.ProfileViewBasic)[];
}

const hashTrendView = "trendView";

export function isTrendView<V>(v: V): v is TrendView & V {
  return is$typed(v, id, hashTrendView);
}

export function validateTrendView<V>(v: V): ValidationResult<TrendView & V> {
  return validate<TrendView & V>(v, id, hashTrendView);
}

export interface ThreadItemPost {
  $type?: "app.bsky.unspecced.defs#threadItemPost";
  post: AppBskyFeedDefs.PostView;
  /** This post has more parents that were not present in the response. This is just a boolean, without the number of parents. */
  moreParents: boolean;
  /** This post has more replies that were not present in the response. This is a numeric value, which is best-effort and might not be accurate. */
  moreReplies: number;
  /** This post is part of a contiguous thread by the OP from the thread root. Many different OP threads can happen in the same thread. */
  opThread: boolean;
  /** The threadgate created by the author indicates this post as a reply to be hidden for everyone consuming the thread. */
  hiddenByThreadgate: boolean;
  /** This is by an account muted by the viewer requesting it. */
  mutedByViewer: boolean;
}

const hashThreadItemPost = "threadItemPost";

export function isThreadItemPost<V>(v: V): v is ThreadItemPost & V {
  return is$typed(v, id, hashThreadItemPost);
}

export function validateThreadItemPost<V>(
  v: V,
): ValidationResult<ThreadItemPost & V> {
  return validate<ThreadItemPost & V>(v, id, hashThreadItemPost);
}

export interface ThreadItemNoUnauthenticated {
  $type?: "app.bsky.unspecced.defs#threadItemNoUnauthenticated";
}

const hashThreadItemNoUnauthenticated = "threadItemNoUnauthenticated";

export function isThreadItemNoUnauthenticated<V>(
  v: V,
): v is ThreadItemNoUnauthenticated & V {
  return is$typed(v, id, hashThreadItemNoUnauthenticated);
}

export function validateThreadItemNoUnauthenticated<V>(
  v: V,
): ValidationResult<ThreadItemNoUnauthenticated & V> {
  return validate<ThreadItemNoUnauthenticated & V>(
    v,
    id,
    hashThreadItemNoUnauthenticated,
  );
}

export interface ThreadItemNotFound {
  $type?: "app.bsky.unspecced.defs#threadItemNotFound";
}

const hashThreadItemNotFound = "threadItemNotFound";

export function isThreadItemNotFound<V>(v: V): v is ThreadItemNotFound & V {
  return is$typed(v, id, hashThreadItemNotFound);
}

export function validateThreadItemNotFound<V>(
  v: V,
): ValidationResult<ThreadItemNotFound & V> {
  return validate<ThreadItemNotFound & V>(v, id, hashThreadItemNotFound);
}

export interface ThreadItemBlocked {
  $type?: "app.bsky.unspecced.defs#threadItemBlocked";
  author: AppBskyFeedDefs.BlockedAuthor;
}

const hashThreadItemBlocked = "threadItemBlocked";

export function isThreadItemBlocked<V>(v: V): v is ThreadItemBlocked & V {
  return is$typed(v, id, hashThreadItemBlocked);
}

export function validateThreadItemBlocked<V>(
  v: V,
): ValidationResult<ThreadItemBlocked & V> {
  return validate<ThreadItemBlocked & V>(v, id, hashThreadItemBlocked);
}

/** The computed state of the age assurance process, returned to the user in question on certain authenticated requests. */
export interface AgeAssuranceState {
  $type?: "app.bsky.unspecced.defs#ageAssuranceState";
  /** The timestamp when this state was last updated. */
  lastInitiatedAt?: string;
  /** The status of the age assurance process. */
  status:
    | "unknown"
    | "pending"
    | "assured"
    | "blocked"
    | (string & globalThis.Record<PropertyKey, never>);
}

const hashAgeAssuranceState = "ageAssuranceState";

export function isAgeAssuranceState<V>(v: V): v is AgeAssuranceState & V {
  return is$typed(v, id, hashAgeAssuranceState);
}

export function validateAgeAssuranceState<V>(
  v: V,
): ValidationResult<AgeAssuranceState & V> {
  return validate<AgeAssuranceState & V>(v, id, hashAgeAssuranceState);
}

/** Object used to store age assurance data in stash. */
export interface AgeAssuranceEvent {
  $type?: "app.bsky.unspecced.defs#ageAssuranceEvent";
  /** The date and time of this write operation. */
  createdAt: string;
  /** The status of the age assurance process. */
  status:
    | "unknown"
    | "pending"
    | "assured"
    | (string & globalThis.Record<PropertyKey, never>);
  /** The unique identifier for this instance of the age assurance flow, in UUID format. */
  attemptId: string;
  /** The email used for AA. */
  email?: string;
  /** The IP address used when initiating the AA flow. */
  initIp?: string;
  /** The user agent used when initiating the AA flow. */
  initUa?: string;
  /** The IP address used when completing the AA flow. */
  completeIp?: string;
  /** The user agent used when completing the AA flow. */
  completeUa?: string;
}

const hashAgeAssuranceEvent = "ageAssuranceEvent";

export function isAgeAssuranceEvent<V>(v: V): v is AgeAssuranceEvent & V {
  return is$typed(v, id, hashAgeAssuranceEvent);
}

export function validateAgeAssuranceEvent<V>(
  v: V,
): ValidationResult<AgeAssuranceEvent & V> {
  return validate<AgeAssuranceEvent & V>(v, id, hashAgeAssuranceEvent);
}
