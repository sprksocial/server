/**
 * GENERATED CODE - DO NOT MODIFY
 */
import type * as AppBskyFeedDefs from "./defs.ts";

export type QueryParams = {
  /** Reference (AT-URI) to the list record. */
  list: string;
  limit: number;
  cursor?: string;
};
export type InputSchema = undefined;

export interface OutputSchema {
  cursor?: string;
  feed: (AppBskyFeedDefs.FeedViewPost)[];
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
  error?: "UnknownList";
}

export type HandlerOutput = HandlerError | HandlerSuccess;
