/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { type HonoRequest } from "hono";
import { validate as _validate } from "../../../../lexicons.ts";
import { is$typed as _is$typed } from "../../../../util.ts";
import { HandlerAuth, HandlerPipeThrough } from "@sprk/xrpc-server";
import type * as ChatBskyConvoDefs from "./defs.ts";

const is$typed = _is$typed, validate = _validate;
const id = "chat.bsky.convo.sendMessageBatch";

export type QueryParams = Record<never, never>;

export interface InputSchema {
  items: (BatchItem)[];
}

export interface OutputSchema {
  items: (ChatBskyConvoDefs.MessageView)[];
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
}

export type HandlerOutput = HandlerError | HandlerSuccess | HandlerPipeThrough;
export type HandlerReqCtx<HA extends HandlerAuth = never> = {
  auth: HA;
  params: QueryParams;
  input: HandlerInput;
  req: HonoRequest;
  resetRouteRateLimits: () => Promise<void>;
};
export type Handler<HA extends HandlerAuth = never> = (
  ctx: HandlerReqCtx<HA>,
) => Promise<HandlerOutput> | HandlerOutput;

export interface BatchItem {
  $type?: "chat.bsky.convo.sendMessageBatch#batchItem";
  convoId: string;
  message: ChatBskyConvoDefs.MessageInput;
}

const hashBatchItem = "batchItem";

export function isBatchItem<V>(v: V) {
  return is$typed(v, id, hashBatchItem);
}

export function validateBatchItem<V>(v: V) {
  return validate<BatchItem & V>(v, id, hashBatchItem);
}
