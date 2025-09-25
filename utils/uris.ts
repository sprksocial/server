import { AtUri } from "@atp/syntax";
import { ids } from "../lex/lexicons.ts";
import {
  Main as StrongRef,
  validateMain as validateStrongRef,
} from "../lex/types/com/atproto/repo/strongRef.ts";

/**
 * Convert a post URI to a threadgate URI. If the URI is not a valid
 * post URI, return URI unchanged. Threadgate lookups will then fail.
 * Threadgates aren't implemented yet but will be in the future.
 */
export function postUriToThreadgateUri(postUri: string) {
  const urip = new AtUri(postUri);
  if (urip.collection === ids.AppBskyFeedPost) {
    urip.collection = ids.AppBskyFeedThreadgate;
  }
  return urip.toString();
}

/**
 * Convert a post URI to a postgate URI. If the URI is not a valid
 * post URI, return URI unchanged. Postgate lookups will then fail.
 * Postgates aren't implemented yet but will be in the future.
 */
export function postUriToPostgateUri(postUri: string) {
  const urip = new AtUri(postUri);
  if (urip.collection === ids.AppBskyFeedPost) {
    urip.collection = ids.AppBskyFeedPostgate;
  }
  return urip.toString();
}

export function uriToDid(uri: string) {
  try {
    return new AtUri(uri).hostname;
  } catch (error) {
    console.log(`AtUri parser failed for URI: ${uri}, error:`, error);
    // Handle custom collection namespaces that AtUri might not recognize
    // Extract DID from URI manually as fallback
    const match = uri.match(/^at:\/\/(did:[^\/]+)/);
    if (match) {
      console.log(`Successfully extracted DID using fallback: ${match[1]}`);
      return match[1];
    }
    console.error(`Failed to extract DID from URI: ${uri}`);
    throw new Error(`Invalid AT URI format: ${uri}`);
  }
}

// @TODO temp fix for proliferation of invalid pinned post values
export function safePinnedPost(value: unknown) {
  if (!value || typeof value !== "object") {
    return;
  }
  const validated = validateStrongRef(value);
  if (!validated.success) {
    return;
  }
  return validated.value as StrongRef;
}
