/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { validate as _validate } from "../../../../lexicons.ts";
import type { ValidationResult } from "@atp/lexicon";
import { is$typed as _is$typed } from "../../../../util.ts";

const is$typed = _is$typed, validate = _validate;
const id = "com.atproto.repo.strongRef";

export interface Main {
  $type?: "com.atproto.repo.strongRef";
  uri: string;
  cid: string;
}

const hashMain = "main";

export function isMain<V>(v: V): v is Main & V {
  return is$typed(v, id, hashMain);
}

export function validateMain<V>(v: V): ValidationResult<Main & V> {
  return validate<Main & V>(v, id, hashMain);
}
