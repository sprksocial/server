/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { type HonoRequest } from "hono";
import stream from "node:stream";
import { HandlerAuth } from "@sprk/xrpc-server";

export type QueryParams = Record<never, never>;
export type InputSchema = string | Uint8Array | Blob;
export type OutputSchema = undefined;

export interface HandlerInput {
  encoding: "application/vnd.ipld.car";
  body: stream.Readable;
}

export interface HandlerError {
  status: number;
  message?: string;
}

export type HandlerOutput = HandlerError | void;
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
