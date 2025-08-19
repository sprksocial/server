/**
 * GENERATED CODE - DO NOT MODIFY
 */
import type * as SoSprkFeedDefs from "./defs.ts";

export type QueryParams = {
  /** Reference to feed generator record describing the specific feed being requested. */
  feed: string;
  limit: number;
  cursor?: string;
};
export type InputSchema = undefined;

export interface OutputSchema {
  cursor?: string;
  feed: (SoSprkFeedDefs.SkeletonFeedPost)[];
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
  error?: "UnknownFeed";
}

export type HandlerOutput = HandlerError | HandlerSuccess;
