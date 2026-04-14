/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { validate as _validate } from "../../../../lexicons.ts";
import type { ValidationResult } from "@atp/lexicon";
import { is$typed as _is$typed } from "../../../../util.ts";

const is$typed = _is$typed, validate = _validate;
const id = "com.atproto.server.describeServer";

export type QueryParams = globalThis.Record<PropertyKey, never>;
export type InputSchema = undefined;

export interface OutputSchema {
  /** If true, an invite code must be supplied to create an account on this instance. */
  inviteCodeRequired?: boolean;
  /** If true, a phone verification token must be supplied to create an account on this instance. */
  phoneVerificationRequired?: boolean;
  /** List of domain suffixes that can be used in account handles. */
  availableUserDomains: (string)[];
  links?: Links;
  contact?: Contact;
  did: string;
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

export interface Links {
  $type?: "com.atproto.server.describeServer#links";
  privacyPolicy?: string;
  termsOfService?: string;
}

const hashLinks = "links";

export function isLinks<V>(v: V): v is Links & V {
  return is$typed(v, id, hashLinks);
}

export function validateLinks<V>(v: V): ValidationResult<Links & V> {
  return validate<Links & V>(v, id, hashLinks);
}

export interface Contact {
  $type?: "com.atproto.server.describeServer#contact";
  email?: string;
}

const hashContact = "contact";

export function isContact<V>(v: V): v is Contact & V {
  return is$typed(v, id, hashContact);
}

export function validateContact<V>(v: V): ValidationResult<Contact & V> {
  return validate<Contact & V>(v, id, hashContact);
}
