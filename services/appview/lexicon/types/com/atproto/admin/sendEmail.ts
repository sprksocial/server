/**
 * GENERATED CODE - DO NOT MODIFY
 */
export type QueryParams = globalThis.Record<PropertyKey, never>;

export interface InputSchema {
  recipientDid: string;
  content: string;
  subject?: string;
  senderDid: string;
  /** Additional comment by the sender that won't be used in the email itself but helpful to provide more context for moderators/reviewers */
  comment?: string;
}

export interface OutputSchema {
  sent: boolean;
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
