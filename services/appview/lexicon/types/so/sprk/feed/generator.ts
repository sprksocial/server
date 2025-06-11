/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { BlobRef } from "@atproto/lexicon";
import { validate as _validate } from "../../../../lexicons.ts";
import { is$typed as _is$typed } from "../../../../util.ts";
import { type $Typed } from "../../../../util.ts";
import type * as SoSprkRichtextFacet from "../richtext/facet.ts";
import type * as ComAtprotoLabelDefs from "../../../com/atproto/label/defs.ts";

const is$typed = _is$typed, validate = _validate;
const id = "so.sprk.feed.generator";

export interface MainRecord {
  $type: "so.sprk.feed.generator";
  did: string;
  displayName: string;
  description?: string;
  descriptionFacets?: (SoSprkRichtextFacet.Main)[];
  avatar?: BlobRef;
  /** Declaration that a feed accepts feedback interactions from a client through so.sprk.feed.sendInteractions */
  acceptsInteractions?: boolean;
  labels?: $Typed<ComAtprotoLabelDefs.SelfLabels> | { $type: string };
  contentMode?:
    | "so.sprk.feed.defs#contentModeUnspecified"
    | "so.sprk.feed.defs#contentModeVideo"
    | (string & { __brand?: never });
  createdAt: string;
  [k: string]: unknown;
}

const hashMainRecord = "main";

export function isMainRecord<V>(v: V) {
  return is$typed(v, id, hashMainRecord);
}

export function validateMainRecord<V>(v: V) {
  return validate<MainRecord & V>(v, id, hashMainRecord, true);
}
