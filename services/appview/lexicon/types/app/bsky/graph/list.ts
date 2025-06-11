/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { BlobRef } from "@atproto/lexicon";
import { validate as _validate } from "../../../../lexicons.ts";
import { is$typed as _is$typed } from "../../../../util.ts";
import { type $Typed } from "../../../../util.ts";
import type * as AppBskyGraphDefs from "./defs.ts";
import type * as AppBskyRichtextFacet from "../richtext/facet.ts";
import type * as ComAtprotoLabelDefs from "../../../com/atproto/label/defs.ts";

const is$typed = _is$typed, validate = _validate;
const id = "app.bsky.graph.list";

export interface MainRecord {
  $type: "app.bsky.graph.list";
  purpose: AppBskyGraphDefs.ListPurpose;
  /** Display name for list; can not be empty. */
  name: string;
  description?: string;
  descriptionFacets?: (AppBskyRichtextFacet.Main)[];
  avatar?: BlobRef;
  labels?: $Typed<ComAtprotoLabelDefs.SelfLabels> | { $type: string };
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
