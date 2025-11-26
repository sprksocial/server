/**
 * GENERATED CODE - DO NOT MODIFY
 */
import type * as ToolsOzoneTeamDefs from "./defs.ts";

export type QueryParams = globalThis.Record<PropertyKey, never>;

export interface InputSchema {
  did: string;
  disabled?: boolean;
  role?:
    | "tools.ozone.team.defs#roleAdmin"
    | "tools.ozone.team.defs#roleModerator"
    | "tools.ozone.team.defs#roleVerifier"
    | "tools.ozone.team.defs#roleTriage"
    | (string & globalThis.Record<PropertyKey, never>);
}

export type OutputSchema = ToolsOzoneTeamDefs.Member;

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
  error?: "MemberNotFound";
}

export type HandlerOutput = HandlerError | HandlerSuccess;
