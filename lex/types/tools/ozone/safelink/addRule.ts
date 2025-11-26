/**
 * GENERATED CODE - DO NOT MODIFY
 */
import type * as ToolsOzoneSafelinkDefs from "./defs.ts";

export type QueryParams = globalThis.Record<PropertyKey, never>;

export interface InputSchema {
  /** The URL or domain to apply the rule to */
  url: string;
  pattern: ToolsOzoneSafelinkDefs.PatternType;
  action: ToolsOzoneSafelinkDefs.ActionType;
  reason: ToolsOzoneSafelinkDefs.ReasonType;
  /** Optional comment about the decision */
  comment?: string;
  /** Author DID. Only respected when using admin auth */
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
  error?: "InvalidUrl" | "RuleAlreadyExists";
}

export type HandlerOutput = HandlerError | HandlerSuccess;
