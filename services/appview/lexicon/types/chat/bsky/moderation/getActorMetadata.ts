/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { type HonoRequest } from "hono";
import { validate as _validate } from "../../../../lexicons.ts";
import { is$typed as _is$typed } from "../../../../util.ts";
import { HandlerAuth, HandlerPipeThrough } from "@sprk/xrpc-server";

const is$typed = _is$typed, validate = _validate;
const id = "chat.bsky.moderation.getActorMetadata";

export interface QueryParams {
  actor: string;
}

export type InputSchema = undefined;

export interface OutputSchema {
  day: Metadata;
  month: Metadata;
  all: Metadata;
}

export type HandlerInput = undefined;

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

export interface Metadata {
  $type?: "chat.bsky.moderation.getActorMetadata#metadata";
  messagesSent: number;
  messagesReceived: number;
  convos: number;
  convosStarted: number;
}

const hashMetadata = "metadata";

export function isMetadata<V>(v: V) {
  return is$typed(v, id, hashMetadata);
}

export function validateMetadata<V>(v: V) {
  return validate<Metadata & V>(v, id, hashMetadata);
}
