/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { type HonoRequest } from "hono";
import { type $Typed } from "../../../../util.ts";
import { HandlerAuth, HandlerPipeThrough } from "@sprk/xrpc-server";
import type * as SoSprkFeedDefs from "./defs.ts";

export interface QueryParams {
  /** Reference (AT-URI) to post record. */
  uri: string;
  /** How many levels of reply depth should be included in response. */
  depth: number;
  /** How many levels of parent (and grandparent, etc) post to include. */
  parentHeight: number;
}

export type InputSchema = undefined;

export interface OutputSchema {
  thread:
    | $Typed<SoSprkFeedDefs.ThreadViewPost>
    | $Typed<SoSprkFeedDefs.NotFoundPost>
    | $Typed<SoSprkFeedDefs.BlockedPost>
    | { $type: string };
  threadgate?: SoSprkFeedDefs.ThreadgateView;
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
  error?: "NotFound";
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
