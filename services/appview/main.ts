import { Hono } from "hono";
import { cors } from "hono/cors";
import { HTTPException } from "hono/http-exception";
import { logger } from "hono/logger";
import { pino } from "pino";
import { Database } from "./data-plane/server/index.ts";
import { env } from "./utils/env.ts";
import { createAuthVerifier } from "./services/auth-verifier.ts";
import API from "./api/index.ts";
import { createServer } from "./lexicon/index.ts";
import {
  createBidirectionalResolver,
  createIdResolver,
} from "./utils/id-resolver.ts";
import { takedownFilterMiddleware } from "./services/takedown-filter.ts";
import wellKnownRouter from "./utils/well-known.ts";
import { TakedownService } from "./services/takedown.ts";
import { IndexingService } from "./services/indexing.ts";
import { BidirectionalResolver } from "./utils/id-resolver.ts";
import { DidResolver } from "@atproto/identity";
import { AuthVerifier } from "./services/auth-verifier.ts";
import { AuthRequiredError } from "@sprk/xrpc-server";
import startJetstreamIngester from "./ingester/index.ts";

export type AppContext = {
  db: Database;
  logger: pino.Logger;
  resolver: BidirectionalResolver;
  serviceDid: string;
  didResolver: DidResolver;
  takedownService: TakedownService;
  indexingService: IndexingService;
  authVerifier: AuthVerifier;
};

export type AppEnv = {
  Bindings: AppContext;
  Variables: {
    did: string;
    isAdmin: boolean;
  };
};

// Create app without starting services
export function createApp(ctx: AppContext): Hono<AppEnv> {
  const app = new Hono<AppEnv>();

  app.use("*", async (c, next) => {
    await next();
    if (c.res.status === 500) {
      ctx.logger.error(`Internal server error`, c.error);
      console.log(c.error);
    }
  });

  app.use("*", cors());
  app.use("*", logger());
  app.use("*", async (c, next) => {
    // Initialize c.env if it doesn't exist (for testing compatibility)
    if (!c.env) {
      c.env = {} as AppContext;
    }
    c.env.serviceDid = ctx.serviceDid;
    c.env.didResolver = ctx.didResolver;
    c.env.takedownService = ctx.takedownService;
    c.env.indexingService = ctx.indexingService;
    c.env.authVerifier = ctx.authVerifier;
    await next();
  });
  app.use("*", takedownFilterMiddleware);

  // Lexicon/XRPC server and routers
  const lexServer = createServer();
  API(lexServer, ctx);

  app.route("/", wellKnownRouter());
  app.route("/", lexServer.xrpc.routes);

  // Root route
  app.get("/", (c) => {
    return c.text(
      "✧･ﾟ: ✧･ﾟ:. ݁₊ ⊹ . ݁˖ . ݁ SPARK API . ݁₊ ⊹ . ݁˖ . ݁ :･ﾟ✧:･ﾟ✧",
    );
  });

  // Health endpoint
  app.get("/xrpc/_health", (c) => {
    const version = Deno.env.get("COMMIT_SHA") ?? "unknown";
    return c.json({ version });
  });

  // Error handling
  app.onError((err, c) => {
    if (err instanceof HTTPException) return err.getResponse();

    // Handle AuthRequiredError from XRPC server
    if (
      err instanceof AuthRequiredError ||
      err.constructor?.name === "AuthRequiredError"
    ) {
      const authErr = err as AuthRequiredError;
      return c.json({
        error: authErr.message || "Authentication Required",
        message: authErr.message || "Invalid or missing credentials",
      }, 401);
    }

    ctx.logger.error({ err }, "Server error");
    return c.json({
      error: "Internal Server Error",
      message: "An unexpected error occurred",
    }, 500);
  });

  return app;
}

// Setup function to create context and app
export async function setupApp(): Promise<
  { app: Hono<AppEnv>; ctx: AppContext }
> {
  // Setup logger and database
  const appLogger = pino({ name: "server start" });
  const db = new Database();
  await db.connect();

  // DID and resolver setup
  const baseIdResolver = createIdResolver();
  const resolver = createBidirectionalResolver(baseIdResolver);
  const serviceDid = env.SERVICE_DID;

  // Services
  const takedownService = new TakedownService(db);
  const indexingService = new IndexingService(db, resolver);
  const authVerifier = createAuthVerifier(db, {
    ownDid: serviceDid,
    alternateAudienceDids: [],
    modServiceDid: env.MOD_SERVICE_DID,
    adminPasses: [env.ADMIN_PASSWORD],
  });

  const ctx = {
    db,
    logger: appLogger,
    resolver,
    serviceDid,
    didResolver: baseIdResolver.did,
    takedownService,
    indexingService,
    authVerifier,
  };

  const app = createApp(ctx);
  return { app, ctx };
}

// Start server function
export async function startServer(): Promise<void> {
  const { app, ctx } = await setupApp();

  // Start Jetstream ingester
  startJetstreamIngester().catch((err) => {
    ctx.logger.error({ err }, "Failed to start Jetstream ingester");
    Deno.exit(1);
  });

  // Start server
  const { HOST, PORT } = env;
  Deno.serve({
    hostname: HOST,
    port: PORT,
    onListen: (info) => {
      ctx.logger.info(`Server listening on ${info.hostname}:${info.port}`);
    },
  }, app.fetch);

  // Handle shutdown
  Deno.addSignalListener("SIGINT", async () => {
    ctx.logger.info("Shutting down server");
    await ctx.db.disconnect();
    Deno.exit(0);
  });
  Deno.addSignalListener("SIGTERM", async () => {
    ctx.logger.info("Shutting down server");
    await ctx.db.disconnect();
    Deno.exit(0);
  });
}

// Default export for backward compatibility (creates app without starting services)
let defaultApp: Hono<AppEnv> | null = null;

export default async function getApp(): Promise<Hono<AppEnv>> {
  if (!defaultApp) {
    const result = await setupApp();
    defaultApp = result.app;
  }
  return defaultApp;
}

// Start the server if this file is run directly
if (import.meta.main) {
  await startServer();
}
