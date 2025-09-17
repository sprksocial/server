import { FilterQuery } from "mongoose";

// MongoDB query builder for actor matching (DID or handle)
export const actorFilter = <T>(actor: string): FilterQuery<T> => {
  if (actor.startsWith("did:")) {
    return { did: actor } as FilterQuery<T>;
  } else {
    return { handle: actor } as FilterQuery<T>;
  }
};

// Filter for documents that are not soft deleted
export const notSoftDeletedFilter = <T>(): FilterQuery<T> => {
  return { takedownRef: { $exists: false } } as FilterQuery<T>;
};

// Check if a document is soft deleted
export const softDeleted = (
  actorOrRecord: { takedownRef?: string | null },
): boolean => {
  return !!actorOrRecord.takedownRef;
};

// Helper for date range queries
export const dateRangeFilter = <T>(
  field: string,
  start?: Date,
  end?: Date,
): FilterQuery<T> => {
  const filter: Record<string, unknown> = {};
  if (start || end) {
    filter[field] = {};
    if (start) (filter[field] as Record<string, unknown>).$gte = start;
    if (end) (filter[field] as Record<string, unknown>).$lte = end;
  }
  return filter as FilterQuery<T>;
};

// Helper for pagination
export interface PaginationOptions {
  limit?: number;
  skip?: number;
  sort?: Record<string, 1 | -1>;
}

// Helper for creating compound filters
export const andFilter = <T>(
  ...filters: FilterQuery<T>[]
): FilterQuery<T> => ({
  $and: filters.filter((f) => Object.keys(f).length > 0),
} as FilterQuery<T>);

export const orFilter = <T>(...filters: FilterQuery<T>[]): FilterQuery<T> => ({
  $or: filters.filter((f) => Object.keys(f).length > 0),
} as FilterQuery<T>);
