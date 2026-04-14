/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { validate as _validate } from "../../../../lexicons.ts";
import type { ValidationResult } from "@atp/lexicon";
import { is$typed as _is$typed } from "../../../../util.ts";
import type * as SoSprkMediaImage from "./image.ts";

const is$typed = _is$typed, validate = _validate;
const id = "so.sprk.media.images";

export interface Main {
  $type?: "so.sprk.media.images";
  images: (SoSprkMediaImage.Main)[];
}

const hashMain = "main";

export function isMain<V>(v: V): v is Main & V {
  return is$typed(v, id, hashMain);
}

export function validateMain<V>(v: V): ValidationResult<Main & V> {
  return validate<Main & V>(v, id, hashMain);
}

export interface View {
  $type?: "so.sprk.media.images#view";
  images: (SoSprkMediaImage.View)[];
}

const hashView = "view";

export function isView<V>(v: V): v is View & V {
  return is$typed(v, id, hashView);
}

export function validateView<V>(v: V): ValidationResult<View & V> {
  return validate<View & V>(v, id, hashView);
}
