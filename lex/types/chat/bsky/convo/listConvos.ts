/**
 * GENERATED CODE - DO NOT MODIFY
 */
import type * as ChatBskyConvoDefs from "./defs.ts";

export type QueryParams = {
  limit: number;
  cursor?: string;
  readState?: "unread" | (string & globalThis.Record<PropertyKey, never>);
  status?:
    | "request"
    | "accepted"
    | (string & globalThis.Record<PropertyKey, never>);
};
export type InputSchema = undefined;

export interface OutputSchema {
  cursor?: string;
  convos: (ChatBskyConvoDefs.ConvoView)[];
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
