/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { BlobRef } from "@atproto/lexicon";
import { validate as _validate } from "../../../../lexicons.ts";
import { is$typed as _is$typed } from "../../../../util.ts";
import { type $Typed } from "../../../../util.ts";
import type * as SoSprkGraphDefs from "./defs.ts";
import type * as SoSprkRichtextFacet from "../richtext/facet.ts";
import type * as ComAtprotoLabelDefs from "../../../com/atproto/label/defs.ts";

const is$typed = _is$typed, validate = _validate;
const id = "so.sprk.graph.list";

export interface MainRecord {
  $type: "so.sprk.graph.list";
  purpose: SoSprkGraphDefs.ListPurpose;
  /** Display name for list; can not be empty. */
  name: string;
  description?: string;
  descriptionFacets?: (SoSprkRichtextFacet.Main)[];
  avatar?: BlobRef;
  labels?: $Typed<ComAtprotoLabelDefs.SelfLabels> | { $type: string };
  createdAt: string;
  [k: string]: unknown;
}

export type Record = MainRecord;

const hashMainRecord = "main";

export function isMainRecord<V>(v: V) {
  return is$typed(v, id, hashMainRecord);
}

export function validateMainRecord<V>(v: V) {
  return validate<MainRecord & V>(v, id, hashMainRecord, true);
}
