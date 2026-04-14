/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { validate as _validate } from "../../../../lexicons.ts";
import type { ValidationResult } from "@atp/lexicon";
import { type $Typed, is$typed as _is$typed } from "../../../../util.ts";
import type * as SoSprkRichtextFacet from "../richtext/facet.ts";
import type * as SoSprkMediaImage from "../media/image.ts";
import type * as ComAtprotoLabelDefs from "../../../com/atproto/label/defs.ts";
import type * as ComAtprotoRepoStrongRef from "../../../com/atproto/repo/strongRef.ts";

const is$typed = _is$typed, validate = _validate;
const id = "so.sprk.feed.reply";

export interface Record {
  $type: "so.sprk.feed.reply";
  /** The reply text. */
  text?: string;
  /** Annotations of text (mentions, URLs, hashtags, etc) */
  facets?: (SoSprkRichtextFacet.Main)[];
  reply: ReplyRef;
  media?: $Typed<SoSprkMediaImage.Main> | { $type: string };
  /** Indicates human language of post primary text content. */
  langs?: (string)[];
  labels?: $Typed<ComAtprotoLabelDefs.SelfLabels> | { $type: string };
  /** Client-declared timestamp when this post was originally created. */
  createdAt: string;
  [k: string]: unknown;
}

const hashRecord = "main";

export function isRecord<V>(v: V): v is Record & V {
  return is$typed(v, id, hashRecord);
}

export function validateRecord<V>(v: V): ValidationResult<Record & V> {
  return validate<Record & V>(v, id, hashRecord, true);
}

export type Main = Record;

export interface ReplyRef {
  $type?: "so.sprk.feed.reply#replyRef";
  root: ComAtprotoRepoStrongRef.Main;
  parent: ComAtprotoRepoStrongRef.Main;
}

const hashReplyRef = "replyRef";

export function isReplyRef<V>(v: V): v is ReplyRef & V {
  return is$typed(v, id, hashReplyRef);
}

export function validateReplyRef<V>(v: V): ValidationResult<ReplyRef & V> {
  return validate<ReplyRef & V>(v, id, hashReplyRef);
}
