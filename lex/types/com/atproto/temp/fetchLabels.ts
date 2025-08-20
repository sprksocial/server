/**
 * GENERATED CODE - DO NOT MODIFY
 */
import type * as ComAtprotoLabelDefs from "../label/defs.ts";

export type QueryParams = {
  since?: number;
  limit: number;
};
export type InputSchema = undefined;

export interface OutputSchema {
  labels: (ComAtprotoLabelDefs.Label)[];
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
