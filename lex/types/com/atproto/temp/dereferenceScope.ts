/**
 * GENERATED CODE - DO NOT MODIFY
 */
export type QueryParams = {
  /** The scope reference (starts with 'ref:') */
  scope: string;
};
export type InputSchema = undefined;

export interface OutputSchema {
  /** The full oauth permission scope */
  scope: string;
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
  error?: "InvalidScopeReference";
}

export type HandlerOutput = HandlerError | HandlerSuccess;
