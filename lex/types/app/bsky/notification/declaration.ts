/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { validate as _validate } from "../../../../lexicons.ts";
import { is$typed as _is$typed } from "../../../../util.ts";

const is$typed = _is$typed, validate = _validate;
const id = "app.bsky.notification.declaration";

export interface Record {
  $type: "app.bsky.notification.declaration";
  /** A declaration of the user's preference for allowing activity subscriptions from other users. Absence of a record implies 'followers'. */
  allowSubscriptions:
    | "followers"
    | "mutuals"
    | "none"
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

export type Main = Record;
