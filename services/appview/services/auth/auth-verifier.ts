import { KeyObject } from "node:crypto";
import { IncomingHttpHeaders, IncomingMessage } from "node:http";
import * as ui8 from "uint8arrays";
import * as jose from "jose";
import { verify } from "hono/jwt";
import { parseDidKey, SECP256K1_JWT_ALG } from "@atproto/crypto";
import {
  AuthOutput,
  AuthRequiredError,
  AuthVerifierContext,
  cryptoVerifySignatureWithKey,
  parseReqNsid,
  verifyJwt,
  VerifySignatureWithKeyFn,
} from "@atproto/xrpc-server";
import {
  Code,
  DataPlaneClient,
  GetIdentityByDidResponse,
  getKeyAsDidKey,
  isDataplaneError,
  unpackIdentityKeys,
} from "../data-plane/client/index.ts";
import { SignatureAlgorithm } from "hono/utils/jwt/jwa";

interface MinimalRequest {
  url?: string;
  method?: string;
  header: (name: string) => string | undefined;
  headers: IncomingHttpHeaders;
}

type ReqCtx = {
  req: MinimalRequest;
};

type StandardAuthOpts = {
  skipAudCheck?: boolean;
  lxmCheck?: (method?: string) => boolean;
};

export enum RoleStatus {
  Valid,
  Invalid,
  Missing,
}

type NullOutput = {
  credentials: {
    type: "none";
    iss: null;
  };
};

type StandardOutput = {
  credentials: {
    type: "standard";
    aud: string;
    iss: string;
  };
};

type RoleOutput = {
  credentials: {
    type: "role";
    admin: boolean;
  };
};

// NOTE this is not currently used, but is here for future use when we support mod services in future
type ModServiceOutput = {
  credentials: {
    type: "mod_service";
    aud: string;
    iss: string;
  };
};

const ALLOWED_AUTH_SCOPES = new Set([
  "com.atproto.access",
  "com.atproto.appPass",
  "com.atproto.appPassPrivileged",
]);

export type AuthVerifierOpts = {
  ownDid: string;
  alternateAudienceDids: string[];
  modServiceDid: string;
  adminPasses: string[];
  entrywayJwtPublicKey?: KeyObject;
};

export interface ExtendedAuthVerifier {
  optionalStandardOrRole: (
    ctx: ReqCtx,
  ) => Promise<StandardOutput | RoleOutput | NullOutput>;
  standardOrRole: (ctx: ReqCtx) => Promise<StandardOutput | RoleOutput>;
  standard: (ctx: ReqCtx) => Promise<StandardOutput>;
  role: (ctx: ReqCtx) => RoleOutput;
  modService: (ctx: ReqCtx) => Promise<ModServiceOutput>;
  roleOrModService: (ctx: ReqCtx) => Promise<RoleOutput | ModServiceOutput>;
  parseCreds: (
    creds: StandardOutput | RoleOutput | ModServiceOutput | NullOutput,
  ) => {
    viewer: string | null;
    includeTakedowns: boolean;
    include3pBlocks: boolean;
    canPerformTakedown: boolean;
  };
  standardOptional: (ctx: ReqCtx) => Promise<StandardOutput | NullOutput>;
  standardOptionalParameterized: (opts: StandardAuthOpts) => (
    ctx: ReqCtx,
  ) => Promise<StandardOutput | NullOutput>;
  entrywaySession: (reqCtx: ReqCtx) => Promise<StandardOutput>;
  parseRoleCreds: (req: MinimalRequest) => {
    status: RoleStatus;
    admin: boolean;
  };
  verifyServiceJwt: (
    reqCtx: ReqCtx,
    opts: {
      iss: string[] | null;
      aud: string | null;
      lxmCheck?: (method?: string) => boolean;
    },
  ) => Promise<{ iss: string; aud: string }>;
  isModService: (iss: string) => boolean;
  nullCreds: () => NullOutput;
}

export interface AuthVerifier extends ExtendedAuthVerifier {
  (ctx: AuthVerifierContext): Promise<AuthOutput>;
  ownDid: string;
  standardAudienceDids: Set<string>;
  modServiceDid: string;
  adminPasses: Set<string>;
  entrywayJwtPublicKey?: KeyObject;
}

export function createAuthVerifier(
  dataplane: DataPlaneClient,
  opts: AuthVerifierOpts,
): AuthVerifier {
  const impl = new AuthVerifierImpl(dataplane, opts);

  // Create the callable function
  const verifier = (ctx: AuthVerifierContext): Promise<AuthOutput> => {
    const adaptedReq = adaptRequest(ctx.req);
    return impl.optionalStandardOrRole({ req: adaptedReq });
  };

  // Add properties and methods
  verifier.ownDid = opts.ownDid;
  verifier.standardAudienceDids = new Set([
    opts.ownDid,
    ...opts.alternateAudienceDids,
  ]);
  verifier.modServiceDid = opts.modServiceDid;
  verifier.adminPasses = new Set(opts.adminPasses);
  verifier.entrywayJwtPublicKey = opts.entrywayJwtPublicKey;

  // Add all methods from impl
  verifier.optionalStandardOrRole = impl.optionalStandardOrRole;
  verifier.standardOrRole = impl.standardOrRole;
  verifier.standard = impl.standard;
  verifier.role = impl.role;
  verifier.modService = impl.modService;
  verifier.roleOrModService = impl.roleOrModService;
  verifier.parseCreds = impl.parseCreds.bind(impl);
  verifier.standardOptional = impl.standardOptional;
  verifier.standardOptionalParameterized = impl.standardOptionalParameterized;
  verifier.entrywaySession = impl.entrywaySession.bind(impl);
  verifier.parseRoleCreds = impl.parseRoleCreds.bind(impl);
  verifier.verifyServiceJwt = impl.verifyServiceJwt.bind(impl);
  verifier.isModService = impl.isModService.bind(impl);
  verifier.nullCreds = impl.nullCreds.bind(impl);

  return verifier as AuthVerifier;
}

// Private implementation class
class AuthVerifierImpl {
  public ownDid: string;
  public standardAudienceDids: Set<string>;
  public modServiceDid: string;
  private adminPasses: Set<string>;
  private entrywayJwtPublicKey?: KeyObject;

  constructor(
    public dataplane: DataPlaneClient,
    opts: AuthVerifierOpts,
  ) {
    this.ownDid = opts.ownDid;
    this.standardAudienceDids = new Set([
      opts.ownDid,
      ...opts.alternateAudienceDids,
    ]);
    this.modServiceDid = opts.modServiceDid;
    this.adminPasses = new Set(opts.adminPasses);
    this.entrywayJwtPublicKey = opts.entrywayJwtPublicKey;
  }

  // verifiers (arrow fns to preserve scope)
  standardOptionalParameterized =
    (opts: StandardAuthOpts) =>
    async (ctx: ReqCtx): Promise<StandardOutput | NullOutput> => {
      // @TODO remove! basic auth + did supported just for testing.
      if (isBasicToken(ctx.req)) {
        const aud = this.ownDid;
        const iss = ctx.req.header("appview-as-did");
        if (typeof iss !== "string" || !iss.startsWith("did:")) {
          throw new AuthRequiredError("bad issuer");
        }
        if (!this.parseRoleCreds(ctx.req).admin) {
          throw new AuthRequiredError("bad credentials");
        }
        return {
          credentials: { type: "standard", iss, aud },
        };
      } else if (isBearerToken(ctx.req)) {
        // @NOTE temporarily accept entryway session tokens to shed load from PDS instances
        const token = bearerTokenFromReq(ctx.req);
        const header = token ? jose.decodeProtectedHeader(token) : undefined;
        if (header?.typ === "at+jwt") {
          // we should never use entryway session tokens in the case of flexible auth audiences (namely in the case of getFeed)
          if (opts.skipAudCheck) {
            throw new AuthRequiredError("Malformed token", "InvalidToken");
          }
          return this.entrywaySession(ctx);
        }

        const { iss, aud } = await this.verifyServiceJwt(ctx, {
          lxmCheck: opts.lxmCheck,
          iss: null,
          aud: null,
        });
        if (!opts.skipAudCheck && !this.standardAudienceDids.has(aud)) {
          throw new AuthRequiredError(
            "jwt audience does not match service did",
            "BadJwtAudience",
          );
        }
        return {
          credentials: {
            type: "standard",
            iss,
            aud,
          },
        };
      } else {
        return this.nullCreds();
      }
    };

  standardOptional: (ctx: ReqCtx) => Promise<StandardOutput | NullOutput> = this
    .standardOptionalParameterized({});

  standard = async (ctx: ReqCtx): Promise<StandardOutput> => {
    const output = await this.standardOptional(ctx);
    if (output.credentials.type === "none") {
      throw new AuthRequiredError(undefined, "AuthMissing");
    }
    return output as StandardOutput;
  };

  role = (ctx: ReqCtx): RoleOutput => {
    const creds = this.parseRoleCreds(ctx.req);
    if (creds.status !== RoleStatus.Valid) {
      throw new AuthRequiredError();
    }
    return {
      credentials: {
        ...creds,
        type: "role",
      },
    };
  };

  standardOrRole = (ctx: ReqCtx): Promise<StandardOutput> | RoleOutput => {
    if (isBearerToken(ctx.req)) {
      return this.standard(ctx);
    } else {
      return this.role(ctx);
    }
  };

  optionalStandardOrRole = async (
    ctx: ReqCtx,
  ): Promise<StandardOutput | RoleOutput | NullOutput> => {
    if (isBearerToken(ctx.req)) {
      return await this.standard(ctx);
    } else {
      const creds = this.parseRoleCreds(ctx.req);
      if (creds.status === RoleStatus.Valid) {
        return {
          credentials: {
            ...creds,
            type: "role",
          },
        };
      } else if (creds.status === RoleStatus.Missing) {
        return this.nullCreds();
      } else {
        throw new AuthRequiredError();
      }
    }
  };

  // @NOTE this auth verifier method is not recommended to be implemented by most appviews
  // this is a short term fix to remove proxy load from Bluesky's PDS and in line with possible
  // future plans to have the client talk directly with the appview
  entrywaySession = async (reqCtx: ReqCtx): Promise<StandardOutput> => {
    const token = bearerTokenFromReq(reqCtx.req);
    if (!token) {
      throw new AuthRequiredError(undefined, "AuthMissing");
    }

    // if entryway jwt key not configured then do not parsed these tokens
    if (!this.entrywayJwtPublicKey) {
      throw new AuthRequiredError("Malformed token", "InvalidToken");
    }

    const res = await jose
      .jwtVerify(token, this.entrywayJwtPublicKey)
      .catch((err) => {
        if (err?.["code"] === "ERR_JWT_EXPIRED") {
          throw new AuthRequiredError("Token has expired", "ExpiredToken");
        }
        throw new AuthRequiredError(
          "Token could not be verified",
          "InvalidToken",
        );
      });

    const { sub, aud, scope } = res.payload;
    if (typeof sub !== "string" || !sub.startsWith("did:")) {
      throw new AuthRequiredError("Malformed token", "InvalidToken");
    } else if (
      typeof aud !== "string" ||
      !aud.startsWith("did:web:") ||
      !aud.endsWith(".bsky.network")
    ) {
      throw new AuthRequiredError("Bad token aud", "InvalidToken");
    } else if (typeof scope !== "string" || !ALLOWED_AUTH_SCOPES.has(scope)) {
      throw new AuthRequiredError("Bad token scope", "InvalidToken");
    }

    return {
      credentials: {
        type: "standard",
        aud: this.ownDid,
        iss: sub,
      },
    };
  };

  modService = async (reqCtx: ReqCtx): Promise<ModServiceOutput> => {
    const { iss, aud } = await this.verifyServiceJwt(reqCtx, {
      aud: this.ownDid,
      iss: [this.modServiceDid, `${this.modServiceDid}#atproto_labeler`],
    });
    return { credentials: { type: "mod_service", aud, iss } };
  };

  roleOrModService = (reqCtx: ReqCtx): Promise<ModServiceOutput> | RoleOutput => {
    if (isBearerToken(reqCtx.req)) {
      return this.modService(reqCtx);
    } else {
      return this.role(reqCtx);
    }
  };

  parseRoleCreds(req: MinimalRequest) {
    const parsed = parseBasicAuth(req.header("Authorization") || "");
    const { Missing, Valid, Invalid } = RoleStatus;
    if (!parsed) {
      return { status: Missing, admin: false, moderator: false, triage: false };
    }
    const { username, password } = parsed;
    if (username === "admin" && this.adminPasses.has(password)) {
      return { status: Valid, admin: true };
    }
    return { status: Invalid, admin: false };
  }

  // @NOTE this is not currently used, but is here for future use when we support mod services in future
  // and potentially for payment providers
  async verifyServiceJwt(
    reqCtx: ReqCtx,
    opts: {
      iss: string[] | null;
      aud: string | null;
      lxmCheck?: (method?: string) => boolean;
    },
  ) {
    const getSigningKey = async (
      iss: string,
      _forceRefresh: boolean, // @TODO consider propagating to dataplane
    ): Promise<string> => {
      if (opts.iss !== null && !opts.iss.includes(iss)) {
        throw new AuthRequiredError("Untrusted issuer", "UntrustedIss");
      }
      const [did, serviceId] = iss.split("#");
      const keyId = serviceId === "atproto_labeler"
        ? "atproto_label"
        : "atproto";
      let identity: GetIdentityByDidResponse;
      try {
        identity = await this.dataplane.getIdentityByDid({ did });
      } catch (err) {
        if (isDataplaneError(err, Code.NotFound)) {
          throw new AuthRequiredError("identity unknown");
        }
        throw err;
      }
      const keys = unpackIdentityKeys(identity.keys);
      const didKey = getKeyAsDidKey(keys, { id: keyId });
      if (!didKey) {
        throw new AuthRequiredError("missing or bad key");
      }
      return didKey;
    };
    const assertLxmCheck = () => {
      const lxm = parseReqNsid({
        url: reqCtx.req.url,
        method: reqCtx.req.method,
      } as IncomingMessage);
      if (
        (opts.lxmCheck && !opts.lxmCheck(payload.lxm)) ||
        (!opts.lxmCheck && payload.lxm !== lxm)
      ) {
        throw new AuthRequiredError(
          payload.lxm !== undefined
            ? `bad jwt lexicon method ("lxm"). must match: ${lxm}`
            : `missing jwt lexicon method ("lxm"). must match: ${lxm}`,
          "BadJwtLexiconMethod",
        );
      }
    };

    const jwtStr = bearerTokenFromReq(reqCtx.req);
    if (!jwtStr) {
      throw new AuthRequiredError("missing jwt", "MissingJwt");
    }
    // if validating additional scopes, skip scope check in initial validation & follow up afterwards
    const payload = await verifyJwt(
      jwtStr,
      opts.aud,
      null,
      getSigningKey,
      verifySignatureWithKey,
    );
    if (
      !payload.iss.endsWith("#atproto_labeler") ||
      payload.lxm !== undefined
    ) {
      // @TODO currently permissive of labelers who dont set lxm yet.
      // we'll allow ozone self-hosters to upgrade before removing this condition.
      assertLxmCheck();
    }
    return { iss: payload.iss, aud: payload.aud };
  }

  isModService(iss: string): boolean {
    return [
      this.modServiceDid,
      `${this.modServiceDid}#atproto_labeler`,
    ].includes(iss);
  }

  nullCreds(): NullOutput {
    return {
      credentials: {
        type: "none",
        iss: null,
      },
    };
  }

  parseCreds(
    creds: StandardOutput | RoleOutput | ModServiceOutput | NullOutput,
  ) {
    const viewer = creds.credentials.type === "standard"
      ? creds.credentials.iss
      : null;
    const includeTakedownsAnd3pBlocks =
      (creds.credentials.type === "role" && creds.credentials.admin) ||
      creds.credentials.type === "mod_service" ||
      (creds.credentials.type === "standard" &&
        this.isModService(creds.credentials.iss));
    const canPerformTakedown =
      (creds.credentials.type === "role" && creds.credentials.admin) ||
      creds.credentials.type === "mod_service";

    return {
      viewer,
      includeTakedowns: includeTakedownsAnd3pBlocks,
      include3pBlocks: includeTakedownsAnd3pBlocks,
      canPerformTakedown,
    };
  }
}

// HELPERS
// ---------

const BEARER = "Bearer ";
const BASIC = "Basic ";

const isBearerToken = (req: MinimalRequest): boolean => {
  return req.header("Authorization")?.startsWith(BEARER) ?? false;
};

const isBasicToken = (req: MinimalRequest): boolean => {
  return req.header("Authorization")?.startsWith(BASIC) ?? false;
};

const bearerTokenFromReq = (req: MinimalRequest) => {
  const header = req.header("Authorization") || "";
  if (!header.startsWith(BEARER)) return null;
  return header.slice(BEARER.length).trim();
};

export const parseBasicAuth = (
  token: string,
): { username: string; password: string } | null => {
  if (!token.startsWith(BASIC)) return null;
  const b64 = token.slice(BASIC.length);
  let parsed: string[];
  try {
    parsed = ui8.toString(ui8.fromString(b64, "base64pad"), "utf8").split(":");
  } catch {
    return null;
  }
  const [username, password] = parsed;
  if (!username || !password) return null;
  return { username, password };
};

export const buildBasicAuth = (username: string, password: string): string => {
  return (
    BASIC +
    ui8.toString(ui8.fromString(`${username}:${password}`, "utf8"), "base64pad")
  );
};

export const verifySignatureWithKey: VerifySignatureWithKeyFn = async (
  didKey: string,
  msgBytes: Uint8Array,
  sigBytes: Uint8Array,
  alg: string,
): Promise<boolean> => {
  if (alg === SECP256K1_JWT_ALG) {
    const parsed = parseDidKey(didKey);
    if (alg !== parsed.jwtAlg) {
      throw new Error(`Expected key alg ${alg}, got ${parsed.jwtAlg}`);
    }

    try {
      // Convert message and signature to base64 strings as expected by hono/jwt verify
      const message = ui8.toString(msgBytes, "base64url");

      await verify(message, didKey, parsed.jwtAlg as SignatureAlgorithm);
      return true;
    } catch {
      return false;
    }
  }

  return cryptoVerifySignatureWithKey(didKey, msgBytes, sigBytes, alg);
};

// Helper function to adapt request
function adaptRequest(req: IncomingMessage): MinimalRequest {
  return {
    url: req.url,
    method: req.method,
    header: (name: string) =>
      req.headers[name.toLowerCase()] as string | undefined,
    headers: req.headers,
  };
}
