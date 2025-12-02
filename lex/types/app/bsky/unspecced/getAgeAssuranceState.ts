/**
 * GENERATED CODE - DO NOT MODIFY
 */
import type * as AppBskyUnspeccedDefs from "./defs.ts";

export type QueryParams = globalThis.Record<PropertyKey, never>;
export type InputSchema = undefined;
export type OutputSchema = AppBskyUnspeccedDefs.AgeAssuranceState;
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
