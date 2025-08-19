/**
 * GENERATED CODE - DO NOT MODIFY
 */
export type QueryParams = globalThis.Record<PropertyKey, never>;

export interface InputSchema {
  email: string;
  token: string;
}

export interface HandlerInput {
  encoding: "application/json";
  body: InputSchema;
}

export interface HandlerError {
  status: number;
  message?: string;
  error?: "AccountNotFound" | "ExpiredToken" | "InvalidToken" | "InvalidEmail";
}

export type HandlerOutput = HandlerError | void;
