/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { type $Typed } from "../../../../util.ts";
import type * as AppBskyGraphDefs from "./defs.ts";

export type QueryParams = {
  /** Primary account requesting relationships for. */
  actor: string;
  /** List of 'other' accounts to be related back to the primary. */
  others?: string[];
};
export type InputSchema = undefined;

export interface OutputSchema {
  actor?: string;
  relationships: (
    | $Typed<AppBskyGraphDefs.Relationship>
    | $Typed<AppBskyGraphDefs.NotFoundActor>
    | { $type: string }
  )[];
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
  error?: "ActorNotFound";
}

export type HandlerOutput = HandlerError | HandlerSuccess;
