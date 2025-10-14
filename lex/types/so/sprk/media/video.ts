/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { BlobRef } from "@atp/lexicon";
import { validate as _validate } from "../../../../lexicons.ts";
import { is$typed as _is$typed } from "../../../../util.ts";
import type * as SoSprkMediaDefs from "./defs.ts";

const is$typed = _is$typed, validate = _validate;
const id = "so.sprk.media.video";

export interface Main {
  $type?: "so.sprk.media.video";
  video: BlobRef;
  captions?: (Caption)[];
  /** Alt text description of the video, for accessibility. */
  alt?: string;
  aspectRatio?: SoSprkMediaDefs.AspectRatio;
}

const hashMain = "main";

export function isMain<V>(v: V) {
  return is$typed(v, id, hashMain);
}

export function validateMain<V>(v: V) {
  return validate<Main & V>(v, id, hashMain);
}

export interface Caption {
  $type?: "so.sprk.media.video#caption";
  lang: string;
  file: BlobRef;
}

const hashCaption = "caption";

export function isCaption<V>(v: V) {
  return is$typed(v, id, hashCaption);
}

export function validateCaption<V>(v: V) {
  return validate<Caption & V>(v, id, hashCaption);
}

export interface View {
  $type?: "so.sprk.media.video#view";
  cid: string;
  playlist: string;
  thumbnail?: string;
  alt?: string;
  aspectRatio?: SoSprkMediaDefs.AspectRatio;
}

const hashView = "view";

export function isView<V>(v: V) {
  return is$typed(v, id, hashView);
}

export function validateView<V>(v: V) {
  return validate<View & V>(v, id, hashView);
}
