/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { validate as _validate } from "../../../../lexicons.ts";
import type { ValidationResult } from "@atp/lexicon";
import { is$typed as _is$typed } from "../../../../util.ts";

const is$typed = _is$typed, validate = _validate;
const id = "so.sprk.graph.defs";

/** indicates that a handle or DID could not be resolved */
export interface NotFoundActor {
  $type?: "so.sprk.graph.defs#notFoundActor";
  actor: string;
  notFound: true;
}

const hashNotFoundActor = "notFoundActor";

export function isNotFoundActor<V>(v: V): v is NotFoundActor & V {
  return is$typed(v, id, hashNotFoundActor);
}

export function validateNotFoundActor<V>(
  v: V,
): ValidationResult<NotFoundActor & V> {
  return validate<NotFoundActor & V>(v, id, hashNotFoundActor);
}

/** lists the bi-directional graph relationships between one actor (not indicated in the object), and the target actors (the DID included in the object) */
export interface Relationship {
  $type?: "so.sprk.graph.defs#relationship";
  did: string;
  /** if the actor follows this DID, this is the AT-URI of the follow record */
  following?: string;
  /** if the actor is followed by this DID, contains the AT-URI of the follow record */
  followedBy?: string;
}

const hashRelationship = "relationship";

export function isRelationship<V>(v: V): v is Relationship & V {
  return is$typed(v, id, hashRelationship);
}

export function validateRelationship<V>(
  v: V,
): ValidationResult<Relationship & V> {
  return validate<Relationship & V>(v, id, hashRelationship);
}
