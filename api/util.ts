import type {
  ModServiceOutput,
  NullOutput,
  RoleOutput,
  StandardOutput,
} from "../auth-verifier.ts";
import type { AppContext } from "../context.ts";
import type { HydrateCtx, HydrateCtxVals } from "../hydration/index.ts";
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

type HydrateCtxAuth =
  | StandardOutput
  | RoleOutput
  | NullOutput
  | ModServiceOutput;

export const createHydrateCtxFromAuth = (
  ctx: AppContext,
  req: Request,
  auth: HydrateCtxAuth,
  overrides: Partial<HydrateCtxVals> = {},
): Promise<HydrateCtx> => {
  const labelers = ctx.reqLabelers(req);
  const { canPerformTakedown: _canPerformTakedown, ...hydrateVals } = ctx
    .authVerifier.parseCreds(auth);

  return ctx.hydrator.createContext({
    labelers,
    ...hydrateVals,
    ...overrides,
  });
};
