/**
 * GENERATED CODE - DO NOT MODIFY
 */
import type * as AppBskyGraphDefs from "../graph/defs.ts";

export type QueryParams = {
  limit: number;
};
export type InputSchema = undefined;

export interface OutputSchema {
  starterPacks: (AppBskyGraphDefs.StarterPackView)[];
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
