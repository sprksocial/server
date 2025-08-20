/**
 * GENERATED CODE - DO NOT MODIFY
 */
import type * as SoSprkActorDefs from "./defs.ts";

export type QueryParams = {
  /** Handle or DID of account to fetch profile of. */
  actor: string;
};
export type InputSchema = undefined;
export type OutputSchema = SoSprkActorDefs.ProfileViewDetailed;
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
