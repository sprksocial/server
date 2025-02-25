/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { HeadersMap, XRPCError } from '@atproto/xrpc'
import { ValidationResult, BlobRef } from '@atproto/lexicon'
import { CID } from 'multiformats/cid'
import { validate as _validate } from '../../../../lexicons'
import { $Typed, is$typed as _is$typed, OmitKey } from '../../../../util'
import type * as SoSprkActorDefs from '../actor/defs.js'

const is$typed = _is$typed,
  validate = _validate
const id = 'so.sprk.graph.getFollows'

export interface QueryParams {
  actor: string
  limit?: number
  cursor?: string
}

export type InputSchema = undefined

export interface OutputSchema {
  subject: SoSprkActorDefs.ProfileView
  cursor?: string
  follows: SoSprkActorDefs.ProfileView[]
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
