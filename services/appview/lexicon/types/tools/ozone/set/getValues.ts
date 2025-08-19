/**
 * GENERATED CODE - DO NOT MODIFY
 */
import type * as ToolsOzoneSetDefs from "./defs.ts";

export type QueryParams = {
  name: string;
  limit: number;
  cursor?: string;
};
export type InputSchema = undefined;

export interface OutputSchema {
  set: ToolsOzoneSetDefs.SetView;
  values: (string)[];
  cursor?: string;
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
  error?: "SetNotFound";
}

export type HandlerOutput = HandlerError | HandlerSuccess;
