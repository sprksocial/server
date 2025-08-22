/**
 * GENERATED CODE - DO NOT MODIFY
 */
export type QueryParams = {
  /** The handle or DID of the repo. */
  repo: string;
  /** The NSID of the record collection. */
  collection: string;
  /** The Record Key. */
  rkey: string;
  /** The CID of the version of the record. If not specified, then return the most recent version. */
  cid?: string;
};
export type InputSchema = undefined;

export interface OutputSchema {
  uri: string;
  cid?: string;
  value: { [_ in string]: unknown };
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
  error?: "RecordNotFound";
}

export type HandlerOutput = HandlerError | HandlerSuccess;
