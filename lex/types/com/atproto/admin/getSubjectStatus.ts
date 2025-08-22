/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { type $Typed } from "../../../../util.ts";
import type * as ComAtprotoAdminDefs from "./defs.ts";
import type * as ComAtprotoRepoStrongRef from "../repo/strongRef.ts";

export type QueryParams = {
  did?: string;
  uri?: string;
  blob?: string;
};
export type InputSchema = undefined;

export interface OutputSchema {
  subject:
    | $Typed<ComAtprotoAdminDefs.RepoRef>
    | $Typed<ComAtprotoRepoStrongRef.Main>
    | $Typed<ComAtprotoAdminDefs.RepoBlobRef>
    | { $type: string };
  takedown?: ComAtprotoAdminDefs.StatusAttr;
  deactivated?: ComAtprotoAdminDefs.StatusAttr;
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
