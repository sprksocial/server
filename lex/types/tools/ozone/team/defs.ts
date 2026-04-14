/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { validate as _validate } from "../../../../lexicons.ts";
import type { ValidationResult } from "@atp/lexicon";
import { is$typed as _is$typed } from "../../../../util.ts";
import type * as AppBskyActorDefs from "../../../app/bsky/actor/defs.ts";

const is$typed = _is$typed, validate = _validate;
const id = "tools.ozone.team.defs";

export interface Member {
  $type?: "tools.ozone.team.defs#member";
  did: string;
  disabled?: boolean;
  profile?: AppBskyActorDefs.ProfileViewDetailed;
  createdAt?: string;
  updatedAt?: string;
  lastUpdatedBy?: string;
  role:
    | "tools.ozone.team.defs#roleAdmin"
    | "tools.ozone.team.defs#roleModerator"
    | "tools.ozone.team.defs#roleTriage"
    | "tools.ozone.team.defs#roleVerifier"
    | (string & globalThis.Record<PropertyKey, never>);
}

const hashMember = "member";

export function isMember<V>(v: V): v is Member & V {
  return is$typed(v, id, hashMember);
}

export function validateMember<V>(v: V): ValidationResult<Member & V> {
  return validate<Member & V>(v, id, hashMember);
}

/** Admin role. Highest level of access, can perform all actions. */
export const ROLEADMIN: string = `${id}#roleAdmin`;
/** Moderator role. Can perform most actions. */
export const ROLEMODERATOR: string = `${id}#roleModerator`;
/** Triage role. Mostly intended for monitoring and escalating issues. */
export const ROLETRIAGE: string = `${id}#roleTriage`;
/** Verifier role. Only allowed to issue verifications. */
export const ROLEVERIFIER: string = `${id}#roleVerifier`;
