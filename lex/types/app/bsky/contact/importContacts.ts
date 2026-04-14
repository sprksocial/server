/**
 * GENERATED CODE - DO NOT MODIFY
 */
import type * as AppBskyContactDefs from "./defs.ts";

export type QueryParams = globalThis.Record<PropertyKey, never>;

export interface InputSchema {
  /** JWT to authenticate the call. Use the JWT received as a response to the call to `app.bsky.contact.verifyPhone`. */
  token: string;
  /** List of phone numbers in global E.164 format (e.g., '+12125550123'). Phone numbers that cannot be normalized into a valid phone number will be discarded. Should not repeat the 'phone' input used in `app.bsky.contact.verifyPhone`. */
  contacts: (string)[];
}

export interface OutputSchema {
  /** The users that matched during import and their indexes on the input contacts, so the client can correlate with its local list. */
  matchesAndContactIndexes: (AppBskyContactDefs.MatchAndContactIndex)[];
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
  error?:
    | "InvalidDid"
    | "InvalidContacts"
    | "TooManyContacts"
    | "InvalidToken"
    | "InternalError";
}

export type HandlerOutput = HandlerError | HandlerSuccess;
