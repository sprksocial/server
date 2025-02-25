/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { HeadersMap, XRPCError } from '@atproto/xrpc'
import { ValidationResult, BlobRef } from '@atproto/lexicon'
import { CID } from 'multiformats/cid'
import { validate as _validate } from '../../../../lexicons'
import { $Typed, is$typed as _is$typed, OmitKey } from '../../../../util'
import type * as SoSprkActorDefs from './defs.js'

const is$typed = _is$typed,
  validate = _validate
const id = 'so.sprk.actor.searchActors'

export interface QueryParams {
  /** Search query string. Syntax, phrase, boolean, and faceting is unspecified, but Lucene query syntax is recommended. */
  q?: string
  limit?: number
  cursor?: string
}

export type InputSchema = undefined

export interface OutputSchema {
  cursor?: string
  actors: SoSprkActorDefs.ProfileView[]
}

export interface CallOptions {
  signal?: AbortSignal
  headers?: HeadersMap
}

export interface Response {
  success: boolean
  headers: HeadersMap
  data: OutputSchema
}

export function toKnownErr(e: any) {
  return e
}
