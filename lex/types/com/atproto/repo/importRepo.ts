/**
 * GENERATED CODE - DO NOT MODIFY
 */
export type QueryParams = globalThis.Record<PropertyKey, never>;
export type InputSchema = string | Uint8Array | Blob;

export interface HandlerInput {
  encoding: "application/vnd.ipld.car";
  body: ReadableStream;
}

export interface HandlerError {
  status: number;
  message?: string;
}

export type HandlerOutput = HandlerError | void;
