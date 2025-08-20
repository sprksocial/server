/**
 * GENERATED CODE - DO NOT MODIFY
 */
import type * as SoSprkActorDefs from "./defs.ts";

export type QueryParams = {
  /** Search query prefix; not a full query string. */
  q?: string;
  limit: number;
};
export type InputSchema = undefined;

export interface OutputSchema {
  actors: (SoSprkActorDefs.ProfileViewBasic)[];
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
