/**
 * GENERATED CODE - DO NOT MODIFY
 */
export type QueryParams = globalThis.Record<PropertyKey, never>;

export interface InputSchema {
  /** Name of the set to delete values from */
  name: string;
  /** Array of string values to delete from the set */
  values: (string)[];
}

export interface HandlerInput {
  encoding: "application/json";
  body: InputSchema;
}

export interface HandlerError {
  status: number;
  message?: string;
  error?: "SetNotFound";
}

export type HandlerOutput = HandlerError | void;
