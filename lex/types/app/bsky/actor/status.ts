/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { validate as _validate } from "../../../../lexicons.ts";
import type { ValidationResult } from "@atp/lexicon";
import { type $Typed, is$typed as _is$typed } from "../../../../util.ts";
import type * as AppBskyEmbedExternal from "../embed/external.ts";

const is$typed = _is$typed, validate = _validate;
const id = "app.bsky.actor.status";

export interface Record {
  $type: "app.bsky.actor.status";
  /** The status for the account. */
  status:
    | "app.bsky.actor.status#live"
    | (string & globalThis.Record<PropertyKey, never>);
  embed?: $Typed<AppBskyEmbedExternal.Main> | { $type: string };
  /** The duration of the status in minutes. Applications can choose to impose minimum and maximum limits. */
  durationMinutes?: number;
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

/** Advertises an account as currently offering live content. */
export const LIVE: string = `${id}#live`;
