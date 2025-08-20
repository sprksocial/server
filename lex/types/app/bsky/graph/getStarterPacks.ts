/**
 * GENERATED CODE - DO NOT MODIFY
 */
import type * as AppBskyGraphDefs from "./defs.ts";

export type QueryParams = {
  uris: string[];
};
export type InputSchema = undefined;

export interface OutputSchema {
  starterPacks: (AppBskyGraphDefs.StarterPackViewBasic)[];
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
