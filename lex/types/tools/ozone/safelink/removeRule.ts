/**
 * GENERATED CODE - DO NOT MODIFY
 */
import type * as ToolsOzoneSafelinkDefs from "./defs.ts";

export type QueryParams = globalThis.Record<PropertyKey, never>;

export interface InputSchema {
  /** The URL or domain to remove the rule for */
  url: string;
  pattern: ToolsOzoneSafelinkDefs.PatternType;
  /** Optional comment about why the rule is being removed */
  comment?: string;
  /** Optional DID of the user. Only respected when using admin auth. */
  createdBy?: string;
}

export type OutputSchema = ToolsOzoneSafelinkDefs.Event;

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
  error?: "RuleNotFound";
}

export type HandlerOutput = HandlerError | HandlerSuccess;
