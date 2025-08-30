/**
 * GENERATED CODE - DO NOT MODIFY
 */
import type * as SoSprkSoundDefs from "./defs.ts";

export type QueryParams = {
  limit: number;
  /** Opaque cursor for pagination */
  cursor?: string;
};
export type InputSchema = undefined;

export interface OutputSchema {
  cursor?: string;
  audios: (SoSprkSoundDefs.AudioView)[];
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
