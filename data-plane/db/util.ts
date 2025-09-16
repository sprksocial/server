import { Document, FilterQuery, Model } from "mongoose";

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

// MongoDB aggregation pipeline stage for counting
export const countPipeline = () => ({
  $count: "total",
});

// Helper for empty query (matches nothing)
export const noMatchFilter = <T>(): FilterQuery<T> => ({
  _id: { $exists: false },
} as FilterQuery<T>);

// MongoDB $in query for large arrays (MongoDB automatically optimizes these)
export const inFilter = <T, U>(field: string, values: T[]): FilterQuery<U> => ({
  [field]: { $in: values },
} as FilterQuery<U>);

// Utility for case-insensitive text search
export const textSearchFilter = <T>(query: string): FilterQuery<T> => ({
  $text: { $search: query },
} as FilterQuery<T>);

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

export const applyPagination = <T extends Document>(
  query: ReturnType<Model<T>["find"]>,
  options: PaginationOptions,
) => {
  if (options.limit) query = query.limit(options.limit);
  if (options.skip) query = query.skip(options.skip);
  if (options.sort) query = query.sort(options.sort);
  return query;
};

// Helper for creating compound filters
export const andFilter = <T>(
  ...filters: FilterQuery<T>[]
): FilterQuery<T> => ({
  $and: filters.filter((f) => Object.keys(f).length > 0),
} as FilterQuery<T>);

export const orFilter = <T>(...filters: FilterQuery<T>[]): FilterQuery<T> => ({
  $or: filters.filter((f) => Object.keys(f).length > 0),
} as FilterQuery<T>);

// Helper for existence checks
export const existsFilter = <T>(field: string): FilterQuery<T> => ({
  [field]: { $exists: true, $ne: null },
} as FilterQuery<T>);

export const notExistsFilter = <T>(field: string): FilterQuery<T> => ({
  $or: [
    { [field]: { $exists: false } },
    { [field]: null },
  ],
} as FilterQuery<T>);

// Type helpers for MongoDB operations
export type MongoFilter<T> = FilterQuery<T>;
export type MongoModel<T extends Document> = Model<T>;
export type MongoQuery<T extends Document> = ReturnType<Model<T>["find"]>;

// Helper for safe array operations
export const safeArray = <T>(value: T | T[] | undefined | null): T[] => {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
};

// Helper for building lookup pipelines (similar to SQL joins)
export const lookupPipeline = (
  from: string,
  localField: string,
  foreignField: string,
  as: string,
) => ({
  $lookup: {
    from,
    localField,
    foreignField,
    as,
  },
});

// Helper for unwind operations
export const unwindPipeline = (
  path: string,
  preserveNullAndEmptyArrays = false,
) => ({
  $unwind: {
    path,
    preserveNullAndEmptyArrays,
  },
});

// Helper for projection
export const projectPipeline = (fields: Record<string, 0 | 1>) => ({
  $project: fields,
});

// Helper for grouping
export const groupPipeline = (
  id: unknown,
  fields: Record<string, unknown>,
) => ({
  $group: {
    _id: id,
    ...fields,
  },
});

// Helper for sorting in aggregation
export const sortPipeline = (sort: Record<string, 1 | -1>) => ({
  $sort: sort,
});

// Helper for limiting in aggregation
export const limitPipeline = (limit: number) => ({
  $limit: limit,
});

// Helper for skipping in aggregation
export const skipPipeline = (skip: number) => ({
  $skip: skip,
});

// Helper for matching in aggregation
export const matchPipeline = <T>(filter: FilterQuery<T>) => ({
  $match: filter,
});
