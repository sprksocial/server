/**
 * GENERATED CODE - DO NOT MODIFY
 */
import type * as AppBskyBookmarkDefs from "./defs.ts";

export type QueryParams = {
  limit: number;
  cursor?: string;
};
export type InputSchema = undefined;

export interface OutputSchema {
  cursor?: string;
  bookmarks: (AppBskyBookmarkDefs.BookmarkView)[];
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
