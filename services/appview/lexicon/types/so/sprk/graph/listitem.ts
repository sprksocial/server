/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { validate as _validate } from "../../../../lexicons.ts";
import { is$typed as _is$typed } from "../../../../util.ts";

const is$typed = _is$typed, validate = _validate;
const id = "so.sprk.graph.listitem";

export interface MainRecord {
  $type: "so.sprk.graph.listitem";
  /** The account which is included on the list. */
  subject: string;
  /** Reference (AT-URI) to the list record (so.sprk.graph.list). */
  list: string;
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
