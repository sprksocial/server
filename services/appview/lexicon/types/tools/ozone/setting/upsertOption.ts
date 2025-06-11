/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { type HonoRequest } from "hono";
import { HandlerAuth, HandlerPipeThrough } from "@sprk/xrpc-server";
import type * as ToolsOzoneSettingDefs from "./defs.ts";

export type QueryParams = Record<never, never>;

export interface InputSchema {
  key: string;
  scope: "instance" | "personal" | (string & { __brand?: never });
  value: { [_ in string]: unknown };
  description?: string;
  managerRole?:
    | "tools.ozone.team.defs#roleModerator"
    | "tools.ozone.team.defs#roleTriage"
    | "tools.ozone.team.defs#roleAdmin"
    | (string & { __brand?: never });
}

export interface OutputSchema {
  option: ToolsOzoneSettingDefs.Option;
}

export interface HandlerInput {
  encoding: "application/json";
  body: InputSchema;
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
