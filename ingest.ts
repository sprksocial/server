import { RepoSubscription } from "./data-plane/subscription.ts";
import { IdResolver } from "@atp/identity";
import { ServerConfig } from "./config.ts";
import { Database } from "./data-plane/db/index.ts";
import { getLogger } from "@logtape/logtape";
import { configureLogger } from "./utils/logger.ts";

await configureLogger();

const logger = getLogger(["ingester"]);
const cfg = ServerConfig.readEnv();

const idResolver = new IdResolver({ plcUrl: cfg.plcUrl });
const db = new Database(cfg);
db.connect();

const savedCursor = cfg.debugMode ? null : await db.getCursorState();
const startCursor = savedCursor !== null ? savedCursor : undefined;

const sub = new RepoSubscription({
  cfg,
  db,
  idResolver,
  startCursor,
});
await sub.indexingSvc.indexRepo("did:plc:6hbqm2oftpotwuw7gvvrui3i");

sub.start();
logger.info("Subscription started");
