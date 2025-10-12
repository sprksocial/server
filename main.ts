import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { Database } from "./data-plane/db/index.ts";
import { env } from "./utils/env.ts";
import { createAuthVerifier } from "./auth-verifier.ts";
import API from "./api/index.ts";
import { createServer } from "./lex/index.ts";
import wellKnown from "./api/well-known.ts";
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

  app.use("*", cors());
  app.use("*", logger());

  // Lexicon/XRPC server and routers
  const lexServer = createServer();
  API(lexServer, ctx);
  app.route("/", lexServer.xrpc.app);

  app.route("/.well-known", wellKnown);
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
export function setupApp(): { app: Hono<AppEnv>; ctx: AppContext } {
  // Setup logger and database
  const appLogger = getLogger(["appview"]);
  const db = new Database();
  db.connect();

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
export function startServer() {
  const { app, ctx } = setupApp();

  // Start HTTP server immediately
  const { HOST, PORT } = env;
  Deno.serve({
    hostname: HOST,
    port: PORT,
    onListen: (info) => {
      ctx.logger.info(`Server listening on ${info.hostname}:${info.port}`);
    },
  }, app.fetch);

  // Handle shutdown
  const shutdown = async (signal: string) => {
    ctx.logger.info(`Received ${signal}; shutting down...`);
    try {
      ctx.logger.info("Disconnecting database...");
      await ctx.db.disconnect();
    } catch (err) {
      ctx.logger.error("Error disconnecting database during shutdown", { err });
    }
    ctx.logger.info("Shutdown complete");
    Deno.exit(0);
  };

  Deno.addSignalListener("SIGINT", () => shutdown("SIGINT"));
  Deno.addSignalListener("SIGTERM", () => shutdown("SIGTERM"));
}

// Start the server if this file is run directly
if (import.meta.main) {
  startServer();
}
