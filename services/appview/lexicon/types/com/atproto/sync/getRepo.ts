/**
 * GENERATED CODE - DO NOT MODIFY
 */
import stream from "node:stream";

export type QueryParams = {
  /** The DID of the repo. */
  did: string;
  /** The revision ('rev') of the repo to create a diff from. */
  since?: string;
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
    | "RepoNotFound"
    | "RepoTakendown"
    | "RepoSuspended"
    | "RepoDeactivated";
}

export type HandlerOutput = HandlerError | HandlerSuccess;
