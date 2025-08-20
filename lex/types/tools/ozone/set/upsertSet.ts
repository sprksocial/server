/**
 * GENERATED CODE - DO NOT MODIFY
 */
import type * as ToolsOzoneSetDefs from "./defs.ts";

export type QueryParams = globalThis.Record<PropertyKey, never>;
export type InputSchema = ToolsOzoneSetDefs.Set;
export type OutputSchema = ToolsOzoneSetDefs.SetView;

export interface HandlerInput {
  encoding: "application/json";
  body: InputSchema;
}

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
