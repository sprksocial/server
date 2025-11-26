/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { validate as _validate } from "../../../../lexicons.ts";
import { is$typed as _is$typed } from "../../../../util.ts";
import type * as AppBskyActorDefs from "../../../app/bsky/actor/defs.ts";
import type * as ComAtprotoLabelDefs from "../../../com/atproto/label/defs.ts";

const is$typed = _is$typed, validate = _validate;
const id = "chat.bsky.actor.defs";

export interface ProfileViewBasic {
  $type?: "chat.bsky.actor.defs#profileViewBasic";
  did: string;
  handle: string;
  displayName?: string;
  avatar?: string;
  associated?: AppBskyActorDefs.ProfileAssociated;
  viewer?: AppBskyActorDefs.ViewerState;
  labels?: (ComAtprotoLabelDefs.Label)[];
  /** Set to true when the actor cannot actively participate in conversations */
  chatDisabled?: boolean;
  verification?: AppBskyActorDefs.VerificationState;
}

const hashProfileViewBasic = "profileViewBasic";

export function isProfileViewBasic<V>(v: V) {
  return is$typed(v, id, hashProfileViewBasic);
}

export function validateProfileViewBasic<V>(v: V) {
  return validate<ProfileViewBasic & V>(v, id, hashProfileViewBasic);
}
