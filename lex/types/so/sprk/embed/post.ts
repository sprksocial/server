/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { validate as _validate } from "../../../../lexicons.ts";
import { type $Typed, is$typed as _is$typed } from "../../../../util.ts";
import type * as SoSprkEmbedDefs from "./defs.ts";
import type * as ComAtprotoRepoStrongRef from "../../../com/atproto/repo/strongRef.ts";
import type * as SoSprkFeedDefs from "../feed/defs.ts";

const is$typed = _is$typed, validate = _validate;
const id = "so.sprk.embed.post";

export interface Main {
  $type?: "so.sprk.embed.post";
  placement: SoSprkEmbedDefs.Placement;
  post: ComAtprotoRepoStrongRef.Main;
}

const hashMain = "main";

export function isMain<V>(v: V) {
  return is$typed(v, id, hashMain);
}

export function validateMain<V>(v: V) {
  return validate<Main & V>(v, id, hashMain);
}

export interface View {
  $type?: "so.sprk.embed.post#view";
  placement: SoSprkEmbedDefs.Placement;
  post:
    | $Typed<SoSprkFeedDefs.PostView>
    | $Typed<SoSprkFeedDefs.NotFoundPost>
    | $Typed<SoSprkFeedDefs.BlockedPost>
    | { $type: string };
}

const hashView = "view";

export function isView<V>(v: V) {
  return is$typed(v, id, hashView);
}

export function validateView<V>(v: V) {
  return validate<View & V>(v, id, hashView);
}
