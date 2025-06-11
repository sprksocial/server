/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { validate as _validate } from "../../../../lexicons.ts";
import { is$typed as _is$typed } from "../../../../util.ts";
import { type $Typed } from "../../../../util.ts";

const is$typed = _is$typed, validate = _validate;
const id = "app.bsky.feed.postgate";

export interface MainRecord {
  $type: "app.bsky.feed.postgate";
  createdAt: string;
  /** Reference (AT-URI) to the post record. */
  post: string;
  /** List of AT-URIs embedding this post that the author has detached from. */
  detachedEmbeddingUris?: (string)[];
  /** List of rules defining who can embed this post. If value is an empty array or is undefined, no particular rules apply and anyone can embed. */
  embeddingRules?: ($Typed<DisableRule> | { $type: string })[];
  [k: string]: unknown;
}

const hashMainRecord = "main";

export function isMainRecord<V>(v: V) {
  return is$typed(v, id, hashMainRecord);
}

export function validateMainRecord<V>(v: V) {
  return validate<MainRecord & V>(v, id, hashMainRecord, true);
}

/** Disables embedding of this post. */
export interface DisableRule {
  $type?: "app.bsky.feed.postgate#disableRule";
}

const hashDisableRule = "disableRule";

export function isDisableRule<V>(v: V) {
  return is$typed(v, id, hashDisableRule);
}

export function validateDisableRule<V>(v: V) {
  return validate<DisableRule & V>(v, id, hashDisableRule);
}
