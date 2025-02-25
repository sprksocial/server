/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { HeadersMap, XRPCError } from '@atproto/xrpc'
import { ValidationResult, BlobRef } from '@atproto/lexicon'
import { CID } from 'multiformats/cid'
import { validate as _validate } from '../../../../lexicons'
import { $Typed, is$typed as _is$typed, OmitKey } from '../../../../util'
import type * as SoSprkLabelerDefs from './defs.js'

const is$typed = _is$typed,
  validate = _validate
const id = 'so.sprk.labeler.getServices'

export interface QueryParams {
  dids: string[]
  detailed?: boolean
}

export type InputSchema = undefined

export interface OutputSchema {
  views: (
    | $Typed<SoSprkLabelerDefs.LabelerView>
    | $Typed<SoSprkLabelerDefs.LabelerViewDetailed>
    | { $type: string }
  )[]
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
