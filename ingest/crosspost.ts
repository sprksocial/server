import { CrosspostRepoSubscription } from "../data-plane/subscription/crosspost.ts";
import { IdResolver } from "@atp/identity";
import { ServerConfig } from "../config.ts";
import { Database } from "../data-plane/db/index.ts";

const cfg = ServerConfig.readEnv();

const idResolver = new IdResolver({ plcUrl: cfg.plcUrl });
const db = new Database(cfg);
db.connect();

const savedCursor = cfg.debugMode
  ? null
  : await db.getCursorState("crosspost_comments_cursor");
const startCursor = savedCursor !== null ? savedCursor : undefined;

const sub = new CrosspostRepoSubscription({
  cfg,
  db,
  idResolver,
  startCursor,
});

sub.start();
console.info("Crosspost subscription started");
