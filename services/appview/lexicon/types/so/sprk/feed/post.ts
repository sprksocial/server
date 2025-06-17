/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { validate as _validate } from "../../../../lexicons.ts";
import { is$typed as _is$typed } from "../../../../util.ts";
import { type $Typed } from "../../../../util.ts";
import type * as SoSprkRichtextFacet from "../richtext/facet.ts";
import type * as SoSprkEmbedImages from "../embed/images.ts";
import type * as SoSprkEmbedVideo from "../embed/video.ts";
import type * as ComAtprotoRepoStrongRef from "../../../com/atproto/repo/strongRef.ts";
import type * as ComAtprotoLabelDefs from "../../../com/atproto/label/defs.ts";

const is$typed = _is$typed, validate = _validate;
const id = "so.sprk.feed.post";

export interface MainRecord {
  $type: "so.sprk.feed.post";
  /** The post description. */
  text?: string;
  /** Annotations of text (mentions, URLs, hashtags, etc) */
  facets?: (SoSprkRichtextFacet.Main)[];
  reply?: ReplyRef;
  embed?: $Typed<SoSprkEmbedImages.Main> | $Typed<SoSprkEmbedVideo.Main> | {
    $type: string;
  };
  sound?: ComAtprotoRepoStrongRef.Main;
  /** Indicates human language of post primary text content. */
  langs?: (string)[];
  labels?: $Typed<ComAtprotoLabelDefs.SelfLabels> | { $type: string };
  /** Additional hashtags, in addition to any included in post text and facets. */
  tags?: (string)[];
  /** Client-declared timestamp when this post was originally created. */
  createdAt: string;
  [k: string]: unknown;
}

export type Record = MainRecord;

const hashMainRecord = "main";

export function isMainRecord<V>(v: V) {
  return is$typed(v, id, hashMainRecord);
}

export function validateMainRecord<V>(v: V) {
  return validate<MainRecord & V>(v, id, hashMainRecord, true);
}

export interface ReplyRef {
  $type?: "so.sprk.feed.post#replyRef";
  root: ComAtprotoRepoStrongRef.Main;
  parent: ComAtprotoRepoStrongRef.Main;
}

const hashReplyRef = "replyRef";

export function isReplyRef<V>(v: V) {
  return is$typed(v, id, hashReplyRef);
}

export function validateReplyRef<V>(v: V) {
  return validate<ReplyRef & V>(v, id, hashReplyRef);
}
