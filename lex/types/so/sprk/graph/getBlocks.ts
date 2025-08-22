/**
 * GENERATED CODE - DO NOT MODIFY
 */
import type * as SoSprkActorDefs from "../actor/defs.ts";

export type QueryParams = {
  limit: number;
  cursor?: string;
};
export type InputSchema = undefined;

export interface OutputSchema {
  cursor?: string;
  blocks: (SoSprkActorDefs.ProfileView)[];
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
