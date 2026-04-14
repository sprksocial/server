/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { validate as _validate } from "../../../../lexicons.ts";
import type { ValidationResult } from "@atp/lexicon";
import { type $Typed, is$typed as _is$typed } from "../../../../util.ts";
import type * as AppBskyLabelerDefs from "./defs.ts";
import type * as ComAtprotoLabelDefs from "../../../com/atproto/label/defs.ts";
import type * as ComAtprotoModerationDefs from "../../../com/atproto/moderation/defs.ts";

const is$typed = _is$typed, validate = _validate;
const id = "app.bsky.labeler.service";

export interface Record {
  $type: "app.bsky.labeler.service";
  policies: AppBskyLabelerDefs.LabelerPolicies;
  labels?: $Typed<ComAtprotoLabelDefs.SelfLabels> | { $type: string };
  createdAt: string;
  /** The set of report reason 'codes' which are in-scope for this service to review and action. These usually align to policy categories. If not defined (distinct from empty array), all reason types are allowed. */
  reasonTypes?: (ComAtprotoModerationDefs.ReasonType)[];
  /** The set of subject types (account, record, etc) this service accepts reports on. */
  subjectTypes?: (ComAtprotoModerationDefs.SubjectType)[];
  /** Set of record types (collection NSIDs) which can be reported to this service. If not defined (distinct from empty array), default is any record type. */
  subjectCollections?: (string)[];
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
