/**
 * GENERATED CODE - DO NOT MODIFY
 */
import stream from "node:stream";
import type * as AppBskyVideoDefs from "./defs.ts";

export type QueryParams = globalThis.Record<PropertyKey, never>;
export type InputSchema = string | Uint8Array | Blob;

export interface OutputSchema {
  jobStatus: AppBskyVideoDefs.JobStatus;
}

export interface HandlerInput {
  encoding: "video/mp4";
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
