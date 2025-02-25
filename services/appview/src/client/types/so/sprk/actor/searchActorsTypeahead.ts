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
const id = 'so.sprk.actor.searchActorsTypeahead'

export interface QueryParams {
  /** Search query prefix; not a full query string. */
  q?: string
  limit?: number
}

export type InputSchema = undefined

export interface OutputSchema {
  actors: SoSprkActorDefs.ProfileViewBasic[]
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
