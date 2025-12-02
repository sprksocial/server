/**
 * GENERATED CODE - DO NOT MODIFY
 */
import type * as ToolsOzoneSafelinkDefs from "./defs.ts";

export type QueryParams = globalThis.Record<PropertyKey, never>;

export interface InputSchema {
  /** Cursor for pagination */
  cursor?: string;
  /** Maximum number of results to return */
  limit: number;
  /** Filter by specific URLs or domains */
  urls?: (string)[];
  /** Filter by pattern type */
  patternType?: string;
  /** Filter by action types */
  actions?: (string)[];
  /** Filter by reason type */
  reason?: string;
  /** Filter by rule creator */
  createdBy?: string;
  /** Sort direction */
  sortDirection:
    | "asc"
    | "desc"
    | (string & globalThis.Record<PropertyKey, never>);
}

export interface OutputSchema {
  /** Next cursor for pagination. Only present if there are more results. */
  cursor?: string;
  rules: (ToolsOzoneSafelinkDefs.UrlRule)[];
}

export interface HandlerInput {
  encoding: "application/json";
  body: InputSchema;
}

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
