/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { validate as _validate } from "../../../../lexicons.ts";
import type { ValidationResult } from "@atp/lexicon";
import { is$typed as _is$typed } from "../../../../util.ts";
import type * as AppBskyGraphDefs from "./defs.ts";

const is$typed = _is$typed, validate = _validate;
const id = "app.bsky.graph.getStarterPacksWithMembership";

export type QueryParams = {
  /** The account (actor) to check for membership. */
  actor: string;
  limit: number;
  cursor?: string;
};
export type InputSchema = undefined;

export interface OutputSchema {
  cursor?: string;
  starterPacksWithMembership: (StarterPackWithMembership)[];
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

/** A starter pack and an optional list item indicating membership of a target user to that starter pack. */
export interface StarterPackWithMembership {
  $type?:
    "app.bsky.graph.getStarterPacksWithMembership#starterPackWithMembership";
  starterPack: AppBskyGraphDefs.StarterPackView;
  listItem?: AppBskyGraphDefs.ListItemView;
}

const hashStarterPackWithMembership = "starterPackWithMembership";

export function isStarterPackWithMembership<V>(
  v: V,
): v is StarterPackWithMembership & V {
  return is$typed(v, id, hashStarterPackWithMembership);
}

export function validateStarterPackWithMembership<V>(
  v: V,
): ValidationResult<StarterPackWithMembership & V> {
  return validate<StarterPackWithMembership & V>(
    v,
    id,
    hashStarterPackWithMembership,
  );
}
