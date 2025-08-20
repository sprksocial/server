/**
 * GENERATED CODE - DO NOT MODIFY
 */
import type * as ToolsOzoneSettingDefs from "./defs.ts";

export type QueryParams = globalThis.Record<PropertyKey, never>;

export interface InputSchema {
  key: string;
  scope:
    | "instance"
    | "personal"
    | (string & globalThis.Record<PropertyKey, never>);
  value: { [_ in string]: unknown };
  description?: string;
  managerRole?:
    | "tools.ozone.team.defs#roleModerator"
    | "tools.ozone.team.defs#roleTriage"
    | "tools.ozone.team.defs#roleAdmin"
    | (string & globalThis.Record<PropertyKey, never>);
}

export interface OutputSchema {
  option: ToolsOzoneSettingDefs.Option;
}

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
