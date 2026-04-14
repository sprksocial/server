/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { validate as _validate } from "../../../../lexicons.ts";
import type { ValidationResult } from "@atp/lexicon";
import { is$typed as _is$typed } from "../../../../util.ts";
import type * as ChatBskyConvoDefs from "./defs.ts";

const is$typed = _is$typed, validate = _validate;
const id = "chat.bsky.convo.sendMessageBatch";

export type QueryParams = globalThis.Record<PropertyKey, never>;

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

export type HandlerOutput = HandlerError | HandlerSuccess;

export interface BatchItem {
  $type?: "chat.bsky.convo.sendMessageBatch#batchItem";
  convoId: string;
  message: ChatBskyConvoDefs.MessageInput;
}

const hashBatchItem = "batchItem";

export function isBatchItem<V>(v: V): v is BatchItem & V {
  return is$typed(v, id, hashBatchItem);
}

export function validateBatchItem<V>(v: V): ValidationResult<BatchItem & V> {
  return validate<BatchItem & V>(v, id, hashBatchItem);
}
