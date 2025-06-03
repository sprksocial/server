/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { BlobRef, ValidationResult } from "@atproto/lexicon";
import { CID } from "multiformats/cid";
import { validate as _validate } from "../../../../lexicons";
import { $Typed, is$typed as _is$typed, OmitKey } from "../../../../util";
import type * as SoSprkRichtextFacet from "../richtext/facet.ts";
import type * as SoSprkEmbedImages from "../embed/images.ts";
import type * as SoSprkEmbedVideo from "../embed/video.ts";
import type * as ComAtprotoRepoStrongRef from "../../../com/atproto/repo/strongRef.ts";
import type * as ComAtprotoLabelDefs from "../../../com/atproto/label/defs.ts";

const is$typed = _is$typed,
  validate = _validate;
const id = "so.sprk.feed.post";

export interface Record {
  $type: "so.sprk.feed.post";
  /** The post description. */
  text?: string;
  /** Annotations of text (mentions, URLs, hashtags, etc) */
  facets?: SoSprkRichtextFacet.Main[];
  reply?: ReplyRef;
  embed?:
    | $Typed<SoSprkEmbedImages.Main>
    | $Typed<SoSprkEmbedVideo.Main>
    | { $type: string };
  sound?: ComAtprotoRepoStrongRef.Main;
  /** Indicates human language of post primary text content. */
  langs?: string[];
  labels?: $Typed<ComAtprotoLabelDefs.SelfLabels> | { $type: string };
  /** Additional hashtags, in addition to any included in post text and facets. */
  tags?: string[];
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
