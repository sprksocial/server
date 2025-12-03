/**
 * GENERATED CODE - DO NOT MODIFY
 */
export type QueryParams = globalThis.Record<PropertyKey, never>;
export type InputSchema = undefined;
export type HandlerInput = void;

export interface HandlerSuccess {
  encoding: "application/jsonl";
  body: Uint8Array | ReadableStream;
  headers?: { [key: string]: string };
}

export interface HandlerError {
  status: number;
  message?: string;
}

export type HandlerOutput = HandlerError | HandlerSuccess;
