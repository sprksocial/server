/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { type HonoRequest } from "hono";
import { validate as _validate } from "../../../../lexicons.ts";
import { is$typed as _is$typed } from "../../../../util.ts";
import { HandlerAuth, HandlerPipeThrough } from "@sprk/xrpc-server";

const is$typed = _is$typed, validate = _validate;
const id = "com.atproto.repo.listMissingBlobs";

export interface QueryParams {
  limit: number;
  cursor?: string;
}

export type InputSchema = undefined;

export interface OutputSchema {
  cursor?: string;
  blobs: (RecordBlob)[];
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

export interface RecordBlob {
  $type?: "com.atproto.repo.listMissingBlobs#recordBlob";
  cid: string;
  recordUri: string;
}

const hashRecordBlob = "recordBlob";

export function isRecordBlob<V>(v: V) {
  return is$typed(v, id, hashRecordBlob);
}

export function validateRecordBlob<V>(v: V) {
  return validate<RecordBlob & V>(v, id, hashRecordBlob);
}
