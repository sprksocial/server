/**
 * GENERATED CODE - DO NOT MODIFY
 */
import type * as ToolsOzoneModerationDefs from "./defs.ts";

export type QueryParams = {
  did: string;
};
export type InputSchema = undefined;
export type OutputSchema = ToolsOzoneModerationDefs.RepoViewDetail;
export type HandlerInput = void;

export interface HandlerSuccess {
  encoding: "application/json";
  body: OutputSchema;
  headers?: { [key: string]: string };
}

export interface HandlerError {
  status: number;
  message?: string;
  error?: "RepoNotFound";
}

export type HandlerOutput = HandlerError | HandlerSuccess;
