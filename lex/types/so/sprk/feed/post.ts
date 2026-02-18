/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { validate as _validate } from "../../../../lexicons.ts";
import { type $Typed, is$typed as _is$typed } from "../../../../util.ts";
import type * as SoSprkMediaImages from "../media/images.ts";
import type * as SoSprkMediaVideo from "../media/video.ts";
import type * as ComAtprotoRepoStrongRef from "../../../com/atproto/repo/strongRef.ts";
import type * as ComAtprotoLabelDefs from "../../../com/atproto/label/defs.ts";
import type * as SoSprkRichtextFacet from "../richtext/facet.ts";

const is$typed = _is$typed, validate = _validate;
const id = "so.sprk.feed.post";

export interface Record {
  $type: "so.sprk.feed.post";
  caption?: CaptionRef;
  media: $Typed<SoSprkMediaImages.Main> | $Typed<SoSprkMediaVideo.Main> | {
    $type: string;
  };
  sound?: ComAtprotoRepoStrongRef.Main;
  /** Indicates human language of post primary text content. */
  langs?: (string)[];
  labels?: $Typed<ComAtprotoLabelDefs.SelfLabels> | { $type: string };
  /** Additional hashtags, in addition to any included in post text and facets. */
  tags?: (string)[];
  /** Records created for external services for this post */
  crossposts?: (ComAtprotoRepoStrongRef.Main)[];
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

export type Main = Record;

export interface CaptionRef {
  $type?: "so.sprk.feed.post#captionRef";
  /** The post description. */
  text?: string;
  /** Annotations of text (mentions, URLs, hashtags, etc) */
  facets?: (SoSprkRichtextFacet.Main)[];
}

const hashCaptionRef = "captionRef";

export function isCaptionRef<V>(v: V) {
  return is$typed(v, id, hashCaptionRef);
}

export function validateCaptionRef<V>(v: V) {
  return validate<CaptionRef & V>(v, id, hashCaptionRef);
}
