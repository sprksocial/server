/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { validate as _validate } from "../../../../lexicons.ts";
import { type $Typed, is$typed as _is$typed } from "../../../../util.ts";
import type * as SoSprkEmbedMention from "./mention.ts";
import type * as SoSprkEmbedPost from "./post.ts";

const is$typed = _is$typed, validate = _validate;
const id = "so.sprk.embed.defs";

export type Embeds =
  ($Typed<SoSprkEmbedMention.Main> | $Typed<SoSprkEmbedPost.Main> | {
    $type: string;
  })[];
export type Views =
  ($Typed<SoSprkEmbedMention.View> | $Typed<SoSprkEmbedPost.View> | {
    $type: string;
  })[];

/** Placement and layer metadata for an embed on a media canvas. */
export interface Placement {
  $type?: "so.sprk.embed.defs#placement";
  frame: Frame;
  mediaRef?: MediaRef;
  zIndex?: number;
  rotation?: number;
}

const hashPlacement = "placement";

export function isPlacement<V>(v: V) {
  return is$typed(v, id, hashPlacement);
}

export function validatePlacement<V>(v: V) {
  return validate<Placement & V>(v, id, hashPlacement);
}

/** Bounding box in 10,000-based normalized coordinates relative to media canvas dimensions. */
export interface Frame {
  $type?: "so.sprk.embed.defs#frame";
  x: number;
  y: number;
  w: number;
  h: number;
}

const hashFrame = "frame";

export function isFrame<V>(v: V) {
  return is$typed(v, id, hashFrame);
}

export function validateFrame<V>(v: V) {
  return validate<Frame & V>(v, id, hashFrame);
}

/** Optional media locator for records containing multiple media items. */
export interface MediaRef {
  $type?: "so.sprk.embed.defs#mediaRef";
  index: number;
}

const hashMediaRef = "mediaRef";

export function isMediaRef<V>(v: V) {
  return is$typed(v, id, hashMediaRef);
}

export function validateMediaRef<V>(v: V) {
  return validate<MediaRef & V>(v, id, hashMediaRef);
}
