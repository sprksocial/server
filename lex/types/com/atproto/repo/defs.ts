/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { validate as _validate } from "../../../../lexicons.ts";
import type { ValidationResult } from "@atp/lexicon";
import { is$typed as _is$typed } from "../../../../util.ts";

const is$typed = _is$typed, validate = _validate;
const id = "com.atproto.repo.defs";

export interface CommitMeta {
  $type?: "com.atproto.repo.defs#commitMeta";
  cid: string;
  rev: string;
}

const hashCommitMeta = "commitMeta";

export function isCommitMeta<V>(v: V): v is CommitMeta & V {
  return is$typed(v, id, hashCommitMeta);
}

export function validateCommitMeta<V>(v: V): ValidationResult<CommitMeta & V> {
  return validate<CommitMeta & V>(v, id, hashCommitMeta);
}
