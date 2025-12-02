/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { type $Typed } from "../../../../util.ts";
import type * as ChatBskyConvoDefs from "./defs.ts";

export type QueryParams = {
  cursor?: string;
};
export type InputSchema = undefined;

export interface OutputSchema {
  cursor?: string;
  logs: (
    | $Typed<ChatBskyConvoDefs.LogBeginConvo>
    | $Typed<ChatBskyConvoDefs.LogAcceptConvo>
    | $Typed<ChatBskyConvoDefs.LogLeaveConvo>
    | $Typed<ChatBskyConvoDefs.LogMuteConvo>
    | $Typed<ChatBskyConvoDefs.LogUnmuteConvo>
    | $Typed<ChatBskyConvoDefs.LogCreateMessage>
    | $Typed<ChatBskyConvoDefs.LogDeleteMessage>
    | $Typed<ChatBskyConvoDefs.LogReadMessage>
    | $Typed<ChatBskyConvoDefs.LogAddReaction>
    | $Typed<ChatBskyConvoDefs.LogRemoveReaction>
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
