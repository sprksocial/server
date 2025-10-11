import { RepoSubscription } from "./data-plane/subscription.ts";
import { IdResolver } from "@atp/identity";
import { env } from "./utils/env.ts";
import { Database } from "./data-plane/db/index.ts";
import { configure, getConsoleSink, getLogger } from "@logtape/logtape";
import { getPrettyFormatter } from "@logtape/pretty";

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
    { category: "ingester", lowestLevel: "info", sinks: ["console"] },
    { category: ["logtape", "meta"], lowestLevel: "error", sinks: ["console"] },
  ],
});

const logger = getLogger();

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
