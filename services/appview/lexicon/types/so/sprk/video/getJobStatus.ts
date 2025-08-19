/**
 * GENERATED CODE - DO NOT MODIFY
 */
import type * as SoSprkVideoDefs from "./defs.ts";

export type QueryParams = {
  jobId: string;
};
export type InputSchema = undefined;

export interface OutputSchema {
  jobStatus: SoSprkVideoDefs.JobStatus;
}

export type HandlerInput = void;

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
