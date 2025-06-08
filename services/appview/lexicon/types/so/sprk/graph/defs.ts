/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { BlobRef, type ValidationResult } from "@atproto/lexicon";
import { CID } from "multiformats/cid";
import { validate as _validate } from "../../../../lexicons";
import {
  type $Typed,
  is$typed as _is$typed,
  type OmitKey,
} from "../../../../util";
import type * as ComAtprotoLabelDefs from "../../../com/atproto/label/defs.js";
import type * as SoSprkActorDefs from "../actor/defs.js";
import type * as SoSprkRichtextFacet from "../richtext/facet.js";
import type * as SoSprkFeedDefs from "../feed/defs.js";

const is$typed = _is$typed, validate = _validate;
const id = "so.sprk.graph.defs";

export interface ListViewBasic {
  $type?: "so.sprk.graph.defs#listViewBasic";
  uri: string;
  cid: string;
  name: string;
  purpose: ListPurpose;
  avatar?: string;
  listItemCount?: number;
  labels?: (ComAtprotoLabelDefs.Label)[];
  viewer?: ListViewerState;
  indexedAt?: string;
}

const hashListViewBasic = "listViewBasic";

export function isListViewBasic<V>(v: V) {
  return is$typed(v, id, hashListViewBasic);
}

export function validateListViewBasic<V>(v: V) {
  return validate<ListViewBasic & V>(v, id, hashListViewBasic);
}

export interface ListView {
  $type?: "so.sprk.graph.defs#listView";
  uri: string;
  cid: string;
  creator: SoSprkActorDefs.ProfileView;
  name: string;
  purpose: ListPurpose;
  description?: string;
  descriptionFacets?: (SoSprkRichtextFacet.Main)[];
  avatar?: string;
  listItemCount?: number;
  labels?: (ComAtprotoLabelDefs.Label)[];
  viewer?: ListViewerState;
  indexedAt: string;
}

const hashListView = "listView";

export function isListView<V>(v: V) {
  return is$typed(v, id, hashListView);
}

export function validateListView<V>(v: V) {
  return validate<ListView & V>(v, id, hashListView);
}

export interface ListItemView {
  $type?: "so.sprk.graph.defs#listItemView";
  uri: string;
  subject: SoSprkActorDefs.ProfileView;
}

const hashListItemView = "listItemView";

export function isListItemView<V>(v: V) {
  return is$typed(v, id, hashListItemView);
}

export function validateListItemView<V>(v: V) {
  return validate<ListItemView & V>(v, id, hashListItemView);
}

export interface StarterPackView {
  $type?: "so.sprk.graph.defs#starterPackView";
  uri: string;
  cid: string;
  record: { [_ in string]: unknown };
  creator: SoSprkActorDefs.ProfileViewBasic;
  list?: ListViewBasic;
  listItemsSample?: (ListItemView)[];
  feeds?: (SoSprkFeedDefs.GeneratorView)[];
  joinedWeekCount?: number;
  joinedAllTimeCount?: number;
  labels?: (ComAtprotoLabelDefs.Label)[];
  indexedAt: string;
}

const hashStarterPackView = "starterPackView";

export function isStarterPackView<V>(v: V) {
  return is$typed(v, id, hashStarterPackView);
}

export function validateStarterPackView<V>(v: V) {
  return validate<StarterPackView & V>(v, id, hashStarterPackView);
}

export interface StarterPackViewBasic {
  $type?: "so.sprk.graph.defs#starterPackViewBasic";
  uri: string;
  cid: string;
  record: { [_ in string]: unknown };
  creator: SoSprkActorDefs.ProfileViewBasic;
  listItemCount?: number;
  joinedWeekCount?: number;
  joinedAllTimeCount?: number;
  labels?: (ComAtprotoLabelDefs.Label)[];
  indexedAt: string;
}

const hashStarterPackViewBasic = "starterPackViewBasic";

export function isStarterPackViewBasic<V>(v: V) {
  return is$typed(v, id, hashStarterPackViewBasic);
}

export function validateStarterPackViewBasic<V>(v: V) {
  return validate<StarterPackViewBasic & V>(v, id, hashStarterPackViewBasic);
}

export type ListPurpose =
  | "so.sprk.graph.defs#modlist"
  | "so.sprk.graph.defs#curatelist"
  | "so.sprk.graph.defs#referencelist"
  | (string & {});

/** A list of actors to apply an aggregate moderation action (mute/block) on. */
export const MODLIST = `${id}#modlist`;
/** A list of actors used for curation purposes such as list feeds or interaction gating. */
export const CURATELIST = `${id}#curatelist`;
/** A list of actors used for only for reference purposes such as within a starter pack. */
export const REFERENCELIST = `${id}#referencelist`;

export interface ListViewerState {
  $type?: "so.sprk.graph.defs#listViewerState";
  muted?: boolean;
  blocked?: string;
}

const hashListViewerState = "listViewerState";

export function isListViewerState<V>(v: V) {
  return is$typed(v, id, hashListViewerState);
}

export function validateListViewerState<V>(v: V) {
  return validate<ListViewerState & V>(v, id, hashListViewerState);
}

/** indicates that a handle or DID could not be resolved */
export interface NotFoundActor {
  $type?: "so.sprk.graph.defs#notFoundActor";
  actor: string;
  notFound: true;
}

const hashNotFoundActor = "notFoundActor";

export function isNotFoundActor<V>(v: V) {
  return is$typed(v, id, hashNotFoundActor);
}

export function validateNotFoundActor<V>(v: V) {
  return validate<NotFoundActor & V>(v, id, hashNotFoundActor);
}

/** lists the bi-directional graph relationships between one actor (not indicated in the object), and the target actors (the DID included in the object) */
export interface Relationship {
  $type?: "so.sprk.graph.defs#relationship";
  did: string;
  /** if the actor follows this DID, this is the AT-URI of the follow record */
  following?: string;
  /** if the actor is followed by this DID, contains the AT-URI of the follow record */
  followedBy?: string;
}

const hashRelationship = "relationship";

export function isRelationship<V>(v: V) {
  return is$typed(v, id, hashRelationship);
}

export function validateRelationship<V>(v: V) {
  return validate<Relationship & V>(v, id, hashRelationship);
}
