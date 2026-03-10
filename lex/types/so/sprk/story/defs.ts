/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { validate as _validate } from "../../../../lexicons.ts";
import { type $Typed, is$typed as _is$typed } from "../../../../util.ts";
import type * as SoSprkActorDefs from "../actor/defs.ts";
import type * as SoSprkMediaImage from "../media/image.ts";
import type * as SoSprkMediaVideo from "../media/video.ts";
import type * as SoSprkEmbedDefs from "../embed/defs.ts";

const is$typed = _is$typed, validate = _validate;
const id = "so.sprk.story.defs";

export interface StoryView {
  $type?: "so.sprk.story.defs#storyView";
  uri: string;
  cid: string;
  author: SoSprkActorDefs.ProfileViewBasic;
  record: { [_ in string]: unknown };
  media?: $Typed<SoSprkMediaImage.View> | $Typed<SoSprkMediaVideo.View> | {
    $type: string;
  };
  embeds?: SoSprkEmbedDefs.Views;
  indexedAt: string;
}

const hashStoryView = "storyView";

export function isStoryView<V>(v: V) {
  return is$typed(v, id, hashStoryView);
}

export function validateStoryView<V>(v: V) {
  return validate<StoryView & V>(v, id, hashStoryView);
}

export interface StoriesByAuthor {
  $type?: "so.sprk.story.defs#storiesByAuthor";
  author: SoSprkActorDefs.ProfileViewBasic;
  stories: (StoryView)[];
}

const hashStoriesByAuthor = "storiesByAuthor";

export function isStoriesByAuthor<V>(v: V) {
  return is$typed(v, id, hashStoriesByAuthor);
}

export function validateStoriesByAuthor<V>(v: V) {
  return validate<StoriesByAuthor & V>(v, id, hashStoriesByAuthor);
}

export interface Interaction {
  $type?: "so.sprk.story.defs#interaction";
  item?: string;
  event?:
    | "so.sprk.feed.defs#clickthroughItem"
    | "so.sprk.feed.defs#clickthroughAuthor"
    | "so.sprk.feed.defs#clickthroughReposter"
    | "so.sprk.feed.defs#clickthroughEmbed"
    | "so.sprk.feed.defs#interactionSeen"
    | "so.sprk.feed.defs#interactionLike"
    | "so.sprk.feed.defs#interactionRepost"
    | "so.sprk.feed.defs#interactionShare"
    | (string & globalThis.Record<PropertyKey, never>);
}

const hashInteraction = "interaction";

export function isInteraction<V>(v: V) {
  return is$typed(v, id, hashInteraction);
}

export function validateInteraction<V>(v: V) {
  return validate<Interaction & V>(v, id, hashInteraction);
}
