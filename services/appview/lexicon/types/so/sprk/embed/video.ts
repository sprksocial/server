/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { BlobRef, ValidationResult } from "@atproto/lexicon";
import { CID } from "multiformats/cid";
import { validate as _validate } from "../../../../lexicons";
import { $Typed, is$typed as _is$typed, OmitKey } from "../../../../util";
import type * as SoSprkEmbedDefs from "./defs.ts";

const is$typed = _is$typed,
  validate = _validate;
const id = "so.sprk.embed.video";

export interface Main {
  $type?: "so.sprk.embed.video";
  video: BlobRef;
  captions?: Caption[];
  /** Alt text description of the video, for accessibility. */
  alt?: string;
  aspectRatio?: SoSprkEmbedDefs.AspectRatio;
}

const hashMain = "main";

export function isMain<V>(v: V) {
  return is$typed(v, id, hashMain);
}

export function validateMain<V>(v: V) {
  return validate<Main & V>(v, id, hashMain);
}

export interface Caption {
  $type?: "so.sprk.embed.video#caption";
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
  $type?: "so.sprk.embed.video#view";
  cid: string;
  playlist: string;
  thumbnail?: string;
  alt?: string;
  aspectRatio?: SoSprkEmbedDefs.AspectRatio;
}

const hashView = "view";

export function isView<V>(v: V) {
  return is$typed(v, id, hashView);
}

export function validateView<V>(v: V) {
  return validate<View & V>(v, id, hashView);
}
