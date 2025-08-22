/**
 * GENERATED CODE - DO NOT MODIFY
 */
export type QueryParams = globalThis.Record<PropertyKey, never>;
export type InputSchema = undefined;

export interface OutputSchema {
  /** Recommended rotation keys for PLC dids. Should be undefined (or ignored) for did:webs. */
  rotationKeys?: (string)[];
  alsoKnownAs?: (string)[];
  verificationMethods?: { [_ in string]: unknown };
  services?: { [_ in string]: unknown };
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
