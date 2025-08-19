/**
 * GENERATED CODE - DO NOT MODIFY
 */
import type * as ToolsOzoneModerationDefs from "./defs.ts";

export type QueryParams = {
  dids: string[];
};
export type InputSchema = undefined;

export interface OutputSchema {
  stats: (ToolsOzoneModerationDefs.ReporterStats)[];
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
