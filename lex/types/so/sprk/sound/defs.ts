/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { validate as _validate } from "../../../../lexicons.ts";
import type { ValidationResult } from "@atp/lexicon";
import { is$typed as _is$typed } from "../../../../util.ts";
import type * as SoSprkActorDefs from "../actor/defs.ts";
import type * as ComAtprotoLabelDefs from "../../../com/atproto/label/defs.ts";

const is$typed = _is$typed, validate = _validate;
const id = "so.sprk.sound.defs";

export interface AudioView {
  $type?: "so.sprk.sound.defs#audioView";
  uri: string;
  cid: string;
  author: SoSprkActorDefs.ProfileViewBasic;
  record: { [_ in string]: unknown };
  useCount?: number;
  title: string;
  coverArt: string;
  details?: AudioDetails;
  indexedAt: string;
  audio?: string;
  labels?: (ComAtprotoLabelDefs.Label)[];
}

const hashAudioView = "audioView";

export function isAudioView<V>(v: V): v is AudioView & V {
  return is$typed(v, id, hashAudioView);
}

export function validateAudioView<V>(v: V): ValidationResult<AudioView & V> {
  return validate<AudioView & V>(v, id, hashAudioView);
}

/** Metadata about the audio content. */
export interface AudioDetails {
  $type?: "so.sprk.sound.defs#audioDetails";
  artist?: string;
  title?: string;
}

const hashAudioDetails = "audioDetails";

export function isAudioDetails<V>(v: V): v is AudioDetails & V {
  return is$typed(v, id, hashAudioDetails);
}

export function validateAudioDetails<V>(
  v: V,
): ValidationResult<AudioDetails & V> {
  return validate<AudioDetails & V>(v, id, hashAudioDetails);
}
