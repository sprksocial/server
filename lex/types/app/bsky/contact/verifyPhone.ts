/**
 * GENERATED CODE - DO NOT MODIFY
 */
export type QueryParams = globalThis.Record<PropertyKey, never>;

export interface InputSchema {
  /** The phone number to verify. Should be the same as the one passed to `app.bsky.contact.startPhoneVerification`. */
  phone: string;
  /** The code received via SMS as a result of the call to `app.bsky.contact.startPhoneVerification`. */
  code: string;
}

export interface OutputSchema {
  /** JWT to be used in a call to `app.bsky.contact.importContacts`. It is only valid for a single call. */
  token: string;
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
    | "RateLimitExceeded"
    | "InvalidDid"
    | "InvalidPhone"
    | "InvalidCode"
    | "InternalError";
}

export type HandlerOutput = HandlerError | HandlerSuccess;
