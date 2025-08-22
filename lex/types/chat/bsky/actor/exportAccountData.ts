/**
 * GENERATED CODE - DO NOT MODIFY
 */
import stream from "node:stream";

export type QueryParams = globalThis.Record<PropertyKey, never>;
export type InputSchema = undefined;
export type HandlerInput = void;

export interface HandlerSuccess {
  encoding: "application/jsonl";
  body: Uint8Array | stream.Readable;
  headers?: { [key: string]: string };
}

export interface HandlerError {
  status: number;
  message?: string;
}

export type HandlerOutput = HandlerError | HandlerSuccess;
