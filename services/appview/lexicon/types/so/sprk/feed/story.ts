/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { type ValidationResult, BlobRef } from '@atproto/lexicon'
import { CID } from 'multiformats/cid'
import { validate as _validate } from '../../../../lexicons'
import {
  type $Typed,
  is$typed as _is$typed,
  type OmitKey,
} from '../../../../util'
import type * as SoSprkEmbedImages from '../embed/images.js'
import type * as SoSprkEmbedVideo from '../embed/video.js'
import type * as ComAtprotoRepoStrongRef from '../../../com/atproto/repo/strongRef.js'
import type * as ComAtprotoLabelDefs from '../../../com/atproto/label/defs.js'

const is$typed = _is$typed,
  validate = _validate
const id = 'so.sprk.feed.story'

export interface Record {
  $type: 'so.sprk.feed.story'
  media:
    | $Typed<SoSprkEmbedImages.Main>
    | $Typed<SoSprkEmbedVideo.Main>
    | { $type: string }
  sound?: ComAtprotoRepoStrongRef.Main
  labels?: $Typed<ComAtprotoLabelDefs.SelfLabels> | { $type: string }
  /** Additional hashtags, in addition to any included in story text and facets. */
  tags?: string[]
  /** Client-declared timestamp when this story was originally created. */
  createdAt: string
  [k: string]: unknown
}

const hashRecord = 'main'

export function isRecord<V>(v: V) {
  return is$typed(v, id, hashRecord)
}

export function validateRecord<V>(v: V) {
  return validate<Record & V>(v, id, hashRecord, true)
}
