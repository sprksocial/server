import * as dotenv from "npm:dotenv";
import { envInt, envStr } from "@atproto/common";

dotenv.config();

export const env = {
  NODE_ENV: envStr("NODE_ENV") ?? "development",
  HOST: envStr("HOST") ?? "0.0.0.0",
  PORT: envInt("PORT") ?? 3000,
  PUBLIC_URL: envStr("PUBLIC_URL") ?? "",
  APPVIEW_K256_PRIVATE_KEY_HEX: envStr("APPVIEW_K256_PRIVATE_KEY_HEX") ?? "",
  SERVICE_DID: envStr("SERVICE_DID") ?? "did:web:localhost",
  MOD_SERVICE_DID: envStr("MOD_SERVICE_DID") ?? "did:web:localhost",
  ADMIN_PASSWORD: envStr("ADMIN_PASSWORD") ?? "admin-token",
  HLS_CDN_URL: envStr("HLS_CDN_URL") ?? "https://vz-fb7436e9-c53.b-cdn.net",
  VIDEO_CDN_URL: envStr("VIDEO_CDN_URL") ?? "https://hls.sprk.so",

  DB_URI: envStr("DB_URI"),
  DB_NAME: envStr("DB_NAME") ?? "dev",
  DB_HOST: envStr("DB_HOST") ?? "localhost",
  DB_PORT: envInt("DB_PORT") ?? 27017,
  DB_USER: envStr("DB_USER") ?? "mongo",
  DB_PASSWORD: envStr("DB_PASSWORD") ?? "mongo",

  RUNNER_CONCURRENCY: envInt("RUNNER_CONCURRENCY") ?? 64,
  BACKGROUND_CONCURRENCY: envInt("BACKGROUND_CONCURRENCY") ?? 16,
  MONGO_MAX_POOL_SIZE: envInt("MONGO_MAX_POOL_SIZE") ?? 50,
};
