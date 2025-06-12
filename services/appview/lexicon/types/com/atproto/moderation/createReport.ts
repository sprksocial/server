/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { type HonoRequest } from "hono";
import { type $Typed } from "../../../../util.ts";
import { HandlerAuth, HandlerPipeThrough } from "@sprk/xrpc-server";
import type * as ComAtprotoModerationDefs from "./defs.ts";
import type * as ComAtprotoAdminDefs from "../admin/defs.ts";
import type * as ComAtprotoRepoStrongRef from "../repo/strongRef.ts";

export type QueryParams = Record<never, never>;

export interface InputSchema {
  reasonType: ComAtprotoModerationDefs.ReasonType;
  /** Additional context about the content and violation. */
  reason?: string;
  subject:
    | $Typed<ComAtprotoAdminDefs.RepoRef>
    | $Typed<ComAtprotoRepoStrongRef.Main>
    | { $type: string };
}

export interface OutputSchema {
  id: number;
  reasonType: ComAtprotoModerationDefs.ReasonType;
  reason?: string;
  subject:
    | $Typed<ComAtprotoAdminDefs.RepoRef>
    | $Typed<ComAtprotoRepoStrongRef.Main>
    | { $type: string };
  reportedBy: string;
  createdAt: string;
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
