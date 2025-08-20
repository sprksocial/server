/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { validate as _validate } from "../../../../lexicons.ts";
import { is$typed as _is$typed } from "../../../../util.ts";

const is$typed = _is$typed, validate = _validate;
const id = "tools.ozone.server.getConfig";

export type QueryParams = globalThis.Record<PropertyKey, never>;
export type InputSchema = undefined;

export interface OutputSchema {
  appview?: ServiceConfig;
  pds?: ServiceConfig;
  blobDivert?: ServiceConfig;
  chat?: ServiceConfig;
  viewer?: ViewerConfig;
}

export type HandlerInput = void;

export interface HandlerSuccess {
  encoding: "application/json";
  body: OutputSchema;
  headers?: { [key: string]: string };
}

export interface HandlerError {
  status: number;
  message?: string;
}

export type HandlerOutput = HandlerError | HandlerSuccess;

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
    | (string & globalThis.Record<PropertyKey, never>);
}

const hashViewerConfig = "viewerConfig";

export function isViewerConfig<V>(v: V) {
  return is$typed(v, id, hashViewerConfig);
}

export function validateViewerConfig<V>(v: V) {
  return validate<ViewerConfig & V>(v, id, hashViewerConfig);
}
