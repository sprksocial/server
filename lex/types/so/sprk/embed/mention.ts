/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { validate as _validate } from "../../../../lexicons.ts";
import type { ValidationResult } from "@atp/lexicon";
import { is$typed as _is$typed } from "../../../../util.ts";
import type * as SoSprkEmbedDefs from "./defs.ts";
import type * as SoSprkActorDefs from "../actor/defs.ts";

const is$typed = _is$typed, validate = _validate;
const id = "so.sprk.embed.mention";

export interface Main {
  $type?: "so.sprk.embed.mention";
  placement: SoSprkEmbedDefs.Placement;
  did: string;
}

const hashMain = "main";

export function isMain<V>(v: V): v is Main & V {
  return is$typed(v, id, hashMain);
}

export function validateMain<V>(v: V): ValidationResult<Main & V> {
  return validate<Main & V>(v, id, hashMain);
}

export interface View {
  $type?: "so.sprk.embed.mention#view";
  placement: SoSprkEmbedDefs.Placement;
  did: string;
  actor?: SoSprkActorDefs.ProfileViewBasic;
}

const hashView = "view";

export function isView<V>(v: V): v is View & V {
  return is$typed(v, id, hashView);
}

export function validateView<V>(v: V): ValidationResult<View & V> {
  return validate<View & V>(v, id, hashView);
}
