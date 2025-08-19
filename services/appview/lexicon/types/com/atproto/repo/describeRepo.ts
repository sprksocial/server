/**
 * GENERATED CODE - DO NOT MODIFY
 */
export type QueryParams = {
  /** The handle or DID of the repo. */
  repo: string;
};
export type InputSchema = undefined;

export interface OutputSchema {
  handle: string;
  did: string;
  /** The complete DID document for this account. */
  didDoc: { [_ in string]: unknown };
  /** List of all the collections (NSIDs) for which this repo contains at least one record. */
  collections: (string)[];
  /** Indicates if handle is currently valid (resolves bi-directionally) */
  handleIsCorrect: boolean;
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
}

export type HandlerOutput = HandlerError | HandlerSuccess;
