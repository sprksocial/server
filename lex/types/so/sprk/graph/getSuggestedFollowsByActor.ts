/**
 * GENERATED CODE - DO NOT MODIFY
 */
import type * as SoSprkActorDefs from "../actor/defs.ts";

export type QueryParams = {
  actor: string;
};
export type InputSchema = undefined;

export interface OutputSchema {
  suggestions: (SoSprkActorDefs.ProfileView)[];
  /** If true, response has fallen-back to generic results, and is not scoped using relativeToDid */
  isFallback?: boolean;
  /** Snowflake for this recommendation, use when submitting recommendation events. */
  recId?: number;
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
