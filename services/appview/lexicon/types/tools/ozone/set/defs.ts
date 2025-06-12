/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { validate as _validate } from "../../../../lexicons.ts";
import { is$typed as _is$typed } from "../../../../util.ts";

const is$typed = _is$typed, validate = _validate;
const id = "tools.ozone.set.defs";

export interface Set {
  $type?: "tools.ozone.set.defs#set";
  name: string;
  description?: string;
}

const hashSet = "set";

export function isSet<V>(v: V) {
  return is$typed(v, id, hashSet);
}

export function validateSet<V>(v: V) {
  return validate<Set & V>(v, id, hashSet);
}

export interface SetView {
  $type?: "tools.ozone.set.defs#setView";
  name: string;
  description?: string;
  setSize: number;
  createdAt: string;
  updatedAt: string;
}

const hashSetView = "setView";

export function isSetView<V>(v: V) {
  return is$typed(v, id, hashSetView);
}

export function validateSetView<V>(v: V) {
  return validate<SetView & V>(v, id, hashSetView);
}
