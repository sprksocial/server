/**
 * GENERATED CODE - DO NOT MODIFY
 */
import type * as SoSprkFeedDefs from "./defs.ts";

export type QueryParams = {
  /** Search query string; to match against post descriptions and such. */
  q: string;
  /** Specifies the ranking order of results. */
  sort: "top" | "latest" | (string & globalThis.Record<PropertyKey, never>);
  limit: number;
  /** Optional pagination mechanism; may not necessarily allow scrolling through entire result set. */
  cursor?: string;
};
export type InputSchema = undefined;

export interface OutputSchema {
  cursor?: string;
  /** Count of search hits. Optional, may be rounded/truncated, and may not be possible to paginate through all hits. */
  hitsTotal?: number;
  posts: (SoSprkFeedDefs.PostView)[];
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
  error?: "BadQueryString";
}

export type HandlerOutput = HandlerError | HandlerSuccess;
