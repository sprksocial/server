/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { type HonoRequest } from "hono";
import { validate as _validate } from "../../../../lexicons.ts";
import { is$typed as _is$typed } from "../../../../util.ts";
import { HandlerAuth, HandlerPipeThrough } from "@sprk/xrpc-server";

const is$typed = _is$typed, validate = _validate;
const id = "so.sprk.feed.describeFeedGenerator";

export type QueryParams = Record<never, never>;
export type InputSchema = undefined;

export interface OutputSchema {
  did: string;
  feeds: (Feed)[];
  links?: Links;
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

export interface Feed {
  $type?: "so.sprk.feed.describeFeedGenerator#feed";
  uri: string;
}

const hashFeed = "feed";

export function isFeed<V>(v: V) {
  return is$typed(v, id, hashFeed);
}

export function validateFeed<V>(v: V) {
  return validate<Feed & V>(v, id, hashFeed);
}

export interface Links {
  $type?: "so.sprk.feed.describeFeedGenerator#links";
  privacyPolicy?: string;
  termsOfService?: string;
}

const hashLinks = "links";

export function isLinks<V>(v: V) {
  return is$typed(v, id, hashLinks);
}

export function validateLinks<V>(v: V) {
  return validate<Links & V>(v, id, hashLinks);
}
