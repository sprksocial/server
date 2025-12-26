import { formatLabelerHeader, ParsedLabelers } from "../util.ts";

export const SPRK_USER_AGENT = "SprkAppView";
export const ATPROTO_CONTENT_LABELERS = "Atproto-Content-Labelers";
export const ATPROTO_REPO_REV = "Atproto-Repo-Rev";

type ResHeaderOpts = {
  labelers: ParsedLabelers;
  repoRev: string | null;
};

export const resHeaders = (
  opts: Partial<ResHeaderOpts>,
): Record<string, string> => {
  const headers: Record<string, string> = {};
  if (opts.labelers) {
    headers[ATPROTO_CONTENT_LABELERS] = formatLabelerHeader(opts.labelers);
  }
  if (opts.repoRev) {
    headers[ATPROTO_REPO_REV] = opts.repoRev;
  }
  return headers;
};

export const clearlyBadCursor = (cursor?: string) => {
  return !!cursor?.includes("::");
};
