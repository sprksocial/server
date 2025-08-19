/**
 * GENERATED CODE - DO NOT MODIFY
 */
import type * as ToolsOzoneModerationDefs from "./defs.ts";

export type QueryParams = {
  id: number;
};
export type InputSchema = undefined;
export type OutputSchema = ToolsOzoneModerationDefs.ModEventViewDetail;
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
