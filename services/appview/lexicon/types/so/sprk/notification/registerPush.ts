/**
 * GENERATED CODE - DO NOT MODIFY
 */
export type QueryParams = globalThis.Record<PropertyKey, never>;

export interface InputSchema {
  serviceDid: string;
  token: string;
  platform:
    | "ios"
    | "android"
    | "web"
    | (string & globalThis.Record<PropertyKey, never>);
  appId: string;
}

export interface HandlerInput {
  encoding: "application/json";
  body: InputSchema;
}

export interface HandlerError {
  status: number;
  message?: string;
}

export type HandlerOutput = HandlerError | void;
