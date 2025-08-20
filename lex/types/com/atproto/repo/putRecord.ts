/**
 * GENERATED CODE - DO NOT MODIFY
 */
import type * as ComAtprotoRepoDefs from "./defs.ts";

export type QueryParams = globalThis.Record<PropertyKey, never>;

export interface InputSchema {
  /** The handle or DID of the repo (aka, current account). */
  repo: string;
  /** The NSID of the record collection. */
  collection: string;
  /** The Record Key. */
  rkey: string;
  /** Can be set to 'false' to skip Lexicon schema validation of record data, 'true' to require it, or leave unset to validate only for known Lexicons. */
  validate?: boolean;
  /** The record to write. */
  record: { [_ in string]: unknown };
  /** Compare and swap with the previous record by CID. WARNING: nullable and optional field; may cause problems with golang implementation */
  swapRecord?: string | null;
  /** Compare and swap with the previous commit by CID. */
  swapCommit?: string;
}

export interface OutputSchema {
  uri: string;
  cid: string;
  commit?: ComAtprotoRepoDefs.CommitMeta;
  validationStatus?:
    | "valid"
    | "unknown"
    | (string & globalThis.Record<PropertyKey, never>);
}

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
  error?: "InvalidSwap";
}

export type HandlerOutput = HandlerError | HandlerSuccess;
