/**
 * GENERATED CODE - DO NOT MODIFY
 */
import type * as ChatBskyConvoDefs from "./defs.ts";

export type QueryParams = globalThis.Record<PropertyKey, never>;

export interface InputSchema {
  convoId: string;
  messageId: string;
}

export type OutputSchema = ChatBskyConvoDefs.DeletedMessageView;

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
}

export type HandlerOutput = HandlerError | HandlerSuccess;
