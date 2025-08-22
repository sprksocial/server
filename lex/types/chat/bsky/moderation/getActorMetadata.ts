/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { validate as _validate } from "../../../../lexicons.ts";
import { is$typed as _is$typed } from "../../../../util.ts";

const is$typed = _is$typed, validate = _validate;
const id = "chat.bsky.moderation.getActorMetadata";

export type QueryParams = {
  actor: string;
};
export type InputSchema = undefined;

export interface OutputSchema {
  day: Metadata;
  month: Metadata;
  all: Metadata;
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

export interface Metadata {
  $type?: "chat.bsky.moderation.getActorMetadata#metadata";
  messagesSent: number;
  messagesReceived: number;
  convos: number;
  convosStarted: number;
}

const hashMetadata = "metadata";

export function isMetadata<V>(v: V) {
  return is$typed(v, id, hashMetadata);
}

export function validateMetadata<V>(v: V) {
  return validate<Metadata & V>(v, id, hashMetadata);
}
