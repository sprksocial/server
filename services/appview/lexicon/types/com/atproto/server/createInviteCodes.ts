/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { validate as _validate } from "../../../../lexicons.ts";
import { is$typed as _is$typed } from "../../../../util.ts";

const is$typed = _is$typed, validate = _validate;
const id = "com.atproto.server.createInviteCodes";

export type QueryParams = globalThis.Record<PropertyKey, never>;

export interface InputSchema {
  codeCount: number;
  useCount: number;
  forAccounts?: (string)[];
}

export interface OutputSchema {
  codes: (AccountCodes)[];
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

export type HandlerOutput = HandlerError | HandlerSuccess;

export interface AccountCodes {
  $type?: "com.atproto.server.createInviteCodes#accountCodes";
  account: string;
  codes: (string)[];
}

const hashAccountCodes = "accountCodes";

export function isAccountCodes<V>(v: V) {
  return is$typed(v, id, hashAccountCodes);
}

export function validateAccountCodes<V>(v: V) {
  return validate<AccountCodes & V>(v, id, hashAccountCodes);
}
