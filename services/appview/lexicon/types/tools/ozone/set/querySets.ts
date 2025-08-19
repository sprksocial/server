/**
 * GENERATED CODE - DO NOT MODIFY
 */
import type * as ToolsOzoneSetDefs from "./defs.ts";

export type QueryParams = {
  limit: number;
  cursor?: string;
  namePrefix?: string;
  sortBy: "name" | "createdAt" | "updatedAt";
  /** Defaults to ascending order of name field. */
  sortDirection: "asc" | "desc";
};
export type InputSchema = undefined;

export interface OutputSchema {
  sets: (ToolsOzoneSetDefs.SetView)[];
  cursor?: string;
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
