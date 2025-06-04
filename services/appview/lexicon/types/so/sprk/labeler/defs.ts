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
import type * as SoSprkActorDefs from '../actor/defs.js'
import type * as ComAtprotoLabelDefs from '../../../com/atproto/label/defs.js'

const is$typed = _is$typed,
  validate = _validate
const id = 'so.sprk.labeler.defs'

export interface LabelerView {
  $type?: 'so.sprk.labeler.defs#labelerView'
  uri: string
  cid: string
  creator: SoSprkActorDefs.ProfileView
  likeCount?: number
  lookCount?: number
  viewer?: LabelerViewerState
  indexedAt: string
  labels?: ComAtprotoLabelDefs.Label[]
}

const hashLabelerView = 'labelerView'

export function isLabelerView<V>(v: V) {
  return is$typed(v, id, hashLabelerView)
}

export function validateLabelerView<V>(v: V) {
  return validate<LabelerView & V>(v, id, hashLabelerView)
}

export interface LabelerViewDetailed {
  $type?: 'so.sprk.labeler.defs#labelerViewDetailed'
  uri: string
  cid: string
  creator: SoSprkActorDefs.ProfileView
  policies: LabelerPolicies
  likeCount?: number
  lookCount?: number
  viewer?: LabelerViewerState
  indexedAt: string
  labels?: ComAtprotoLabelDefs.Label[]
}

const hashLabelerViewDetailed = 'labelerViewDetailed'

export function isLabelerViewDetailed<V>(v: V) {
  return is$typed(v, id, hashLabelerViewDetailed)
}

export function validateLabelerViewDetailed<V>(v: V) {
  return validate<LabelerViewDetailed & V>(v, id, hashLabelerViewDetailed)
}

export interface LabelerViewerState {
  $type?: 'so.sprk.labeler.defs#labelerViewerState'
  like?: string
  look?: string
}

const hashLabelerViewerState = 'labelerViewerState'

export function isLabelerViewerState<V>(v: V) {
  return is$typed(v, id, hashLabelerViewerState)
}

export function validateLabelerViewerState<V>(v: V) {
  return validate<LabelerViewerState & V>(v, id, hashLabelerViewerState)
}

export interface LabelerPolicies {
  $type?: 'so.sprk.labeler.defs#labelerPolicies'
  /** The label values which this labeler publishes. May include global or custom labels. */
  labelValues: ComAtprotoLabelDefs.LabelValue[]
  /** Label values created by this labeler and scoped exclusively to it. Labels defined here will override global label definitions for this labeler. */
  labelValueDefinitions?: ComAtprotoLabelDefs.LabelValueDefinition[]
}

const hashLabelerPolicies = 'labelerPolicies'

export function isLabelerPolicies<V>(v: V) {
  return is$typed(v, id, hashLabelerPolicies)
}

export function validateLabelerPolicies<V>(v: V) {
  return validate<LabelerPolicies & V>(v, id, hashLabelerPolicies)
}
