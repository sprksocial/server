/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { validate as _validate } from "../../../../lexicons.ts";
import { type $Typed, is$typed as _is$typed } from "../../../../util.ts";
import type * as SoSprkFeedDefs from "./defs.ts";

const is$typed = _is$typed, validate = _validate;
const id = "so.sprk.feed.getCrosspostThread";

export type QueryParams = {
  /** Reference (AT-URI) to anchor post or reply record. */
  anchor: string;
  limit: number;
  cursor?: string;
  /** How many levels of descendant depth should be included in response. */
  depth: number;
  /** How many levels of parent (and grandparent, etc) items to include. */
  parentHeight: number;
  /** Sorting for thread replies. */
  sort:
    | "newest"
    | "oldest"
    | "top"
    | (string & globalThis.Record<PropertyKey, never>);
};
export type InputSchema = undefined;

export interface OutputSchema {
  cursor?: string;
  /** A flat list of thread items. The depth of each item is indicated by the depth property inside the item. */
  thread: (ThreadItem)[];
  threadgate?: SoSprkFeedDefs.ThreadgateView;
}

export type HandlerInput = void;

export interface HandlerSuccess {
  encoding: "application/json";
  body: OutputSchema;
  headers?: { [key: string]: string };
}

export interface HandlerError {
  status: number;
  message?: string;
  error?: "NotFound";
}

export type HandlerOutput = HandlerError | HandlerSuccess;

export interface ThreadItem {
  $type?: "so.sprk.feed.getCrosspostThread#threadItem";
  uri: string;
  /** The nesting level of this item in the thread. Depth 0 means the anchor item. */
  depth: number;
  value:
    | $Typed<SoSprkFeedDefs.ThreadViewPost>
    | $Typed<SoSprkFeedDefs.NotFoundPost>
    | $Typed<SoSprkFeedDefs.BlockedPost>
    | { $type: string };
}

const hashThreadItem = "threadItem";

export function isThreadItem<V>(v: V) {
  return is$typed(v, id, hashThreadItem);
}

export function validateThreadItem<V>(v: V) {
  return validate<ThreadItem & V>(v, id, hashThreadItem);
}
