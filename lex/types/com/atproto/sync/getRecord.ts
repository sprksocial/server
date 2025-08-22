/**
 * GENERATED CODE - DO NOT MODIFY
 */
import stream from "node:stream";

export type QueryParams = {
  /** The DID of the repo. */
  did: string;
  collection: string;
  /** Record Key */
  rkey: string;
  /** DEPRECATED: referenced a repo commit by CID, and retrieved record as of that commit */
  commit?: string;
};
export type InputSchema = undefined;
export type HandlerInput = void;

export interface HandlerSuccess {
  encoding: "application/vnd.ipld.car";
  body: Uint8Array | stream.Readable;
  headers?: { [key: string]: string };
}

export interface HandlerError {
  status: number;
  message?: string;
  error?:
    | "RecordNotFound"
    | "RepoNotFound"
    | "RepoTakendown"
    | "RepoSuspended"
    | "RepoDeactivated";
}

export type HandlerOutput = HandlerError | HandlerSuccess;
