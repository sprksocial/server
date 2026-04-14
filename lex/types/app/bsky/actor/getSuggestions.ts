/**
 * GENERATED CODE - DO NOT MODIFY
 */
import type * as AppBskyActorDefs from "./defs.ts";

export type QueryParams = {
  limit: number;
  cursor?: string;
};
export type InputSchema = undefined;

export interface OutputSchema {
  cursor?: string;
  actors: (AppBskyActorDefs.ProfileView)[];
  /** DEPRECATED: use recIdStr instead. */
  recId?: number;
  /** Snowflake for this recommendation, use when submitting recommendation events. */
  recIdStr?: string;
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
