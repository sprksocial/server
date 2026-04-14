/**
 * GENERATED CODE - DO NOT MODIFY
 */
import type { BlobRef } from "@atp/lexicon";
import { validate as _validate } from "../../../../lexicons.ts";
import type { ValidationResult } from "@atp/lexicon";
import { type $Typed, is$typed as _is$typed } from "../../../../util.ts";
import type * as ComAtprotoRepoStrongRef from "../../../com/atproto/repo/strongRef.ts";
import type * as SoSprkSoundDefs from "./defs.ts";
import type * as ComAtprotoLabelDefs from "../../../com/atproto/label/defs.ts";

const is$typed = _is$typed, validate = _validate;
const id = "so.sprk.sound.audio";

export interface Record {
  $type: "so.sprk.sound.audio";
  sound: BlobRef;
  origin?: ComAtprotoRepoStrongRef.Main;
  /** The audio's title. */
  title: string;
  details?: SoSprkSoundDefs.AudioDetails;
  labels?: $Typed<ComAtprotoLabelDefs.SelfLabels> | { $type: string };
  /** Client-declared timestamp when this audio was originally created. */
  createdAt: string;
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
