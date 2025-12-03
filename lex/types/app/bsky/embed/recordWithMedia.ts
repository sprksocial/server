/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { validate as _validate } from "../../../../lexicons.ts";
import { type $Typed, is$typed as _is$typed } from "../../../../util.ts";
import type * as AppBskyEmbedRecord from "./record.ts";
import type * as AppBskyEmbedImages from "./images.ts";
import type * as AppBskyEmbedVideo from "./video.ts";
import type * as AppBskyEmbedExternal from "./external.ts";

const is$typed = _is$typed, validate = _validate;
const id = "app.bsky.embed.recordWithMedia";

export interface Main {
  $type?: "app.bsky.embed.recordWithMedia";
  record: AppBskyEmbedRecord.Main;
  media:
    | $Typed<AppBskyEmbedImages.Main>
    | $Typed<AppBskyEmbedVideo.Main>
    | $Typed<AppBskyEmbedExternal.Main>
    | { $type: string };
}

const hashMain = "main";

export function isMain<V>(v: V) {
  return is$typed(v, id, hashMain);
}

export function validateMain<V>(v: V) {
  return validate<Main & V>(v, id, hashMain);
}

export interface View {
  $type?: "app.bsky.embed.recordWithMedia#view";
  record: AppBskyEmbedRecord.View;
  media:
    | $Typed<AppBskyEmbedImages.View>
    | $Typed<AppBskyEmbedVideo.View>
    | $Typed<AppBskyEmbedExternal.View>
    | { $type: string };
}

const hashView = "view";

export function isView<V>(v: V) {
  return is$typed(v, id, hashView);
}

export function validateView<V>(v: V) {
  return validate<View & V>(v, id, hashView);
}
