import { RepoSubscription } from "./data-plane/subscription.ts";
import { IdResolver } from "@atp/identity";
import { env } from "./utils/env.ts";
import { Database } from "./data-plane/db/index.ts";
import { getLogger } from "@logtape/logtape";
import { configureLogger } from "./utils/logger.ts";

await configureLogger();

const logger = getLogger(["ingester"]);

const idResolver = new IdResolver();
const db = new Database();
db.connect();

const savedCursor = env.NODE_ENV === "development"
  ? null
  : await db.getCursorState();
const startCursor = savedCursor !== null ? savedCursor : undefined;

const sub = new RepoSubscription({
  service: env.RELAY_URL,
  db,
  idResolver,
  startCursor,
});

sub.start();
logger.info("Subscription started");
