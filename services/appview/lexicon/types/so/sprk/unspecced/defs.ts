/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { BlobRef, type ValidationResult } from "@atproto/lexicon";
import { CID } from "multiformats/cid";
import { validate as _validate } from "../../../../lexicons";
import {
  type $Typed,
  is$typed as _is$typed,
  type OmitKey,
} from "../../../../util";

const is$typed = _is$typed, validate = _validate;
const id = "so.sprk.unspecced.defs";

export interface SkeletonSearchPost {
  $type?: "so.sprk.unspecced.defs#skeletonSearchPost";
  uri: string;
}

const hashSkeletonSearchPost = "skeletonSearchPost";

export function isSkeletonSearchPost<V>(v: V) {
  return is$typed(v, id, hashSkeletonSearchPost);
}

export function validateSkeletonSearchPost<V>(v: V) {
  return validate<SkeletonSearchPost & V>(v, id, hashSkeletonSearchPost);
}

export interface SkeletonSearchActor {
  $type?: "so.sprk.unspecced.defs#skeletonSearchActor";
  did: string;
}

const hashSkeletonSearchActor = "skeletonSearchActor";

export function isSkeletonSearchActor<V>(v: V) {
  return is$typed(v, id, hashSkeletonSearchActor);
}

export function validateSkeletonSearchActor<V>(v: V) {
  return validate<SkeletonSearchActor & V>(v, id, hashSkeletonSearchActor);
}

export interface SkeletonSearchStarterPack {
  $type?: "so.sprk.unspecced.defs#skeletonSearchStarterPack";
  uri: string;
}

const hashSkeletonSearchStarterPack = "skeletonSearchStarterPack";

export function isSkeletonSearchStarterPack<V>(v: V) {
  return is$typed(v, id, hashSkeletonSearchStarterPack);
}

export function validateSkeletonSearchStarterPack<V>(v: V) {
  return validate<SkeletonSearchStarterPack & V>(
    v,
    id,
    hashSkeletonSearchStarterPack,
  );
}

export interface TrendingTopic {
  $type?: "so.sprk.unspecced.defs#trendingTopic";
  topic: string;
  displayName?: string;
  description?: string;
  link: string;
}

const hashTrendingTopic = "trendingTopic";

export function isTrendingTopic<V>(v: V) {
  return is$typed(v, id, hashTrendingTopic);
}

export function validateTrendingTopic<V>(v: V) {
  return validate<TrendingTopic & V>(v, id, hashTrendingTopic);
}
