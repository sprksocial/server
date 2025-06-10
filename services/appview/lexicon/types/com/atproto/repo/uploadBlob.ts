/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { type HonoRequest } from "hono";
import stream from "node:stream";
import { BlobRef } from "@atproto/lexicon";
import { HandlerAuth, HandlerPipeThrough } from "@sprk/xrpc-server";

export type QueryParams = Record<never, never>;
export type InputSchema = string | Uint8Array | Blob;

export interface OutputSchema {
  blob: BlobRef;
}

export interface HandlerInput {
  encoding: "*/*";
  body: stream.Readable;
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
