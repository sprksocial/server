/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { validate as _validate } from "../../../../lexicons.ts";
import type { ValidationResult } from "@atp/lexicon";
import { is$typed as _is$typed } from "../../../../util.ts";

const is$typed = _is$typed, validate = _validate;
const id = "so.sprk.media.defs";

/** width:height represents an aspect ratio. It may be approximate, and may not correspond to absolute dimensions in any given unit. */
export interface AspectRatio {
  $type?: "so.sprk.media.defs#aspectRatio";
  width: number;
  height: number;
}

const hashAspectRatio = "aspectRatio";

export function isAspectRatio<V>(v: V): v is AspectRatio & V {
  return is$typed(v, id, hashAspectRatio);
}

export function validateAspectRatio<V>(
  v: V,
): ValidationResult<AspectRatio & V> {
  return validate<AspectRatio & V>(v, id, hashAspectRatio);
}
