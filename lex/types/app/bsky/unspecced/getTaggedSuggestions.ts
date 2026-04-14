/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { validate as _validate } from "../../../../lexicons.ts";
import type { ValidationResult } from "@atp/lexicon";
import { is$typed as _is$typed } from "../../../../util.ts";

const is$typed = _is$typed, validate = _validate;
const id = "app.bsky.unspecced.getTaggedSuggestions";

export type QueryParams = globalThis.Record<PropertyKey, never>;
export type InputSchema = undefined;

export interface OutputSchema {
  suggestions: (Suggestion)[];
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

export interface Suggestion {
  $type?: "app.bsky.unspecced.getTaggedSuggestions#suggestion";
  tag: string;
  subjectType:
    | "actor"
    | "feed"
    | (string & globalThis.Record<PropertyKey, never>);
  subject: string;
}

const hashSuggestion = "suggestion";

export function isSuggestion<V>(v: V): v is Suggestion & V {
  return is$typed(v, id, hashSuggestion);
}

export function validateSuggestion<V>(v: V): ValidationResult<Suggestion & V> {
  return validate<Suggestion & V>(v, id, hashSuggestion);
}
