/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { validate as _validate } from "../../../../lexicons.ts";
import type { ValidationResult } from "@atp/lexicon";
import { is$typed as _is$typed } from "../../../../util.ts";
import type * as ComAtprotoServerDefs from "../server/defs.ts";

const is$typed = _is$typed, validate = _validate;
const id = "com.atproto.admin.defs";

export interface StatusAttr {
  $type?: "com.atproto.admin.defs#statusAttr";
  applied: boolean;
  ref?: string;
}

const hashStatusAttr = "statusAttr";

export function isStatusAttr<V>(v: V): v is StatusAttr & V {
  return is$typed(v, id, hashStatusAttr);
}

export function validateStatusAttr<V>(v: V): ValidationResult<StatusAttr & V> {
  return validate<StatusAttr & V>(v, id, hashStatusAttr);
}

export interface AccountView {
  $type?: "com.atproto.admin.defs#accountView";
  did: string;
  handle: string;
  email?: string;
  relatedRecords?: ({ [_ in string]: unknown })[];
  indexedAt: string;
  invitedBy?: ComAtprotoServerDefs.InviteCode;
  invites?: (ComAtprotoServerDefs.InviteCode)[];
  invitesDisabled?: boolean;
  emailConfirmedAt?: string;
  inviteNote?: string;
  deactivatedAt?: string;
  threatSignatures?: (ThreatSignature)[];
}

const hashAccountView = "accountView";

export function isAccountView<V>(v: V): v is AccountView & V {
  return is$typed(v, id, hashAccountView);
}

export function validateAccountView<V>(
  v: V,
): ValidationResult<AccountView & V> {
  return validate<AccountView & V>(v, id, hashAccountView);
}

export interface RepoRef {
  $type?: "com.atproto.admin.defs#repoRef";
  did: string;
}

const hashRepoRef = "repoRef";

export function isRepoRef<V>(v: V): v is RepoRef & V {
  return is$typed(v, id, hashRepoRef);
}

export function validateRepoRef<V>(v: V): ValidationResult<RepoRef & V> {
  return validate<RepoRef & V>(v, id, hashRepoRef);
}

export interface RepoBlobRef {
  $type?: "com.atproto.admin.defs#repoBlobRef";
  did: string;
  cid: string;
  recordUri?: string;
}

const hashRepoBlobRef = "repoBlobRef";

export function isRepoBlobRef<V>(v: V): v is RepoBlobRef & V {
  return is$typed(v, id, hashRepoBlobRef);
}

export function validateRepoBlobRef<V>(
  v: V,
): ValidationResult<RepoBlobRef & V> {
  return validate<RepoBlobRef & V>(v, id, hashRepoBlobRef);
}

export interface ThreatSignature {
  $type?: "com.atproto.admin.defs#threatSignature";
  property: string;
  value: string;
}

const hashThreatSignature = "threatSignature";

export function isThreatSignature<V>(v: V): v is ThreatSignature & V {
  return is$typed(v, id, hashThreatSignature);
}

export function validateThreatSignature<V>(
  v: V,
): ValidationResult<ThreatSignature & V> {
  return validate<ThreatSignature & V>(v, id, hashThreatSignature);
}
