/**
 * GENERATED CODE - DO NOT MODIFY
 */
import type { $Typed } from "../../../../util.ts";
import type * as SoSprkLabelerDefs from "./defs.ts";

export type QueryParams = {
  dids: string[];
  detailed: boolean;
};
export type InputSchema = undefined;

export interface OutputSchema {
  views: (
    | $Typed<SoSprkLabelerDefs.LabelerView>
    | $Typed<SoSprkLabelerDefs.LabelerViewDetailed>
    | { $type: string }
  )[];
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
