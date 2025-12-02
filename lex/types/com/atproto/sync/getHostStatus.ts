/**
 * GENERATED CODE - DO NOT MODIFY
 */
import type * as ComAtprotoSyncDefs from "./defs.ts";

export type QueryParams = {
  /** Hostname of the host (eg, PDS or relay) being queried. */
  hostname: string;
};
export type InputSchema = undefined;

export interface OutputSchema {
  hostname: string;
  /** Recent repo stream event sequence number. May be delayed from actual stream processing (eg, persisted cursor not in-memory cursor). */
  seq?: number;
  /** Number of accounts on the server which are associated with the upstream host. Note that the upstream may actually have more accounts. */
  accountCount?: number;
  status?: ComAtprotoSyncDefs.HostStatus;
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
  error?: "HostNotFound";
}

export type HandlerOutput = HandlerError | HandlerSuccess;
