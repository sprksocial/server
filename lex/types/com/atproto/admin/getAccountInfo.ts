/**
 * GENERATED CODE - DO NOT MODIFY
 */
import type * as ComAtprotoAdminDefs from "./defs.ts";

export type QueryParams = {
  did: string;
};
export type InputSchema = undefined;
export type OutputSchema = ComAtprotoAdminDefs.AccountView;
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
