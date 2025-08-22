/**
 * GENERATED CODE - DO NOT MODIFY
 */
export type QueryParams = globalThis.Record<PropertyKey, never>;

export interface InputSchema {
  /** A token received through com.atproto.identity.requestPlcOperationSignature */
  token?: string;
  rotationKeys?: (string)[];
  alsoKnownAs?: (string)[];
  verificationMethods?: { [_ in string]: unknown };
  services?: { [_ in string]: unknown };
}

export interface OutputSchema {
  /** A signed DID PLC operation. */
  operation: { [_ in string]: unknown };
}

export interface HandlerInput {
  encoding: "application/json";
  body: InputSchema;
}

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
