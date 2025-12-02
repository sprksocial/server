/**
 * GENERATED CODE - DO NOT MODIFY
 */
import type * as AppBskyNotificationDefs from "./defs.ts";

export type QueryParams = globalThis.Record<PropertyKey, never>;

export interface InputSchema {
  subject: string;
  activitySubscription: AppBskyNotificationDefs.ActivitySubscription;
}

export interface OutputSchema {
  subject: string;
  activitySubscription?: AppBskyNotificationDefs.ActivitySubscription;
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
