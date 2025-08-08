import { Hono } from "hono";
import { cors } from "hono/cors";
import { HTTPException } from "hono/http-exception";
import { logger } from "hono/logger";
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
import { BidirectionalResolver } from "./utils/id-resolver.ts";
import { DidResolver } from "@atproto/identity";
import { AuthVerifier } from "./services/auth-verifier.ts";
import { AuthRequiredError } from "@sprk/xrpc-server";
import { RepoSubscription } from "./data-plane/server/subscription.ts";
import { configure, getConsoleSink, getLogger, Logger } from "@logtape/logtape";
import { prettyFormatter } from "@logtape/pretty";

await configure({
  sinks: { console: getConsoleSink({ formatter: prettyFormatter }) },
  loggers: [
    { category: "appview", lowestLevel: "info", sinks: ["console"] },
  ],
});

export type AppContext = {
  db: Database;
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

    ctx.logger.error({ err });
    return c.json({
      error: "Internal Server Error",
      message: "An unexpected error occurred",
    }, 500);
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
  const baseIdResolver = createIdResolver();
  const resolver = createBidirectionalResolver(baseIdResolver);
  const serviceDid = env.SERVICE_DID;

  // Services
  const sub = new RepoSubscription({
    service: "wss://relay1.us-east.bsky.network",
    db,
    idResolver: baseIdResolver,
  });
  const takedownService = new TakedownService(db);
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
    authVerifier,
    sub,
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

export default function getApp(): Hono<AppEnv> {
  if (!defaultApp) {
    const result = setupApp();
    defaultApp = result.app;
  }
  return defaultApp;
}

// Start the server if this file is run directly
if (import.meta.main) {
  startServer();
}
