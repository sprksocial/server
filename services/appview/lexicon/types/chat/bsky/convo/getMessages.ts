/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { type $Typed } from "../../../../util.ts";
import type * as ChatBskyConvoDefs from "./defs.ts";

export type QueryParams = {
  convoId: string;
  limit: number;
  cursor?: string;
};
export type InputSchema = undefined;

export interface OutputSchema {
  cursor?: string;
  messages:
    (
      | $Typed<ChatBskyConvoDefs.MessageView>
      | $Typed<ChatBskyConvoDefs.DeletedMessageView>
      | { $type: string }
    )[];
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
