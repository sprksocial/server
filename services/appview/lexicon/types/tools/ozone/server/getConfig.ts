/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { type HonoRequest } from "hono";
import { validate as _validate } from "../../../../lexicons.ts";
import { is$typed as _is$typed } from "../../../../util.ts";
import { HandlerAuth, HandlerPipeThrough } from "@sprk/xrpc-server";

const is$typed = _is$typed, validate = _validate;
const id = "tools.ozone.server.getConfig";

export type QueryParams = Record<never, never>;
export type InputSchema = undefined;

export interface OutputSchema {
  appview?: ServiceConfig;
  pds?: ServiceConfig;
  blobDivert?: ServiceConfig;
  chat?: ServiceConfig;
  viewer?: ViewerConfig;
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

export interface ServiceConfig {
  $type?: "tools.ozone.server.getConfig#serviceConfig";
  url?: string;
}

const hashServiceConfig = "serviceConfig";

export function isServiceConfig<V>(v: V) {
  return is$typed(v, id, hashServiceConfig);
}

export function validateServiceConfig<V>(v: V) {
  return validate<ServiceConfig & V>(v, id, hashServiceConfig);
}

export interface ViewerConfig {
  $type?: "tools.ozone.server.getConfig#viewerConfig";
  role?:
    | "tools.ozone.team.defs#roleAdmin"
    | "tools.ozone.team.defs#roleModerator"
    | "tools.ozone.team.defs#roleTriage"
    | (string & Record<PropertyKey, never>);
}

const hashViewerConfig = "viewerConfig";

export function isViewerConfig<V>(v: V) {
  return is$typed(v, id, hashViewerConfig);
}

export function validateViewerConfig<V>(v: V) {
  return validate<ViewerConfig & V>(v, id, hashViewerConfig);
}
