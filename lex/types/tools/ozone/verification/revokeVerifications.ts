/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { validate as _validate } from "../../../../lexicons.ts";
import { is$typed as _is$typed } from "../../../../util.ts";

const is$typed = _is$typed, validate = _validate;
const id = "tools.ozone.verification.revokeVerifications";

export type QueryParams = globalThis.Record<PropertyKey, never>;

export interface InputSchema {
  /** Array of verification record uris to revoke */
  uris: (string)[];
  /** Reason for revoking the verification. This is optional and can be omitted if not needed. */
  revokeReason?: string;
}

export interface OutputSchema {
  /** List of verification uris successfully revoked */
  revokedVerifications: (string)[];
  /** List of verification uris that couldn't be revoked, including failure reasons */
  failedRevocations: (RevokeError)[];
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

/** Error object for failed revocations */
export interface RevokeError {
  $type?: "tools.ozone.verification.revokeVerifications#revokeError";
  /** The AT-URI of the verification record that failed to revoke. */
  uri: string;
  /** Description of the error that occurred during revocation. */
  error: string;
}

const hashRevokeError = "revokeError";

export function isRevokeError<V>(v: V) {
  return is$typed(v, id, hashRevokeError);
}

export function validateRevokeError<V>(v: V) {
  return validate<RevokeError & V>(v, id, hashRevokeError);
}
