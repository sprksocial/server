/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { BlobRef } from "@atproto/lexicon";
import { validate as _validate } from "../../../../lexicons.ts";
import { is$typed as _is$typed } from "../../../../util.ts";
import { type $Typed } from "../../../../util.ts";
import type * as ComAtprotoLabelDefs from "../../../com/atproto/label/defs.ts";
import type * as ComAtprotoRepoStrongRef from "../../../com/atproto/repo/strongRef.ts";

const is$typed = _is$typed, validate = _validate;
const id = "so.sprk.actor.profile";

export interface MainRecord {
  $type: "so.sprk.actor.profile";
  displayName?: string;
  /** Free-form profile description text. */
  description?: string;
  /** Small image to be displayed next to posts from account. AKA, 'profile picture' */
  avatar?: BlobRef;
  /** Larger horizontal image to display behind profile view. */
  banner?: BlobRef;
  labels?: $Typed<ComAtprotoLabelDefs.SelfLabels> | { $type: string };
  joinedViaStarterPack?: ComAtprotoRepoStrongRef.Main;
  pinnedPost?: ComAtprotoRepoStrongRef.Main;
  createdAt?: string;
  [k: string]: unknown;
}

const hashMainRecord = "main";

export function isMainRecord<V>(v: V) {
  return is$typed(v, id, hashMainRecord);
}

export function validateMainRecord<V>(v: V) {
  return validate<MainRecord & V>(v, id, hashMainRecord, true);
}
