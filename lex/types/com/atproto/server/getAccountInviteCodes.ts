/**
 * GENERATED CODE - DO NOT MODIFY
 */
import type * as ComAtprotoServerDefs from "./defs.ts";

export type QueryParams = {
  includeUsed: boolean;
  /** Controls whether any new 'earned' but not 'created' invites should be created. */
  createAvailable: boolean;
};
export type InputSchema = undefined;

export interface OutputSchema {
  codes: (ComAtprotoServerDefs.InviteCode)[];
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
  error?: "DuplicateCreate";
}

export type HandlerOutput = HandlerError | HandlerSuccess;
