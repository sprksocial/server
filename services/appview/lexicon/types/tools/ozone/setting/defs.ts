/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { validate as _validate } from "../../../../lexicons.ts";
import { is$typed as _is$typed } from "../../../../util.ts";

const is$typed = _is$typed, validate = _validate;
const id = "tools.ozone.setting.defs";

export interface Option {
  $type?: "tools.ozone.setting.defs#option";
  key: string;
  did: string;
  value: { [_ in string]: unknown };
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  managerRole?:
    | "tools.ozone.team.defs#roleModerator"
    | "tools.ozone.team.defs#roleTriage"
    | "tools.ozone.team.defs#roleAdmin"
    | (string & { __brand?: never });
  scope: "instance" | "personal" | (string & { __brand?: never });
  createdBy: string;
  lastUpdatedBy: string;
}

const hashOption = "option";

export function isOption<V>(v: V) {
  return is$typed(v, id, hashOption);
}

export function validateOption<V>(v: V) {
  return validate<Option & V>(v, id, hashOption);
}
