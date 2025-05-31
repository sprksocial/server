/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { BlobRef, ValidationResult } from "@atproto/lexicon";
import { CID } from "multiformats/cid";
import { validate as _validate } from "../../../../lexicons";
import { $Typed, is$typed as _is$typed, OmitKey } from "../../../../util";

const is$typed = _is$typed,
  validate = _validate;
const id = "so.sprk.graph.block";

export interface Record {
  $type: "so.sprk.graph.block";
  /** DID of the account to be blocked. */
  subject: string;
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
