/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { validate as _validate } from "../../../../lexicons.ts";
import { type $Typed, is$typed as _is$typed } from "../../../../util.ts";
import type * as SoSprkMediaImage from "../media/image.ts";
import type * as SoSprkMediaVideo from "../media/video.ts";
import type * as ComAtprotoRepoStrongRef from "../../../com/atproto/repo/strongRef.ts";
import type * as SoSprkEmbedDefs from "../embed/defs.ts";
import type * as ComAtprotoLabelDefs from "../../../com/atproto/label/defs.ts";

const is$typed = _is$typed, validate = _validate;
const id = "so.sprk.story.post";

export interface Record {
  $type: "so.sprk.story.post";
  media: $Typed<SoSprkMediaImage.Main> | $Typed<SoSprkMediaVideo.Main> | {
    $type: string;
  };
  sound?: ComAtprotoRepoStrongRef.Main;
  embeds?: SoSprkEmbedDefs.Embeds;
  labels?: $Typed<ComAtprotoLabelDefs.SelfLabels> | { $type: string };
  /** Client-declared timestamp when this story was originally created. */
  createdAt: string;
  [k: string]: unknown;
}

const hashRecord = "main";

export function isRecord<V>(v: V) {
  return is$typed(v, id, hashRecord);
}

export function validateRecord<V>(v: V) {
  return validate<Record & V>(v, id, hashRecord, true);
}

export type Main = Record;
