/**
 * GENERATED CODE - DO NOT MODIFY
 */
import type * as AppBskyDraftDefs from "./defs.ts";

export type QueryParams = globalThis.Record<PropertyKey, never>;

export interface InputSchema {
  draft: AppBskyDraftDefs.DraftWithId;
}

export interface HandlerInput {
  encoding: "application/json";
  body: InputSchema;
}

export interface HandlerError {
  status: number;
  message?: string;
}

export type HandlerOutput = HandlerError | void;
