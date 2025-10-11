import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { Database } from "./data-plane/db/index.ts";
import { env } from "./utils/env.ts";
import { createAuthVerifier } from "./auth-verifier.ts";
import API from "./api/index.ts";
import { createServer } from "./lex/index.ts";
import wellKnownRouter from "./api/well-known.ts";
import { IdResolver } from "@atp/identity";
import { DataPlane } from "./data-plane/index.ts";
import { getLogger } from "@logtape/logtape";
import { configureLogger } from "./utils/logger.ts";
import { Hydrator } from "./hydration/index.ts";
import { Views } from "./views/index.ts";
import { AppContext, AppEnv } from "./context.ts";

await configureLogger();

// Create app without starting services
export function createApp(ctx: AppContext): Hono<AppEnv> {
  const app = new Hono<AppEnv>();

  app.use("*", async (c, next) => {
    await next();
    if (c.res.status === 500) {
      ctx.logger.error(c.error?.message!);
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
    c.env.authVerifier = ctx.authVerifier;
    await next();
  });

  // Lexicon/XRPC server and routers
  const lexServer = createServer();
  API(lexServer, ctx);

  app.route("/", wellKnownRouter());
  app.route("/", lexServer.xrpc.app);

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

  return app;
}

// Setup function to create context and app
export async function setupApp(): Promise<
  { app: Hono<AppEnv>; ctx: AppContext }
> {
  // Setup logger and database
  const appLogger = getLogger(["appview"]);
  const db = new Database();
  db.connect();

  // Read cursor from database (skip in dev environment)
  const savedCursor = env.NODE_ENV === "development"
    ? null
    : await db.getCursorState();
  const startCursor = savedCursor !== null ? savedCursor : undefined;

  appLogger.info("Database cursor loaded", {
    cursor: startCursor,
  });

  // DID and resolver setup
  const idResolver = new IdResolver();
  const serviceDid = env.SERVICE_DID;

  const dataplane = new DataPlane(db, idResolver);
  const hydrator = new Hydrator(dataplane);
  const views = new Views();

  const authVerifier = createAuthVerifier(dataplane, {
    ownDid: serviceDid,
    alternateAudienceDids: [],
    modServiceDid: env.MOD_SERVICE_DID,
    adminPasses: [env.ADMIN_PASSWORD],
  });

  const ctx = {
    db,
    dataplane,
    hydrator,
    views,
    logger: appLogger,
    idResolver,
    serviceDid,
    authVerifier,
  };

  const app = createApp(ctx);
  return { app, ctx };
}

// Start server function
export async function startServer() {
  const { app, ctx } = await setupApp();

  // Start HTTP server immediately
  const { HOST, PORT } = env;
  Deno.serve({
    hostname: HOST,
    port: PORT,
    onListen: (info) => {
      ctx.logger.info(`Server listening on ${info.hostname}:${info.port}`);
    },
  }, app.fetch);

  let retryTimeoutId: number | undefined;
  let retryResolve: (() => void) | null = null;

  // Handle shutdown
  const shutdown = async (signal: string) => {
    ctx.logger.info(`Received ${signal}; shutting down...`);
    if (retryTimeoutId !== undefined) {
      clearTimeout(retryTimeoutId);
      retryTimeoutId = undefined;
    }
    if (retryResolve) {
      retryResolve();
      retryResolve = null;
    }
    try {
      await ctx.db.disconnect();
    } catch (e) {
      ctx.logger.error("Error disconnecting database during shutdown", { e });
    }
    ctx.logger.info("Shutdown complete");
    Deno.exit(0);
  };

  Deno.addSignalListener("SIGINT", () => shutdown("SIGINT"));
  Deno.addSignalListener("SIGTERM", () => shutdown("SIGTERM"));
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
