/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { type $Typed } from "../../../../util.ts";
import type * as ChatBskyConvoDefs from "../convo/defs.ts";

export type QueryParams = {
  /** Conversation that the message is from. NOTE: this field will eventually be required. */
  convoId?: string;
  messageId: string;
  before: number;
  after: number;
};
export type InputSchema = undefined;

export interface OutputSchema {
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
