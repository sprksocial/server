/**
 * GENERATED CODE - DO NOT MODIFY
 */
export type QueryParams = globalThis.Record<PropertyKey, never>;
export type InputSchema = globalThis.Record<PropertyKey, never>;
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
