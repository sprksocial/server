/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { validate as _validate } from "../../../../lexicons.ts";
import type { ValidationResult } from "@atp/lexicon";
import { is$typed as _is$typed } from "../../../../util.ts";

const is$typed = _is$typed, validate = _validate;
const id = "app.bsky.unspecced.getConfig";

export type QueryParams = globalThis.Record<PropertyKey, never>;
export type InputSchema = undefined;

export interface OutputSchema {
  checkEmailConfirmed?: boolean;
  liveNow?: (LiveNowConfig)[];
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

export interface LiveNowConfig {
  $type?: "app.bsky.unspecced.getConfig#liveNowConfig";
  did: string;
  domains: (string)[];
}

const hashLiveNowConfig = "liveNowConfig";

export function isLiveNowConfig<V>(v: V): v is LiveNowConfig & V {
  return is$typed(v, id, hashLiveNowConfig);
}

export function validateLiveNowConfig<V>(
  v: V,
): ValidationResult<LiveNowConfig & V> {
  return validate<LiveNowConfig & V>(v, id, hashLiveNowConfig);
}
