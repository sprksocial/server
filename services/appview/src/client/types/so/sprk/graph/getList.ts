/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { HeadersMap, XRPCError } from '@atproto/xrpc'
import { ValidationResult, BlobRef } from '@atproto/lexicon'
import { CID } from 'multiformats/cid'
import { validate as _validate } from '../../../../lexicons'
import { $Typed, is$typed as _is$typed, OmitKey } from '../../../../util'
import type * as SoSprkGraphDefs from './defs.js'

const is$typed = _is$typed,
  validate = _validate
const id = 'so.sprk.graph.getList'

export interface QueryParams {
  /** Reference (AT-URI) of the list record to hydrate. */
  list: string
  limit?: number
  cursor?: string
}

export type InputSchema = undefined

export interface OutputSchema {
  cursor?: string
  list: SoSprkGraphDefs.ListView
  items: SoSprkGraphDefs.ListItemView[]
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
