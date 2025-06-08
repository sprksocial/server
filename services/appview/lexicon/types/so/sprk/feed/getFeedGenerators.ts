/**
 * GENERATED CODE - DO NOT MODIFY
 */
import express from "express";
import { BlobRef, type ValidationResult } from "@atproto/lexicon";
import { CID } from "multiformats/cid";
import { validate as _validate } from "../../../../lexicons";
import {
  type $Typed,
  is$typed as _is$typed,
  type OmitKey,
} from "../../../../util";
import { HandlerAuth, HandlerPipeThrough } from "@sprk/xrpc-server";
import type * as SoSprkFeedDefs from "./defs.js";

const is$typed = _is$typed, validate = _validate;
const id = "so.sprk.feed.getFeedGenerators";

export interface QueryParams {
  feeds: string[];
}

export type InputSchema = undefined;

export interface OutputSchema {
  feeds: (SoSprkFeedDefs.GeneratorView)[];
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
  req: express.Request;
  res: express.Response;
  resetRouteRateLimits: () => Promise<void>;
};
export type Handler<HA extends HandlerAuth = never> = (
  ctx: HandlerReqCtx<HA>,
) => Promise<HandlerOutput> | HandlerOutput;
