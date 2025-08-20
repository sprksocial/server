/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { validate as _validate } from "../../../../lexicons.ts";
import { is$typed as _is$typed } from "../../../../util.ts";

const is$typed = _is$typed, validate = _validate;
const id = "chat.bsky.actor.declaration";

export interface Record {
  $type: "chat.bsky.actor.declaration";
  allowIncoming:
    | "all"
    | "none"
    | "following"
    | (string & globalThis.Record<PropertyKey, never>);
  [k: string]: unknown;
}

const hashRecord = "main";

export function isRecord<V>(v: V) {
  return is$typed(v, id, hashRecord);
}

export function validateRecord<V>(v: V) {
  return validate<Record & V>(v, id, hashRecord, true);
}
