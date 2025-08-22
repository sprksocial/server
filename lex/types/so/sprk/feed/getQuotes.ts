/**
 * GENERATED CODE - DO NOT MODIFY
 */
import type * as SoSprkFeedDefs from "./defs.ts";

export type QueryParams = {
  /** Reference (AT-URI) of post record */
  uri: string;
  /** If supplied, filters to quotes of specific version (by CID) of the post record. */
  cid?: string;
  limit: number;
  cursor?: string;
};
export type InputSchema = undefined;

export interface OutputSchema {
  uri: string;
  cid?: string;
  cursor?: string;
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
}

export type HandlerOutput = HandlerError | HandlerSuccess;
