/**
 * GENERATED CODE - DO NOT MODIFY
 */
import type * as ToolsOzoneSignatureDefs from "./defs.ts";

export type QueryParams = {
  dids: string[];
};
export type InputSchema = undefined;

export interface OutputSchema {
  details: (ToolsOzoneSignatureDefs.SigDetail)[];
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
