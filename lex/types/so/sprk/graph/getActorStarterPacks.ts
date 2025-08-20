/**
 * GENERATED CODE - DO NOT MODIFY
 */
import type * as SoSprkGraphDefs from "./defs.ts";

export type QueryParams = {
  actor: string;
  limit: number;
  cursor?: string;
};
export type InputSchema = undefined;

export interface OutputSchema {
  cursor?: string;
  starterPacks: (SoSprkGraphDefs.StarterPackViewBasic)[];
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
