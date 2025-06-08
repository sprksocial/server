import { Hono } from "hono";
import { cors } from "hono/cors";
import { HTTPException } from "hono/http-exception";
import { logger } from "hono/logger";
import { pino } from "pino";
import { Database } from "./services/data-plane/server/index.ts";
import { env } from "./utils/env.ts";
import { createAuthVerifier } from "./services/auth/auth-verifier.ts";
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
import { AuthVerifier } from "./services/auth/auth-verifier.ts";
import { AuthRequiredError } from "@sprk/xrpc-server";

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

// Initialize Hono app
const app = new Hono<AppEnv>();

app.use("*", cors());
app.use("*", logger());
app.use("*", async (c, next) => {
  c.env.serviceDid = serviceDid;
  c.env.didResolver = baseIdResolver.did;
  c.env.takedownService = takedownService;
  c.env.indexingService = indexingService;
  c.env.authVerifier = authVerifier;
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

  appLogger.error({ err }, "Server error");
  return c.json({
    error: "Internal Server Error",
    message: "An unexpected error occurred",
  }, 500);
});

// Start server
const { HOST, PORT } = env;
Deno.serve({
  hostname: HOST,
  port: PORT,
  onListen: (info) => {
    appLogger.info(`Server listening on ${info.hostname}:${info.port}`);
  },
}, app.fetch);

// Handle shutdown
Deno.addSignalListener("SIGINT", async () => {
  appLogger.info("Shutting down server");
  await db.disconnect();
  Deno.exit(0);
});
Deno.addSignalListener("SIGTERM", async () => {
  appLogger.info("Shutting down server");
  await db.disconnect();
  Deno.exit(0);
});

export default app;
