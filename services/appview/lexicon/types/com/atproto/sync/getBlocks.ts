/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { type HonoRequest } from "hono";
import stream from "node:stream";
import { HandlerAuth, HandlerPipeThrough } from "@sprk/xrpc-server";

export interface QueryParams {
  /** The DID of the repo. */
  did: string;
  cids: string[];
}

export type InputSchema = undefined;
export type OutputSchema = undefined;
export type HandlerInput = undefined;

export interface HandlerSuccess {
  encoding: "application/vnd.ipld.car";
  body: Uint8Array | stream.Readable;
  headers?: { [key: string]: string };
}

export interface HandlerError {
  status: number;
  message?: string;
  error?:
    | "BlockNotFound"
    | "RepoNotFound"
    | "RepoTakendown"
    | "RepoSuspended"
    | "RepoDeactivated";
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
