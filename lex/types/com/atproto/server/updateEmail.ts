/**
 * GENERATED CODE - DO NOT MODIFY
 */
export type QueryParams = globalThis.Record<PropertyKey, never>;

export interface InputSchema {
  email: string;
  emailAuthFactor?: boolean;
  /** Requires a token from com.atproto.sever.requestEmailUpdate if the account's email has been confirmed. */
  token?: string;
}

export interface HandlerInput {
  encoding: "application/json";
  body: InputSchema;
}

export interface HandlerError {
  status: number;
  message?: string;
  error?: "ExpiredToken" | "InvalidToken" | "TokenRequired";
}

export type HandlerOutput = HandlerError | void;
