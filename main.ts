import { Hono } from "hono";
import { cors } from "hono/cors";
import { HTTPException } from "hono/http-exception";
import { logger } from "hono/logger";
import { Database } from "./data-plane/db/index.ts";
import { env } from "./utils/env.ts";
import { createAuthVerifier } from "./auth-verifier.ts";
import API from "./api/index.ts";
import { createServer } from "./lex/index.ts";
import {
  createBidirectionalResolver,
  createIdResolver,
} from "./utils/id-resolver.ts";
import { takedownFilterMiddleware } from "./services/takedown-filter.ts";
import wellKnownRouter from "./api/well-known.ts";
import { TakedownService } from "./services/takedown.ts";
import { BidirectionalResolver } from "./utils/id-resolver.ts";
import { DidResolver } from "@atp/identity";
import { AuthVerifier } from "./auth-verifier.ts";
import { AuthRequiredError } from "@atp/xrpc-server";
import { RepoSubscription } from "./data-plane/subscription.ts";
import { DataPlane } from "./data-plane/index.ts";
import { configure, getConsoleSink, getLogger, Logger } from "@logtape/logtape";
import { getPrettyFormatter } from "@logtape/pretty";
import { Hydrator } from "./hydration/index.ts";
import { Views } from "./views/index.ts";

await configure({
  sinks: {
    console: getConsoleSink({
      formatter: getPrettyFormatter({
        properties: true,
        categoryStyle: "underline",
        messageColor: "rgb(255, 255, 255)",
        categoryColor: "rgb(255, 255, 255)",
        messageStyle: "reset",
      }),
    }),
  },
  loggers: [
    { category: "appview", lowestLevel: "info", sinks: ["console"] },
    { category: ["logtape", "meta"], lowestLevel: "error", sinks: ["console"] },
  ],
});

export type AppContext = {
  db: Database;
  dataplane: DataPlane;
  hydrator: Hydrator;
  views: Views;
  logger: Logger;
  resolver: BidirectionalResolver;
  serviceDid: string;
  didResolver: DidResolver;
  takedownService: TakedownService;
  authVerifier: AuthVerifier;
  sub: RepoSubscription;
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
    c.env.didResolver = ctx.didResolver;
    c.env.takedownService = ctx.takedownService;
    c.env.authVerifier = ctx.authVerifier;
    c.env.sub = ctx.sub;
    await next();
  });
  app.use("*", takedownFilterMiddleware);

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

    ctx.logger.error({ err });
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
  const appLogger = getLogger(["appview"]);
  const db = new Database();
  db.connect();

  // Wait for database connection
  const connected = await db.waitForConnection(30000);
  if (!connected) {
    throw new Error("Failed to connect to database during startup");
  }

  // Read cursor from database (skip in dev environment)
  const savedCursor = env.NODE_ENV === "development"
    ? null
    : await db.getCursorState();
  const startCursor = savedCursor !== null ? savedCursor : undefined;

  appLogger.info("Database cursor loaded", {
    cursor: startCursor,
    isDev: env.NODE_ENV === "development",
    skippedSavedCursor: env.NODE_ENV === "development",
  });

  // DID and resolver setup
  const baseIdResolver = createIdResolver();
  const resolver = createBidirectionalResolver(baseIdResolver);
  const serviceDid = env.SERVICE_DID;

  const dataplane = new DataPlane(db, resolver.baseResolver);
  const hydrator = new Hydrator(dataplane);
  const views = new Views();

  // Services
  const sub = new RepoSubscription({
    service: env.RELAY_URL,
    db,
    idResolver: baseIdResolver,
    startCursor,
  });
  const takedownService = new TakedownService(db);
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
    resolver,
    serviceDid,
    didResolver: baseIdResolver.did,
    takedownService,
    authVerifier,
    sub,
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

  // Start subscription only after DB is connected
  let stopStartLoop = false;
  let retryTimeoutId: number | undefined;
  let retryResolve: (() => void) | null = null;
  const startSubWhenReady = async () => {
    ctx.logger.info(
      "Waiting for MongoDB connection before starting subscription...",
    );
    let attempt = 0;
    while (!stopStartLoop) {
      attempt++;
      const connected = await ctx.db.waitForConnection(30000);
      if (connected) {
        ctx.logger.info("MongoDB connected; starting firehose subscription");
        ctx.sub.start();
        break;
      } else {
        ctx.logger.error(
          `MongoDB not connected after timeout (attempt ${attempt}); retrying in 5s...`,
        );
        await new Promise<void>((resolve) => {
          retryResolve = () => {
            resolve();
            retryResolve = null;
          };
          retryTimeoutId = setTimeout(() => {
            retryResolve = null;
            resolve();
          }, 5000);
        });
        retryTimeoutId = undefined;
      }
    }
  };
  startSubWhenReady(); // fire and forget

  // Handle shutdown
  const shutdown = async (signal: string) => {
    ctx.logger.info(`Received ${signal}; shutting down...`);
    stopStartLoop = true;
    if (retryTimeoutId !== undefined) {
      clearTimeout(retryTimeoutId);
      retryTimeoutId = undefined;
    }
    if (retryResolve) {
      retryResolve();
      retryResolve = null;
    }
    try {
      await ctx.sub.destroy();
    } catch (e) {
      ctx.logger.error("Error destroying subscription during shutdown", { e });
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
