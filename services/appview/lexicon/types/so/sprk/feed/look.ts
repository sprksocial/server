/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { validate as _validate } from "../../../../lexicons.ts";
import { is$typed as _is$typed } from "../../../../util.ts";
import type * as ComAtprotoRepoStrongRef from "../../../com/atproto/repo/strongRef.ts";

const is$typed = _is$typed, validate = _validate;
const id = "so.sprk.feed.look";

export interface MainRecord {
  $type: "so.sprk.feed.look";
  subject: ComAtprotoRepoStrongRef.Main;
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
