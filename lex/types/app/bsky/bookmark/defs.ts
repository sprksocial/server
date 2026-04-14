/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { validate as _validate } from "../../../../lexicons.ts";
import type { ValidationResult } from "@atp/lexicon";
import { type $Typed, is$typed as _is$typed } from "../../../../util.ts";
import type * as ComAtprotoRepoStrongRef from "../../../com/atproto/repo/strongRef.ts";
import type * as AppBskyFeedDefs from "../feed/defs.ts";

const is$typed = _is$typed, validate = _validate;
const id = "app.bsky.bookmark.defs";

/** Object used to store bookmark data in stash. */
export interface Bookmark {
  $type?: "app.bsky.bookmark.defs#bookmark";
  subject: ComAtprotoRepoStrongRef.Main;
}

const hashBookmark = "bookmark";

export function isBookmark<V>(v: V): v is Bookmark & V {
  return is$typed(v, id, hashBookmark);
}

export function validateBookmark<V>(v: V): ValidationResult<Bookmark & V> {
  return validate<Bookmark & V>(v, id, hashBookmark);
}

export interface BookmarkView {
  $type?: "app.bsky.bookmark.defs#bookmarkView";
  subject: ComAtprotoRepoStrongRef.Main;
  createdAt?: string;
  item:
    | $Typed<AppBskyFeedDefs.BlockedPost>
    | $Typed<AppBskyFeedDefs.NotFoundPost>
    | $Typed<AppBskyFeedDefs.PostView>
    | { $type: string };
}

const hashBookmarkView = "bookmarkView";

export function isBookmarkView<V>(v: V): v is BookmarkView & V {
  return is$typed(v, id, hashBookmarkView);
}

export function validateBookmarkView<V>(
  v: V,
): ValidationResult<BookmarkView & V> {
  return validate<BookmarkView & V>(v, id, hashBookmarkView);
}
