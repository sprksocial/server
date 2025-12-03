/**
 * GENERATED CODE - DO NOT MODIFY
 */
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
  body: Uint8Array | ReadableStream;
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
