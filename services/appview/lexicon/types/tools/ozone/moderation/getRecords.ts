/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { type $Typed } from "../../../../util.ts";
import type * as ToolsOzoneModerationDefs from "./defs.ts";

export type QueryParams = {
  uris: string[];
};
export type InputSchema = undefined;

export interface OutputSchema {
  records: (
    | $Typed<ToolsOzoneModerationDefs.RecordViewDetail>
    | $Typed<ToolsOzoneModerationDefs.RecordViewNotFound>
    | { $type: string }
  )[];
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
