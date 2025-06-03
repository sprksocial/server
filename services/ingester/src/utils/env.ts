import * as dotenv from "dotenv";
import { envInt, envStr } from "@atproto/common";

dotenv.config();

export const env = {
  NODE_ENV: envStr("NODE_ENV") ?? "development",

  JETSTREAM_URL: envStr("JETSTREAM_URL") ??
    "wss://jetstream2.us-east.bsky.network/subscribe",

  DB_URI: envStr("DB_URI"),
  DB_NAME: envStr("DB_NAME") ?? "dev",
  DB_HOST: envStr("DB_HOST") ?? "localhost",
  DB_PORT: envInt("DB_PORT") ?? 27017,
  DB_USER: envStr("DB_USER") ?? "mongo",
  DB_PASSWORD: envStr("DB_PASSWORD") ?? "mongo",
};
