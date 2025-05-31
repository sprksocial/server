import { Context, Next } from "hono";
import { HTTPException } from "hono/http-exception";
import { verifyJwt } from "@atproto/xrpc-server";
import { DidResolver } from "@atproto/identity";
import { env } from "../../utils/env.ts";
import { decodeBase64 } from "@std/encoding";

/**
 * Authentication middleware for ATP agents
 *
 * @param c - Hono context
 * @param next - Next middleware function
 * @param adminRequired - Whether admin privileges are required (checks admin token)
 */
export const authMiddleware = async (
  c: Context,
  next: Next,
  adminRequired = false,
) => {
  const authHeader = c.req.header("Authorization");

  if (!authHeader) {
    throw new HTTPException(401, {
      message: "Unauthorized: Missing Authorization header",
    });
  }

  try {
    if (authHeader.startsWith("Basic ")) {
      const base64Credentials = authHeader.replace("Basic ", "").trim();
      const decodedBytes = decodeBase64(base64Credentials);
      const credentials = new TextDecoder().decode(decodedBytes);
      const [username, password] = credentials.split(":");

      console.log("Basic auth attempt:", {
        username,
        password,
        expected: env.ADMIN_PASSWORD,
      });

      if (username === "admin" && password === env.ADMIN_PASSWORD) {
        c.set("isAdmin", true);
        await next();
        return;
      } else {
        throw new HTTPException(401, {
          message: "Unauthorized: Invalid admin credentials",
        });
      }
    } else if (authHeader.startsWith("Bearer ")) {
      const jwt = authHeader.replace("Bearer ", "").trim();

      // The service DID and resolver should be passed from app context
      const serviceDid = c.get("serviceDid");
      const didResolver = c.get("didResolver") as DidResolver;

      const parsed = await verifyJwt(
        jwt,
        serviceDid,
        null,
        (did: string) => {
          return didResolver.resolveAtprotoKey(did);
        },
      );

      // Set auth information in the context for route handlers to access
      c.set("did", parsed.iss);
      c.set("accessJwt", jwt);

      // Check for admin status if required
      if (adminRequired) {
        if (!c.get("isAdmin")) {
          throw new HTTPException(403, {
            message:
              "Forbidden: Admin privileges required - use Basic auth with admin token",
          });
        }
      }

      await next();
    } else {
      throw new HTTPException(401, {
        message:
          'Unauthorized: Authorization header must start with "Basic " or "Bearer "',
      });
    }
  } catch (err) {
    if (err instanceof HTTPException) {
      throw err;
    }
    throw new HTTPException(401, {
      message: "Unauthorized: Invalid credentials",
    });
  }
};

/**
 * Optional authentication middleware - doesn't throw on missing/invalid auth
 * Still sets isAdmin flag if the user has admin privileges
 */
export const optionalAuthMiddleware = async (c: Context, next: Next) => {
  const authHeader = c.req.header("Authorization");

  if (authHeader) {
    if (authHeader.startsWith("Basic ")) {
      try {
        const base64Credentials = authHeader.replace("Basic ", "").trim();
        const decodedBytes = decodeBase64(base64Credentials);
        const credentials = new TextDecoder().decode(decodedBytes);
        const [username, password] = credentials.split(":");

        if (username === "admin" && password === env.ADMIN_PASSWORD) {
          c.set("isAdmin", true);
        }
      } catch {
        // On auth failure, just continue without setting admin context
      }
    } else if (authHeader.startsWith("Bearer ")) {
      const jwt = authHeader.replace("Bearer ", "").trim();

      try {
        const serviceDid = c.get("serviceDid");
        const didResolver = c.get("didResolver") as DidResolver;

        const parsed = await verifyJwt(
          jwt,
          serviceDid,
          null,
          (did: string) => {
            return didResolver.resolveAtprotoKey(did);
          },
        );

        // Set auth information if JWT is valid
        c.set("did", parsed.iss);
        c.set("accessJwt", jwt);
      } catch {
        // On auth failure, just continue without setting auth context
      }
    }
  }

  await next();
};
