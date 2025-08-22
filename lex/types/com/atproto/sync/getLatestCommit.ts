/**
 * GENERATED CODE - DO NOT MODIFY
 */
export type QueryParams = {
  /** The DID of the repo. */
  did: string;
};
export type InputSchema = undefined;

export interface OutputSchema {
  cid: string;
  rev: string;
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
  error?:
    | "RepoNotFound"
    | "RepoTakendown"
    | "RepoSuspended"
    | "RepoDeactivated";
}

export type HandlerOutput = HandlerError | HandlerSuccess;
