/**
 * GENERATED CODE - DO NOT MODIFY
 */
export type QueryParams = {
  /** The DID of the repo. */
  did: string;
  collection: string;
  /** Record Key */
  rkey: string;
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
    | "RecordNotFound"
    | "RepoNotFound"
    | "RepoTakendown"
    | "RepoSuspended"
    | "RepoDeactivated";
}

export type HandlerOutput = HandlerError | HandlerSuccess;
