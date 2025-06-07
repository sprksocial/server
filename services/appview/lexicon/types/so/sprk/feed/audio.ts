/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { BlobRef, type ValidationResult } from "@atproto/lexicon";
import { CID } from "multiformats/cid";
import { validate as _validate } from "../../../../lexicons";
import {
  type $Typed,
  is$typed as _is$typed,
  type OmitKey,
} from "../../../../util";
import type * as ComAtprotoRepoStrongRef from "../../../com/atproto/repo/strongRef.js";
import type * as ComAtprotoLabelDefs from "../../../com/atproto/label/defs.js";

const is$typed = _is$typed, validate = _validate;
const id = "so.sprk.feed.audio";

export interface Record {
  $type: "so.sprk.feed.audio";
  sound: BlobRef;
  origin: ComAtprotoRepoStrongRef.Main;
  /** The audio's title. */
  title?: string;
  /** The audio's description. */
  text?: string;
  labels?: $Typed<ComAtprotoLabelDefs.SelfLabels> | { $type: string };
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
