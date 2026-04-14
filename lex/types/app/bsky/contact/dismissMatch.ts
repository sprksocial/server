/**
 * GENERATED CODE - DO NOT MODIFY
 */
export type QueryParams = globalThis.Record<PropertyKey, never>;

export interface InputSchema {
  /** The subject's DID to dismiss the match with. */
  subject: string;
}

export type OutputSchema = globalThis.Record<PropertyKey, never>;

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
  error?: "InvalidDid" | "InternalError";
}

export type HandlerOutput = HandlerError | HandlerSuccess;
