/**
 * GENERATED CODE - DO NOT MODIFY
 */
import type * as AppBskyFeedDefs from "../feed/defs.ts";

export type QueryParams = {
  limit: number;
};
export type InputSchema = undefined;

export interface OutputSchema {
  feeds: (AppBskyFeedDefs.GeneratorView)[];
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
