/**
 * GENERATED CODE - DO NOT MODIFY
 */
import type * as ComAtprotoIdentityDefs from "./defs.ts";

export type QueryParams = {
  /** Handle or DID to resolve. */
  identifier: string;
};
export type InputSchema = undefined;
export type OutputSchema = ComAtprotoIdentityDefs.IdentityInfo;
export type HandlerInput = void;

export interface HandlerSuccess {
  encoding: "application/json";
  body: OutputSchema;
  headers?: { [key: string]: string };
}

export interface HandlerError {
  status: number;
  message?: string;
  error?: "HandleNotFound" | "DidNotFound" | "DidDeactivated";
}

export type HandlerOutput = HandlerError | HandlerSuccess;
