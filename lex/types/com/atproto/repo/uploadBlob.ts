/**
 * GENERATED CODE - DO NOT MODIFY
 */
import stream from "node:stream";
import { BlobRef } from "@atp/lexicon";

export type QueryParams = globalThis.Record<PropertyKey, never>;
export type InputSchema = string | Uint8Array | Blob;

export interface OutputSchema {
  blob: BlobRef;
}

export interface HandlerInput {
  encoding: "*/*";
  body: stream.Readable;
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
