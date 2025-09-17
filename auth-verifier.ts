import { KeyObject } from "node:crypto";

import * as jose from "jose";
import {
  AuthRequiredError,
  AuthResult,
  MethodAuthContext,
  parseReqNsid,
  verifyJwt,
} from "@sprk/xrpc-server";
import { DataPlane } from "./data-plane/index.ts";

type StandardAuthOpts = {
  skipAudCheck?: boolean;
  lxmCheck?: (method?: string) => boolean;
};

export enum RoleStatus {
  Valid,
  Invalid,
  Missing,
}

export type NullOutput = {
  credentials: {
    type: "none";
    iss: null;
  };
  artifacts: unknown;
};

export type StandardOutput = {
  credentials: {
    type: "standard";
    aud: string;
    iss: string;
  };
  artifacts: unknown;
};

export type RoleOutput = {
  credentials: {
    type: "role";
    admin: boolean;
  };
  artifacts: unknown;
};

// NOTE this is not currently used, but is here for future use when we support mod services in future
export type ModServiceOutput = {
  credentials: {
    type: "mod_service";
    aud: string;
    iss: string;
  };
  artifacts: unknown;
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
    ctx: MethodAuthContext,
  ) => Promise<StandardOutput | RoleOutput | NullOutput>;
  standardOrRole: (
    ctx: MethodAuthContext,
  ) => Promise<StandardOutput | RoleOutput>;
  standard: (ctx: MethodAuthContext) => Promise<StandardOutput>;
  role: (ctx: MethodAuthContext) => RoleOutput;
  modService: (ctx: MethodAuthContext) => Promise<ModServiceOutput>;
  roleOrModService: (
    ctx: MethodAuthContext,
  ) => Promise<RoleOutput | ModServiceOutput>;
  parseCreds: (
    auth: StandardOutput | RoleOutput | NullOutput | ModServiceOutput,
  ) => {
    viewer: string | null;
    includeTakedowns: boolean;
    include3pBlocks: boolean;
    canPerformTakedown: boolean;
  };
  standardOptional: (
    ctx: MethodAuthContext,
  ) => Promise<StandardOutput | NullOutput>;
  standardOptionalParameterized: (opts: StandardAuthOpts) => (
    ctx: MethodAuthContext,
  ) => Promise<StandardOutput | NullOutput>;
  entrywaySession: (reqCtx: MethodAuthContext) => Promise<StandardOutput>;
  parseRoleCreds: (req: Request) => {
    status: RoleStatus;
    admin: boolean;
    type?: "role";
  };
  verifyServiceJwt: (
    reqCtx: MethodAuthContext,
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
  (ctx: MethodAuthContext): Promise<AuthResult>;
  ownDid: string;
  standardAudienceDids: Set<string>;
  modServiceDid: string;
  adminPasses: Set<string>;
  entrywayJwtPublicKey?: KeyObject;
}

export function createAuthVerifier(
  dataplane: DataPlane,
  opts: AuthVerifierOpts,
): AuthVerifier {
  const impl = new AuthVerifierImpl(dataplane, opts);

  // Create the callable function
  const verifier = ((ctx: MethodAuthContext): Promise<AuthResult> => {
    return impl.optionalStandardOrRole(ctx);
  }) as unknown as AuthVerifier;

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
  verifier.optionalStandardOrRole = (ctx: MethodAuthContext) => {
    if ("c" in ctx) {
      return impl.optionalStandardOrRole(ctx);
    }
    return impl.optionalStandardOrRole(ctx as MethodAuthContext);
  };
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
    public dataplane: DataPlane,
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
    async (ctx: MethodAuthContext): Promise<StandardOutput | NullOutput> => {
      if (isBasicToken(ctx.req)) {
        const aud = this.ownDid;
        const iss = ctx.req.headers.get("appview-as-did");
        if (typeof iss !== "string" || !iss.startsWith("did:")) {
          throw new AuthRequiredError("bad issuer");
        }
        if (!this.parseRoleCreds(ctx.req).admin) {
          throw new AuthRequiredError("bad credentials");
        }
        return {
          credentials: { type: "standard", iss, aud },
          artifacts: null,
        };
      } else if (isBearerToken(ctx.req)) {
        const token = bearerTokenFromReq(ctx.req);
        const header = token ? jose.decodeProtectedHeader(token) : undefined;
        if (header?.typ === "at+jwt") {
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
          artifacts: null,
        };
      } else {
        return this.nullCreds();
      }
    };

  standardOptional: (
    ctx: MethodAuthContext,
  ) => Promise<StandardOutput | NullOutput> = this
    .standardOptionalParameterized({});

  standard = async (ctx: MethodAuthContext): Promise<StandardOutput> => {
    const output = await this.standardOptional(ctx);
    if (output.credentials.type === "none") {
      throw new AuthRequiredError(undefined, "AuthMissing");
    }
    return output as StandardOutput;
  };

  role = (ctx: MethodAuthContext): RoleOutput => {
    const creds = this.parseRoleCreds(ctx.req);
    if (creds.status !== RoleStatus.Valid) {
      throw new AuthRequiredError();
    }
    return {
      credentials: {
        ...creds,
        type: "role",
      },
      artifacts: null,
    };
  };

  standardOrRole = async (
    ctx: MethodAuthContext,
  ): Promise<StandardOutput | RoleOutput> => {
    if (isBearerToken(ctx.req)) {
      return await this.standard(ctx);
    } else {
      const creds = this.parseRoleCreds(ctx.req);
      if (creds.status !== RoleStatus.Valid) {
        throw new AuthRequiredError();
      }
      return {
        credentials: {
          ...creds,
          type: "role" as const,
        },
        artifacts: null,
      };
    }
  };

  optionalStandardOrRole = async (
    ctx: MethodAuthContext,
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
          artifacts: null,
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
  entrywaySession = async (
    ctx: MethodAuthContext,
  ): Promise<StandardOutput> => {
    const token = bearerTokenFromReq(ctx.req);
    if (!token) {
      throw new AuthRequiredError(undefined, "AuthMissing");
    }

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
      !aud.startsWith("did:web:")
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
      artifacts: null,
    };
  };

  modService = async (ctx: MethodAuthContext): Promise<ModServiceOutput> => {
    const { iss, aud } = await this.verifyServiceJwt(ctx, {
      aud: this.ownDid,
      iss: [this.modServiceDid, `${this.modServiceDid}#atproto_labeler`],
    });
    return {
      credentials: { type: "mod_service", aud, iss },
      artifacts: null,
    };
  };

  roleOrModService = async (
    reqCtx: MethodAuthContext,
  ): Promise<RoleOutput | ModServiceOutput> => {
    if (isBearerToken(reqCtx.req)) {
      return await this.modService(reqCtx);
    } else {
      const creds = this.parseRoleCreds(reqCtx.req);
      if (creds.status !== RoleStatus.Valid) {
        throw new AuthRequiredError();
      }
      return {
        credentials: {
          ...creds,
          type: "role" as const,
        },
        artifacts: null,
      };
    }
  };

  parseRoleCreds(
    req: Request,
  ): { status: RoleStatus; admin: boolean; type?: "role" } {
    const parsed = parseBasicAuth(req.headers.get("Authorization") || "");
    const { Missing, Valid, Invalid } = RoleStatus;
    if (!parsed) {
      return { status: Missing, admin: false };
    }
    const { username, password } = parsed;
    if (username === "admin" && this.adminPasses.has(password)) {
      return { status: Valid, admin: true, type: "role" as const };
    }
    return { status: Invalid, admin: false };
  }

  // @NOTE this is not currently used, but is here for future use when we support mod services in future
  // and potentially for payment providers
  async verifyServiceJwt(
    reqCtx: MethodAuthContext,
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
      try {
        const identity = await this.dataplane.identity.getByDid(did);

        const keys = JSON.parse(identity.keys) as Record<string, {
          Type: string;
          PublicKeyMultibase: string;
        }>;
        const key = keys[keyId];

        if (!key || !key.PublicKeyMultibase) {
          throw new AuthRequiredError("missing or bad key");
        }

        return `did:key:${key.PublicKeyMultibase}`;
      } catch (err) {
        if (err instanceof AuthRequiredError) {
          throw err;
        }
        throw new AuthRequiredError("identity unknown");
      }
    };
    const assertLxmCheck = () => {
      const lxm = parseReqNsid(reqCtx.req);
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
      artifacts: null,
    };
  }

  parseCreds(
    auth: StandardOutput | RoleOutput | NullOutput | ModServiceOutput,
  ) {
    const creds = auth.credentials;
    const isAdmin = creds.type === "role" && creds.admin;
    const isModService =
      (creds.type === "standard" || creds.type === "mod_service") &&
      creds.iss && this.isModService(creds.iss);
    const includeTakedownsAnd3pBlocks = Boolean(isAdmin || isModService);
    return {
      viewer: creds.type === "standard" ? creds.iss : null,
      includeTakedowns: includeTakedownsAnd3pBlocks,
      include3pBlocks: includeTakedownsAnd3pBlocks,
      canPerformTakedown: includeTakedownsAnd3pBlocks,
    };
  }
}

// HELPERS
// ---------

const BEARER = "Bearer ";
const BASIC = "Basic ";

const isBearerToken = (req: Request): boolean => {
  return req.headers.get("Authorization")?.startsWith(BEARER) ?? false;
};

const isBasicToken = (req: Request): boolean => {
  return req.headers.get("Authorization")?.startsWith(BASIC) ?? false;
};

const bearerTokenFromReq = (req: Request) => {
  const header = req.headers.get("Authorization") || "";
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
    const binaryString = atob(b64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    parsed = new TextDecoder("utf-8").decode(bytes).split(":");
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
    btoa(
      new TextEncoder().encode(`${username}:${password}`).reduce(
        (data, byte) => data + String.fromCharCode(byte),
        "",
      ),
    )
  );
};
