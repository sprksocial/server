/**
 * GENERATED CODE - DO NOT MODIFY
 */
import type * as SoSprkFeedDefs from "./defs.ts";

export type QueryParams = {
  actor: string;
  limit: number;
  cursor?: string;
  /** Combinations of post/repost types to include in response. */
  filter:
    | "posts_with_replies"
    | "posts_no_replies"
    | "posts_with_media"
    | "posts_and_author_threads"
    | "posts_with_video"
    | (string & globalThis.Record<PropertyKey, never>);
  includePins: boolean;
};
export type InputSchema = undefined;

export interface OutputSchema {
  cursor?: string;
  feed: (SoSprkFeedDefs.FeedViewPost)[];
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
  error?: "BlockedActor" | "BlockedByActor";
}

export type HandlerOutput = HandlerError | HandlerSuccess;
