/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { type HonoRequest } from "hono";
import { validate as _validate } from "../../../../lexicons.ts";
import { is$typed as _is$typed } from "../../../../util.ts";
import { HandlerAuth, HandlerPipeThrough } from "@sprk/xrpc-server";
import type * as SoSprkActorDefs from "../actor/defs.ts";
import type * as ComAtprotoLabelDefs from "../../../com/atproto/label/defs.ts";

const is$typed = _is$typed, validate = _validate;
const id = "so.sprk.notification.listNotifications";

export interface QueryParams {
  /** Notification reasons to include in response. */
  reasons?: string[];
  limit: number;
  priority?: boolean;
  cursor?: string;
  seenAt?: string;
}

export type InputSchema = undefined;

export interface OutputSchema {
  cursor?: string;
  notifications: (Notification)[];
  priority?: boolean;
  seenAt?: string;
}

export type HandlerInput = undefined;

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

export interface Notification {
  $type?: "so.sprk.notification.listNotifications#notification";
  uri: string;
  cid: string;
  author: SoSprkActorDefs.ProfileView;
  /** Expected values are 'like', 'repost', 'follow', 'mention', 'reply', 'quote', and 'starterpack-joined'. */
  reason:
    | "like"
    | "repost"
    | "follow"
    | "mention"
    | "reply"
    | "quote"
    | "starterpack-joined"
    | (string & Record<PropertyKey, never>);
  reasonSubject?: string;
  record: { [_ in string]: unknown };
  isRead: boolean;
  indexedAt: string;
  labels?: (ComAtprotoLabelDefs.Label)[];
}

const hashNotification = "notification";

export function isNotification<V>(v: V) {
  return is$typed(v, id, hashNotification);
}

export function validateNotification<V>(v: V) {
  return validate<Notification & V>(v, id, hashNotification);
}
