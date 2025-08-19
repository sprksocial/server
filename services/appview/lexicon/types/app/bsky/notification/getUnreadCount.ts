/**
 * GENERATED CODE - DO NOT MODIFY
 */
export type QueryParams = {
  priority?: boolean;
  seenAt?: string;
};
export type InputSchema = undefined;

export interface OutputSchema {
  count: number;
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
