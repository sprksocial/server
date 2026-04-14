/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { validate as _validate } from "../../../../lexicons.ts";
import type { ValidationResult } from "@atp/lexicon";
import { is$typed as _is$typed } from "../../../../util.ts";
import type * as ComAtprotoRepoStrongRef from "../../../com/atproto/repo/strongRef.ts";

const is$typed = _is$typed, validate = _validate;
const id = "app.bsky.feed.like";

export interface Record {
  $type: "app.bsky.feed.like";
  subject: ComAtprotoRepoStrongRef.Main;
  createdAt: string;
  via?: ComAtprotoRepoStrongRef.Main;
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
