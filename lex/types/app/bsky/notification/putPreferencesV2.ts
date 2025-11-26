/**
 * GENERATED CODE - DO NOT MODIFY
 */
import type * as AppBskyNotificationDefs from "./defs.ts";

export type QueryParams = globalThis.Record<PropertyKey, never>;

export interface InputSchema {
  chat?: AppBskyNotificationDefs.ChatPreference;
  follow?: AppBskyNotificationDefs.FilterablePreference;
  like?: AppBskyNotificationDefs.FilterablePreference;
  likeViaRepost?: AppBskyNotificationDefs.FilterablePreference;
  mention?: AppBskyNotificationDefs.FilterablePreference;
  quote?: AppBskyNotificationDefs.FilterablePreference;
  reply?: AppBskyNotificationDefs.FilterablePreference;
  repost?: AppBskyNotificationDefs.FilterablePreference;
  repostViaRepost?: AppBskyNotificationDefs.FilterablePreference;
  starterpackJoined?: AppBskyNotificationDefs.Preference;
  subscribedPost?: AppBskyNotificationDefs.Preference;
  unverified?: AppBskyNotificationDefs.Preference;
  verified?: AppBskyNotificationDefs.Preference;
}

export interface OutputSchema {
  preferences: AppBskyNotificationDefs.Preferences;
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
