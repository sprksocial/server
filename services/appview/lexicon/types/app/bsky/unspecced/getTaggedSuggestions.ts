/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { type HonoRequest } from "hono";
import { validate as _validate } from "../../../../lexicons.ts";
import { is$typed as _is$typed } from "../../../../util.ts";
import { HandlerAuth, HandlerPipeThrough } from "@sprk/xrpc-server";

const is$typed = _is$typed, validate = _validate;
const id = "app.bsky.unspecced.getTaggedSuggestions";

export type QueryParams = Record<never, never>;
export type InputSchema = undefined;

export interface OutputSchema {
  suggestions: (Suggestion)[];
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

export interface Suggestion {
  $type?: "app.bsky.unspecced.getTaggedSuggestions#suggestion";
  tag: string;
  subjectType: "actor" | "feed" | (string & { __brand?: never });
  subject: string;
}

const hashSuggestion = "suggestion";

export function isSuggestion<V>(v: V) {
  return is$typed(v, id, hashSuggestion);
}

export function validateSuggestion<V>(v: V) {
  return validate<Suggestion & V>(v, id, hashSuggestion);
}
