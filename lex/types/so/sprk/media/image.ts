/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { BlobRef } from "@atp/lexicon";
import { validate as _validate } from "../../../../lexicons.ts";
import { is$typed as _is$typed } from "../../../../util.ts";
import type * as SoSprkMediaDefs from "./defs.ts";

const is$typed = _is$typed, validate = _validate;
const id = "so.sprk.media.image";

export interface Main {
  $type?: "so.sprk.media.image";
  image: BlobRef;
  /** Alt text description of the image, for accessibility. */
  alt: string;
  aspectRatio?: SoSprkMediaDefs.AspectRatio;
}

const hashMain = "main";

export function isMain<V>(v: V) {
  return is$typed(v, id, hashMain);
}

export function validateMain<V>(v: V) {
  return validate<Main & V>(v, id, hashMain);
}

export interface View {
  $type?: "so.sprk.media.image#view";
  /** Fully-qualified URL where a thumbnail of the image can be fetched. For example, CDN location provided by the App View. */
  thumb: string;
  /** Fully-qualified URL where a large version of the image can be fetched. May or may not be the exact original blob. For example, CDN location provided by the App View. */
  fullsize: string;
  /** Alt text description of the image, for accessibility. */
  alt: string;
  aspectRatio?: SoSprkMediaDefs.AspectRatio;
}

const hashView = "view";

export function isView<V>(v: V) {
  return is$typed(v, id, hashView);
}

export function validateView<V>(v: V) {
  return validate<View & V>(v, id, hashView);
}
