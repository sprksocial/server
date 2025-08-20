/**
 * GENERATED CODE - DO NOT MODIFY
 */
import type * as SoSprkFeedDefs from "./defs.ts";

export type QueryParams = {
  /** List of story AT-URIs to return hydrated views for. */
  uris: string[];
};
export type InputSchema = undefined;

export interface OutputSchema {
  stories: (SoSprkFeedDefs.StoryView)[];
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
