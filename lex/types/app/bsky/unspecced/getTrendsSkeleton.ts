/**
 * GENERATED CODE - DO NOT MODIFY
 */
import type * as AppBskyUnspeccedDefs from "./defs.ts";

export type QueryParams = {
  /** DID of the account making the request (not included for public/unauthenticated queries). */
  viewer?: string;
  limit: number;
};
export type InputSchema = undefined;

export interface OutputSchema {
  trends: (AppBskyUnspeccedDefs.SkeletonTrend)[];
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
