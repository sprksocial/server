/**
 * GENERATED CODE - DO NOT MODIFY
 */
import type { BlobRef } from "@atp/lexicon";

export type QueryParams = globalThis.Record<PropertyKey, never>;
export type InputSchema = string | Uint8Array | Blob;

export interface OutputSchema {
  blob: BlobRef;
}

export interface HandlerInput {
  encoding: "*/*";
  body: ReadableStream;
}

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
