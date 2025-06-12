/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { type HonoRequest } from "hono";
import { HandlerAuth, HandlerPipeThrough } from "@sprk/xrpc-server";
import type * as SoSprkUnspeccedDefs from "./defs.ts";

export interface QueryParams {
  /** DID of the account making the request (not included for public/unauthenticated queries). Used to boost followed accounts in ranking. */
  viewer?: string;
  limit: number;
  cursor?: string;
  /** DID of the account to get suggestions relative to. If not provided, suggestions will be based on the viewer. */
  relativeToDid?: string;
}

export type InputSchema = undefined;

export interface OutputSchema {
  cursor?: string;
  actors: (SoSprkUnspeccedDefs.SkeletonSearchActor)[];
  /** DID of the account these suggestions are relative to. If this is returned undefined, suggestions are based on the viewer. */
  relativeToDid?: string;
  /** Snowflake for this recommendation, use when submitting recommendation events. */
  recId?: number;
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
