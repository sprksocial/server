/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { type HonoRequest } from "hono";
import { HandlerAuth, HandlerPipeThrough } from "@sprk/xrpc-server";
import type * as AppBskyFeedDefs from "./defs.ts";

export interface QueryParams {
  /** AT-URI of the feed generator record. */
  feed: string;
}

export type InputSchema = undefined;

export interface OutputSchema {
  view: AppBskyFeedDefs.GeneratorView;
  /** Indicates whether the feed generator service has been online recently, or else seems to be inactive. */
  isOnline: boolean;
  /** Indicates whether the feed generator service is compatible with the record declaration. */
  isValid: boolean;
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
