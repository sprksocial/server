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
  /** Compare and swap with the previous record by CID. */
  swapRecord?: string;
  /** Compare and swap with the previous commit by CID. */
  swapCommit?: string;
}

export interface OutputSchema {
  commit?: ComAtprotoRepoDefs.CommitMeta;
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
