/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { validate as _validate } from "../../../../lexicons.ts";
import type { ValidationResult } from "@atp/lexicon";
import { is$typed as _is$typed } from "../../../../util.ts";
import type * as SoSprkActorDefs from "../actor/defs.ts";
import type * as ComAtprotoLabelDefs from "../../../com/atproto/label/defs.ts";

const is$typed = _is$typed, validate = _validate;
const id = "so.sprk.notification.listNotifications";

export type QueryParams = {
  /** Notification reasons to include in response. */
  reasons?: string[];
  limit: number;
  priority?: boolean;
  cursor?: string;
  seenAt?: string;
};
export type InputSchema = undefined;

export interface OutputSchema {
  cursor?: string;
  notifications: (Notification)[];
  priority?: boolean;
  seenAt?: string;
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
    | "like-via-repost"
    | "repost-via-repost"
    | (string & globalThis.Record<PropertyKey, never>);
  reasonSubject?: string;
  record: { [_ in string]: unknown };
  isRead: boolean;
  indexedAt: string;
  labels?: (ComAtprotoLabelDefs.Label)[];
}

const hashNotification = "notification";

export function isNotification<V>(v: V): v is Notification & V {
  return is$typed(v, id, hashNotification);
}

export function validateNotification<V>(
  v: V,
): ValidationResult<Notification & V> {
  return validate<Notification & V>(v, id, hashNotification);
}
