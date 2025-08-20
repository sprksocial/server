/**
 * GENERATED CODE - DO NOT MODIFY
 */
import type * as ChatBskyConvoDefs from "./defs.ts";

export type QueryParams = {
  convoId: string;
};
export type InputSchema = undefined;

export interface OutputSchema {
  convo: ChatBskyConvoDefs.ConvoView;
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
