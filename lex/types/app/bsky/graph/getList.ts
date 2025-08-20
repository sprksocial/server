/**
 * GENERATED CODE - DO NOT MODIFY
 */
import type * as AppBskyGraphDefs from "./defs.ts";

export type QueryParams = {
  /** Reference (AT-URI) of the list record to hydrate. */
  list: string;
  limit: number;
  cursor?: string;
};
export type InputSchema = undefined;

export interface OutputSchema {
  cursor?: string;
  list: AppBskyGraphDefs.ListView;
  items: (AppBskyGraphDefs.ListItemView)[];
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
}

export type HandlerOutput = HandlerError | HandlerSuccess;
