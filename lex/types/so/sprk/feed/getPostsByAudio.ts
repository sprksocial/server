/**
 * GENERATED CODE - DO NOT MODIFY
 */
import type * as SoSprkFeedDefs from "./defs.ts";

export type QueryParams = {
  /** Audio AT-URI to find referencing posts for. */
  uri: string;
  limit: number;
  cursor?: string;
};
export type InputSchema = undefined;

export interface OutputSchema {
  cursor?: string;
  posts: (SoSprkFeedDefs.PostView)[];
  audio?: SoSprkFeedDefs.AudioView;
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
