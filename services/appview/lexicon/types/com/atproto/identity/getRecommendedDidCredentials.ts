/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { type HonoRequest } from "hono";
import { HandlerAuth, HandlerPipeThrough } from "@sprk/xrpc-server";

export type QueryParams = Record<never, never>;
export type InputSchema = undefined;

export interface OutputSchema {
  /** Recommended rotation keys for PLC dids. Should be undefined (or ignored) for did:webs. */
  rotationKeys?: (string)[];
  alsoKnownAs?: (string)[];
  verificationMethods?: { [_ in string]: unknown };
  services?: { [_ in string]: unknown };
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
