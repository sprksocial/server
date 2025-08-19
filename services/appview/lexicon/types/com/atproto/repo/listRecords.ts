/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { validate as _validate } from "../../../../lexicons.ts";
import { is$typed as _is$typed } from "../../../../util.ts";

const is$typed = _is$typed, validate = _validate;
const id = "com.atproto.repo.listRecords";

export type QueryParams = {
  /** The handle or DID of the repo. */
  repo: string;
  /** The NSID of the record type. */
  collection: string;
  /** The number of records to return. */
  limit: number;
  cursor?: string;
  /** DEPRECATED: The lowest sort-ordered rkey to start from (exclusive) */
  rkeyStart?: string;
  /** DEPRECATED: The highest sort-ordered rkey to stop at (exclusive) */
  rkeyEnd?: string;
  /** Flag to reverse the order of the returned records. */
  reverse?: boolean;
};
export type InputSchema = undefined;

export interface OutputSchema {
  cursor?: string;
  records: (Record)[];
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

export interface Record {
  $type?: "com.atproto.repo.listRecords#record";
  uri: string;
  cid: string;
  value: { [_ in string]: unknown };
}

const hashRecord = "record";

export function isRecord<V>(v: V) {
  return is$typed(v, id, hashRecord);
}

export function validateRecord<V>(v: V) {
  return validate<Record & V>(v, id, hashRecord);
}
