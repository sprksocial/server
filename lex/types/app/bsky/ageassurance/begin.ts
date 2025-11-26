/**
 * GENERATED CODE - DO NOT MODIFY
 */
import type * as AppBskyAgeassuranceDefs from "./defs.ts";

export type QueryParams = globalThis.Record<PropertyKey, never>;

export interface InputSchema {
  /** The user's email address to receive Age Assurance instructions. */
  email: string;
  /** The user's preferred language for communication during the Age Assurance process. */
  language: string;
  /** An ISO 3166-1 alpha-2 code of the user's location. */
  countryCode: string;
  /** An optional ISO 3166-2 code of the user's region or state within the country. */
  regionCode?: string;
}

export type OutputSchema = AppBskyAgeassuranceDefs.State;

export interface HandlerInput {
  encoding: "application/json";
  body: InputSchema;
}

export interface HandlerSuccess {
  encoding: "application/json";
  body: OutputSchema;
  headers?: { [key: string]: string };
}

export interface HandlerError {
  status: number;
  message?: string;
  error?:
    | "InvalidEmail"
    | "DidTooLong"
    | "InvalidInitiation"
    | "RegionNotSupported";
}

export type HandlerOutput = HandlerError | HandlerSuccess;
