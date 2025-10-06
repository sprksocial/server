import { ensureValidRecordKey } from "@atp/syntax";
import { InvalidRequestError } from "@atp/xrpc-server";
import { Document, FilterQuery, Query } from "mongoose";

type KeysetCursor = { primary: string; secondary: string };
type KeysetLabeledResult = {
  primary: string | number;
  secondary: string | number;
};

/**
 * The GenericKeyset is an abstract class that sets-up the interface and partial implementation
 * of a keyset-paginated cursor with two parts. There are three types involved:
 *  - Result: a raw result (i.e. a document from the db) containing data that will make-up a cursor.
 *    - E.g. { createdAt: '2022-01-01T12:00:00Z', cid: 'bafyx' }
 *  - LabeledResult: a Result processed such that the "primary" and "secondary" parts of the cursor are labeled.
 *    - E.g. { primary: '2022-01-01T12:00:00Z', secondary: 'bafyx' }
 *  - Cursor: the two string parts that make-up the packed/string cursor.
 *    - E.g. packed cursor '1641038400000__bafyx' in parts { primary: '1641038400000', secondary: 'bafyx' }
 *
 * These types relate as such. Implementers define the relations marked with a *:
 *   Result -*-> LabeledResult <-*-> Cursor <--> packed/string cursor
 *                     ↳ MongoDB Filter Condition
 */
export abstract class GenericKeyset<R, LR extends KeysetLabeledResult> {
  constructor(
    public primary: string,
    public secondary: string,
  ) {}
  abstract labelResult(result: R): LR;
  abstract labeledResultToCursor(labeled: LR): KeysetCursor;
  abstract cursorToLabeledResult(cursor: KeysetCursor): LR;
  packFromResult(results: R | R[]): string | undefined {
    const result = Array.isArray(results) ? results.at(-1) : results;
    if (!result) return;
    return this.pack(this.labelResult(result));
  }
  pack(labeled?: LR): string | undefined {
    if (!labeled) return;
    const cursor = this.labeledResultToCursor(labeled);
    return this.packCursor(cursor);
  }
  unpack(cursorStr?: string): LR | undefined {
    const cursor = this.unpackCursor(cursorStr);
    if (!cursor) return;
    return this.cursorToLabeledResult(cursor);
  }
  packCursor(cursor?: KeysetCursor): string | undefined {
    if (!cursor) return;
    // Use colon as separator (more compact than double underscore)
    return `${cursor.primary}:${cursor.secondary}`;
  }
  unpackCursor(cursorStr?: string): KeysetCursor | undefined {
    if (!cursorStr) return;
    const separatorIndex = cursorStr.indexOf(":");
    if (separatorIndex === -1) {
      throw new InvalidRequestError("Malformed cursor: missing separator");
    }
    const primary = cursorStr.slice(0, separatorIndex);
    const secondary = cursorStr.slice(separatorIndex + 1);
    if (!primary || !secondary) {
      throw new InvalidRequestError(
        "Malformed cursor: missing primary or secondary",
      );
    }
    return {
      primary,
      secondary,
    };
  }
  getFilter<T>(
    labeled?: LR,
    direction?: "asc" | "desc",
  ): FilterQuery<T> | undefined {
    if (labeled === undefined) return undefined;

    // MongoDB compound key comparison using $or
    if (direction === "asc") {
      return {
        $or: [
          { [this.primary]: { $gt: labeled.primary } },
          {
            [this.primary]: labeled.primary,
            [this.secondary]: { $gt: labeled.secondary },
          },
        ],
      } as FilterQuery<T>;
    } else {
      return {
        $or: [
          { [this.primary]: { $lt: labeled.primary } },
          {
            [this.primary]: labeled.primary,
            [this.secondary]: { $lt: labeled.secondary },
          },
        ],
      } as FilterQuery<T>;
    }
  }
  paginate<T extends Document>(
    query: Query<T[], T>,
    opts: {
      limit?: number;
      cursor?: string;
      direction?: "asc" | "desc";
    },
  ): Query<T[], T> {
    const { limit, cursor, direction = "desc" } = opts;
    const keysetFilter = this.getFilter<T>(this.unpack(cursor), direction);

    if (keysetFilter) {
      query = query.where(keysetFilter);
    }

    if (limit) {
      query = query.limit(limit);
    }

    // Set up sorting
    const sortOrder = direction === "asc" ? 1 : -1;
    query = query.sort({
      [this.primary]: sortOrder,
      [this.secondary]: sortOrder,
    });

    return query;
  }
}

type SortedAtCidResult = { sortAt?: string; cid: string };
type TimeCidLabeledResult = KeysetCursor;

export class TimeCidKeyset<
  TimeCidResult = SortedAtCidResult,
> extends GenericKeyset<TimeCidResult, TimeCidLabeledResult> {
  constructor() {
    super("sortAt", "cid");
  }

  labelResult(result: TimeCidResult): TimeCidLabeledResult;
  labelResult<TimeCidResult extends SortedAtCidResult>(result: TimeCidResult) {
    // Use current time as fallback if sortAt is missing
    const sortAt = result.sortAt || new Date().toISOString();
    return { primary: sortAt, secondary: result.cid };
  }
  labeledResultToCursor(labeled: TimeCidLabeledResult) {
    const timestamp = new Date(labeled.primary).getTime();
    if (isNaN(timestamp)) {
      throw new InvalidRequestError("Invalid date for cursor");
    }
    // Use seconds instead of milliseconds and base36 encoding for compactness
    const secondsBase36 = Math.floor(timestamp / 1000).toString(36);
    return {
      primary: secondsBase36,
      secondary: labeled.secondary,
    };
  }
  cursorToLabeledResult(cursor: KeysetCursor) {
    // Parse from base36 and convert seconds back to milliseconds
    const seconds = parseInt(cursor.primary, 36);
    if (isNaN(seconds)) {
      throw new InvalidRequestError("Malformed cursor: invalid timestamp");
    }
    const primaryDate = new Date(seconds * 1000);
    if (isNaN(primaryDate.getTime())) {
      throw new InvalidRequestError("Malformed cursor: invalid date");
    }
    return {
      primary: primaryDate.toISOString(),
      secondary: cursor.secondary,
    };
  }
}

export class CreatedAtDidKeyset extends TimeCidKeyset<{
  createdAt: string;
  did: string; // dids are treated identically to cids in TimeCidKeyset
}> {
  constructor() {
    super();
    this.primary = "createdAt";
    this.secondary = "did";
  }

  override labelResult(result: { createdAt: string; did: string }) {
    // Use current time as fallback if createdAt is missing
    const createdAt = result.createdAt || new Date().toISOString();
    return { primary: createdAt, secondary: result.did };
  }
}

export class IndexedAtDidKeyset extends TimeCidKeyset<{
  indexedAt: string;
  did: string; // dids are treated identically to cids in TimeCidKeyset
}> {
  constructor() {
    super();
    this.primary = "indexedAt";
    this.secondary = "did";
  }

  override labelResult(result: { indexedAt: string; did: string }) {
    // Use current time as fallback if indexedAt is missing
    const indexedAt = result.indexedAt || new Date().toISOString();
    return { primary: indexedAt, secondary: result.did };
  }
}

/**
 * This is being deprecated. Use {@link GenericKeyset#paginate} instead.
 */
export const paginate = <
  T extends Document,
  K extends GenericKeyset<unknown, KeysetLabeledResult>,
>(
  query: Query<T[], T>,
  opts: {
    limit?: number;
    cursor?: string;
    direction?: "asc" | "desc";
    keyset: K;
  },
): Query<T[], T> => {
  return opts.keyset.paginate(query, opts);
};

type SingleKeyCursor = {
  primary: string;
};

type SingleKeyLabeledResult = {
  primary: string | number;
};

/**
 * GenericSingleKey is similar to {@link GenericKeyset} but for a single key cursor.
 */
export abstract class GenericSingleKey<R, LR extends SingleKeyLabeledResult> {
  constructor(public primary: string) {}
  abstract labelResult(result: R): LR;
  abstract labeledResultToCursor(labeled: LR): SingleKeyCursor;
  abstract cursorToLabeledResult(cursor: SingleKeyCursor): LR;
  packFromResult(results: R | R[]): string | undefined {
    const result = Array.isArray(results) ? results.at(-1) : results;
    if (!result) return;
    return this.pack(this.labelResult(result));
  }
  pack(labeled?: LR): string | undefined {
    if (!labeled) return;
    const cursor = this.labeledResultToCursor(labeled);
    return this.packCursor(cursor);
  }
  unpack(cursorStr?: string): LR | undefined {
    const cursor = this.unpackCursor(cursorStr);
    if (!cursor) return;
    return this.cursorToLabeledResult(cursor);
  }
  packCursor(cursor?: SingleKeyCursor): string | undefined {
    if (!cursor) return;
    return cursor.primary;
  }
  unpackCursor(cursorStr?: string): SingleKeyCursor | undefined {
    if (!cursorStr) return;
    // Single key cursors don't use separators
    if (cursorStr.includes(":") || cursorStr.includes("__")) {
      throw new InvalidRequestError(
        "Malformed cursor: unexpected separator in single key cursor",
      );
    }
    return {
      primary: cursorStr,
    };
  }
  getFilter<T>(
    labeled?: LR,
    direction?: "asc" | "desc",
  ): FilterQuery<T> | undefined {
    if (labeled === undefined) return undefined;
    if (direction === "asc") {
      return { [this.primary]: { $gt: labeled.primary } } as FilterQuery<T>;
    }
    return { [this.primary]: { $lt: labeled.primary } } as FilterQuery<T>;
  }
  paginate<T extends Document>(
    query: Query<T[], T>,
    opts: {
      limit?: number;
      cursor?: string;
      direction?: "asc" | "desc";
    },
  ): Query<T[], T> {
    const { limit, cursor, direction = "desc" } = opts;
    const keyFilter = this.getFilter<T>(this.unpack(cursor), direction);

    if (keyFilter) {
      query = query.where(keyFilter);
    }

    if (limit) {
      query = query.limit(limit);
    }

    const sortOrder = direction === "asc" ? 1 : -1;
    query = query.sort({ [this.primary]: sortOrder });

    return query;
  }
}

type SortAtResult = { sortAt: string };
type TimeLabeledResult = SingleKeyCursor;

export class IsoTimeKey<TimeResult = SortAtResult> extends GenericSingleKey<
  TimeResult,
  TimeLabeledResult
> {
  constructor() {
    super("sortAt");
  }

  labelResult(result: TimeResult): TimeLabeledResult;
  labelResult<TimeResult extends SortAtResult>(result: TimeResult) {
    return { primary: result.sortAt };
  }
  labeledResultToCursor(labeled: TimeLabeledResult) {
    const primaryDate = new Date(labeled.primary);
    if (isNaN(primaryDate.getTime())) {
      throw new InvalidRequestError("Invalid date for cursor");
    }
    return {
      primary: primaryDate.toISOString(),
    };
  }
  cursorToLabeledResult(cursor: SingleKeyCursor) {
    const primaryDate = new Date(cursor.primary);
    if (isNaN(primaryDate.getTime())) {
      throw new InvalidRequestError("Malformed cursor: invalid date");
    }
    return {
      primary: primaryDate.toISOString(),
    };
  }
}

export class IsoSortAtKey extends IsoTimeKey<{
  sortAt: string;
}> {
  constructor() {
    super();
  }

  override labelResult(result: { sortAt: string }) {
    return { primary: result.sortAt };
  }
}

type KeyResult = { key: string };
type RkeyLabeledResult = SingleKeyCursor;

export class RkeyKey<RkeyResult = KeyResult> extends GenericSingleKey<
  RkeyResult,
  RkeyLabeledResult
> {
  constructor() {
    super("key");
  }

  labelResult(result: RkeyResult): RkeyLabeledResult;
  labelResult<RkeyResult extends KeyResult>(result: RkeyResult) {
    return { primary: result.key };
  }
  labeledResultToCursor(labeled: RkeyLabeledResult) {
    return {
      primary: labeled.primary,
    };
  }
  cursorToLabeledResult(cursor: SingleKeyCursor) {
    try {
      ensureValidRecordKey(cursor.primary);
      return {
        primary: cursor.primary,
      };
    } catch {
      throw new InvalidRequestError("Malformed cursor");
    }
  }
}

export class StashKeyKey extends RkeyKey<{
  key: string;
}> {
  constructor() {
    super();
  }

  override labelResult(result: { key: string }) {
    return { primary: result.key };
  }
}
