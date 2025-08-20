/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { validate as _validate } from "../../../../lexicons.ts";
import { is$typed as _is$typed } from "../../../../util.ts";
import type * as SoSprkActorDefs from "../actor/defs.ts";

const is$typed = _is$typed, validate = _validate;
const id = "so.sprk.feed.getLooks";

export type QueryParams = {
  /** AT-URI of the subject (eg, a post record). */
  uri: string;
  /** CID of the subject record (aka, specific version of record), to filter looks. */
  cid?: string;
  limit: number;
  cursor?: string;
};
export type InputSchema = undefined;

export interface OutputSchema {
  uri: string;
  cid?: string;
  cursor?: string;
  looks: (Look)[];
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

export interface Look {
  $type?: "so.sprk.feed.getLooks#look";
  indexedAt: string;
  createdAt: string;
  actor: SoSprkActorDefs.ProfileView;
}

const hashLook = "look";

export function isLook<V>(v: V) {
  return is$typed(v, id, hashLook);
}

export function validateLook<V>(v: V) {
  return validate<Look & V>(v, id, hashLook);
}
