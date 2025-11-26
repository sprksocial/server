/**
 * GENERATED CODE - DO NOT MODIFY
 */
import type * as AppBskyGraphDefs from "./defs.ts";

export type QueryParams = {
  /** The account (actor) to enumerate lists from. */
  actor: string;
  limit: number;
  cursor?: string;
  /** Optional filter by list purpose. If not specified, all supported types are returned. */
  purposes?:
    | "modlist"
    | "curatelist"
    | (string & globalThis.Record<PropertyKey, never>)[];
};
export type InputSchema = undefined;

export interface OutputSchema {
  cursor?: string;
  lists: (AppBskyGraphDefs.ListView)[];
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
