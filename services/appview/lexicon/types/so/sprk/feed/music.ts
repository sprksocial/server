/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { BlobRef } from "@atproto/lexicon";
import { validate as _validate } from "../../../../lexicons.ts";
import { is$typed as _is$typed } from "../../../../util.ts";
import type * as SoSprkRichtextFacet from "../richtext/facet.ts";
import type * as ComAtprotoLabelDefs from "../../../com/atproto/label/defs.ts";

const is$typed = _is$typed, validate = _validate;
const id = "so.sprk.feed.music";

export interface Record {
  $type: "so.sprk.feed.music";
  sound: BlobRef;
  /** The music's title. */
  title: string;
  releaseDate: string;
  /** The music's album name. */
  album?: string;
  /** The music's record label. */
  recordLabel?: string;
  /** Image to be displayed in music's page. AKA, 'cover image' */
  cover?: BlobRef;
  /** The music's author. */
  author: string;
  /** The music's description. */
  text?: string;
  copyright?: (string)[];
  /** Annotations of text (mentions, URLs, hashtags, etc) */
  facets?: (SoSprkRichtextFacet.Main)[];
  labels?: $Typed<ComAtprotoLabelDefs.SelfLabels> | { $type: string };
  /** The music's Hashtags */
  tags?: (string)[];
  /** Client-declared timestamp when this post was originally created. */
  createdAt: string;
  [k: string]: unknown;
}

const hashRecord = "main";

export function isRecord<V>(v: V) {
  return is$typed(v, id, hashRecord);
}

export function validateRecord<V>(v: V) {
  return validate<Record & V>(v, id, hashRecord, true);
}
