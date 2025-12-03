/**
 * GENERATED CODE - DO NOT MODIFY
 */
import type * as SoSprkVideoDefs from "./defs.ts";

export type QueryParams = globalThis.Record<PropertyKey, never>;
export type InputSchema = string | Uint8Array | Blob;

export interface OutputSchema {
  jobStatus: SoSprkVideoDefs.JobStatus;
}

export interface HandlerInput {
  encoding: "video/mp4";
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
