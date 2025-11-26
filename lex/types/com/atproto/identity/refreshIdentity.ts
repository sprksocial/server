/**
 * GENERATED CODE - DO NOT MODIFY
 */
import type * as ComAtprotoIdentityDefs from "./defs.ts";

export type QueryParams = globalThis.Record<PropertyKey, never>;

export interface InputSchema {
  identifier: string;
}

export type OutputSchema = ComAtprotoIdentityDefs.IdentityInfo;

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
  error?: "HandleNotFound" | "DidNotFound" | "DidDeactivated";
}

export type HandlerOutput = HandlerError | HandlerSuccess;
