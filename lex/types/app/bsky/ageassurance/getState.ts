/**
 * GENERATED CODE - DO NOT MODIFY
 */
import type * as AppBskyAgeassuranceDefs from "./defs.ts";

export type QueryParams = {
  countryCode: string;
  regionCode?: string;
};
export type InputSchema = undefined;

export interface OutputSchema {
  state: AppBskyAgeassuranceDefs.State;
  metadata: AppBskyAgeassuranceDefs.StateMetadata;
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
