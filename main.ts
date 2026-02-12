import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { Database } from "./data-plane/db/index.ts";
import { createAuthVerifier } from "./auth-verifier.ts";
import API from "./api/index.ts";
import { createServer } from "./lex/index.ts";
import wellKnown from "./api/well-known.ts";
import health from "./api/health.ts";
import { IdResolver, MemoryCache } from "@atp/identity";
import { DataPlane } from "./data-plane/index.ts";
import { Hydrator } from "./hydration/index.ts";
import { Views } from "./views/index.ts";
import { AppContext, AppEnv } from "./context.ts";
import { ServerConfig } from "./config.ts";
import { defaultLabelerHeader, parseLabelerHeader } from "./util.ts";
import { PushService } from "./utils/push.ts";

// Create app without starting services
export function createApp(ctx: AppContext): Hono<AppEnv> {
  const app = new Hono<AppEnv>();

  app.use("*", cors());
  app.use("*", logger());
  app.use("*", async (c, next) => {
    c.env = ctx;
    await next();
  });

  // Lexicon/XRPC server and routers
  const lexServer = createServer();
  API(lexServer, ctx);

  app.route("/.well-known", wellKnown);
  app.route("/", health);
  app.route("/", lexServer.xrpc.app);

  return app;
}

// Setup function to create context and app
export function setupApp(): { app: Hono<AppEnv>; ctx: AppContext } {
  const cfg = ServerConfig.readEnv();
  const db = new Database(cfg);
  db.connect();

  // DID and resolver setup with caching
  const idResolver = new IdResolver({
    plcUrl: cfg.plcUrl,
    didCache: new MemoryCache(),
  });

  const dataplane = new DataPlane(db, idResolver);
  const hydrator = new Hydrator(dataplane, cfg.labelsFromIssuerDids);
  const views = new Views({
    indexedAtEpoch: cfg.indexedAtEpoch,
    videoCdn: cfg.videoCdn,
    mediaCdn: cfg.mediaCdn,
    thumbCdn: cfg.thumbCdn,
  });

  const authVerifier = createAuthVerifier(dataplane, {
    ownDid: cfg.serverDid,
    alternateAudienceDids: [],
    modServiceDid: cfg.modServiceDid,
    adminPasses: cfg.adminPasswords,
  });

  const reqLabelers = (req: Request) => {
    const val = req.headers.get("atproto-accept-labelers") ?? undefined;
    const parsed = parseLabelerHeader(val);
    if (!parsed) return defaultLabelerHeader(cfg.labelsFromIssuerDids);
    return parsed;
  };

  // Create push service for badge management
  const pushService = new PushService(dataplane.pushTokens, db, {
    enabled: cfg.pushEnabled,
    fcmServiceAccount: cfg.fcmServiceAccount,
  });

  const ctx = {
    db,
    dataplane,
    hydrator,
    views,
    idResolver,
    cfg,
    authVerifier,
    reqLabelers,
    pushService,
  };

  const app = createApp(ctx);
  return { app, ctx };
}

// Start server function
export function startServer() {
  const { app, ctx } = setupApp();

  // Start HTTP server immediately
  const { port } = ctx.cfg;
  Deno.serve({
    port,
    onListen: (info) => {
      console.info(`Server listening on ${info.hostname}:${info.port}`);
    },
  }, app.fetch);

  // Handle shutdown
  const shutdown = async (signal: string) => {
    console.info(`Received ${signal}; shutting down...`);
    try {
      console.info("Disconnecting database...");
      await ctx.db.disconnect();
    } catch (err) {
      console.error("Error disconnecting database during shutdown", { err });
    }
    console.info("Shutdown complete");
    Deno.exit(0);
  };

  Deno.addSignalListener("SIGINT", () => shutdown("SIGINT"));
  Deno.addSignalListener("SIGTERM", () => shutdown("SIGTERM"));
}

// Start the server if this file is run directly
if (import.meta.main) {
  startServer();
}
