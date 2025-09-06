export const BSKY_USER_AGENT = "BskyAppView";
export const ATPROTO_CONTENT_LABELERS = "Atproto-Content-Labelers";
export const ATPROTO_REPO_REV = "Atproto-Repo-Rev";

type ResHeaderOpts = {
  repoRev: string | null;
};

export const resHeaders = (
  opts: Partial<ResHeaderOpts>,
): Record<string, string> => {
  const headers: Record<string, string> = {};
  if (opts.repoRev) {
    headers[ATPROTO_REPO_REV] = opts.repoRev;
  }
  return headers;
};

export const clearlyBadCursor = (cursor?: string) => {
  // hallmark of v1 cursor, highly unlikely in v2 cursors based on time or rkeys
  return !!cursor?.includes("::");
};
