/**
 * GENERATED CODE - DO NOT MODIFY
 */
import type * as AppBskyUnspeccedDefs from "./defs.ts";

export type QueryParams = {
  /** DID of the account making the request (not included for public/unauthenticated queries). Used to boost followed accounts in ranking. */
  viewer?: string;
  limit: number;
  cursor?: string;
  /** DID of the account to get suggestions relative to. If not provided, suggestions will be based on the viewer. */
  relativeToDid?: string;
};
export type InputSchema = undefined;

export interface OutputSchema {
  cursor?: string;
  actors: (AppBskyUnspeccedDefs.SkeletonSearchActor)[];
  /** DID of the account these suggestions are relative to. If this is returned undefined, suggestions are based on the viewer. */
  relativeToDid?: string;
  /** Snowflake for this recommendation, use when submitting recommendation events. */
  recId?: number;
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
