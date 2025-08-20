/**
 * GENERATED CODE - DO NOT MODIFY
 */
import type * as SoSprkFeedDefs from "../feed/defs.ts";

export type QueryParams = {
  limit: number;
  cursor?: string;
  query?: string;
};
export type InputSchema = undefined;

export interface OutputSchema {
  cursor?: string;
  feeds: (SoSprkFeedDefs.GeneratorView)[];
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
