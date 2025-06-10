/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { type HonoRequest } from "hono";
import { validate as _validate } from "../../../../lexicons.ts";
import { is$typed as _is$typed } from "../../../../util.ts";
import { HandlerAuth, HandlerPipeThrough } from "@sprk/xrpc-server";
import type * as AppBskyActorDefs from "../actor/defs.ts";

const is$typed = _is$typed, validate = _validate;
const id = "app.bsky.feed.getLikes";

export interface QueryParams {
  /** AT-URI of the subject (eg, a post record). */
  uri: string;
  /** CID of the subject record (aka, specific version of record), to filter likes. */
  cid?: string;
  limit: number;
  cursor?: string;
}

export type InputSchema = undefined;

export interface OutputSchema {
  uri: string;
  cid?: string;
  cursor?: string;
  likes: (Like)[];
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

export interface Like {
  $type?: "app.bsky.feed.getLikes#like";
  indexedAt: string;
  createdAt: string;
  actor: AppBskyActorDefs.ProfileView;
}

const hashLike = "like";

export function isLike<V>(v: V) {
  return is$typed(v, id, hashLike);
}

export function validateLike<V>(v: V) {
  return validate<Like & V>(v, id, hashLike);
}
