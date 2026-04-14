/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { validate as _validate } from "../../../../lexicons.ts";
import type { ValidationResult } from "@atp/lexicon";
import { is$typed as _is$typed } from "../../../../util.ts";
import type * as ComAtprotoAdminDefs from "../../../com/atproto/admin/defs.ts";
import type * as ToolsOzoneSignatureDefs from "./defs.ts";

const is$typed = _is$typed, validate = _validate;
const id = "tools.ozone.signature.findRelatedAccounts";

export type QueryParams = {
  did: string;
  cursor?: string;
  limit: number;
};
export type InputSchema = undefined;

export interface OutputSchema {
  cursor?: string;
  accounts: (RelatedAccount)[];
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

export interface RelatedAccount {
  $type?: "tools.ozone.signature.findRelatedAccounts#relatedAccount";
  account: ComAtprotoAdminDefs.AccountView;
  similarities?: (ToolsOzoneSignatureDefs.SigDetail)[];
}

const hashRelatedAccount = "relatedAccount";

export function isRelatedAccount<V>(v: V): v is RelatedAccount & V {
  return is$typed(v, id, hashRelatedAccount);
}

export function validateRelatedAccount<V>(
  v: V,
): ValidationResult<RelatedAccount & V> {
  return validate<RelatedAccount & V>(v, id, hashRelatedAccount);
}
