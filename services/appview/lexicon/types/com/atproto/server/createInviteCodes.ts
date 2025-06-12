/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { type HonoRequest } from "hono";
import { validate as _validate } from "../../../../lexicons.ts";
import { is$typed as _is$typed } from "../../../../util.ts";
import { HandlerAuth, HandlerPipeThrough } from "@sprk/xrpc-server";

const is$typed = _is$typed, validate = _validate;
const id = "com.atproto.server.createInviteCodes";

export type QueryParams = Record<never, never>;

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
