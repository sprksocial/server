/**
 * GENERATED CODE - DO NOT MODIFY
 */
export type QueryParams = {
  /** DID of the account making the request (not included for public/unauthenticated queries). */
  viewer?: string;
  /** Category of users to get suggestions for. */
  category?: string;
  limit: number;
};
export type InputSchema = undefined;

export interface OutputSchema {
  dids: (string)[];
  /** Snowflake for this recommendation, use when submitting recommendation events. */
  recIdStr?: string;
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
