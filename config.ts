import * as dotenv from "dotenv";
import { envInt, envList, envStr } from "@atp/common";

dotenv.config({ quiet: true });

export interface ServerConfigValues {
  version?: string;
  debugMode?: boolean;
  port?: number;
  publicUrl?: string;
  serverDid: string;
  privateKey: string;
  alternateAudienceDids: string[];
  modServiceDid: string;
  adminPasswords: string[];
  indexedAtEpoch?: Date;

  bigThreadUris: Set<string>;
  bigThreadDepth?: number;
  maxThreadDepth?: number;
  maxThreadParents: number;
  notificationsDelayMs: number;

  videoCdn?: string;
  mediaCdn?: string;
  thumbCdn?: string;

  dbUri?: string;
  dbName?: string;
  dbUser?: string;
  dbPass?: string;
  relayUrl?: string;
  plcUrl?: string;

  labelsFromIssuerDids: string[];
}

export class ServerConfig {
  constructor(private cfg: ServerConfigValues) {}

  static readEnv() {
    const version = envStr("SPRK_VERSION");
    const debugMode = Deno.env.get("NODE_ENV") === "development" ||
      Deno.env.get("NODE_ENV") === "test";
    const port = envInt("SPRK_PORT") ?? 3000;
    const publicUrl = envStr("SPRK_PUBLIC_URL") ?? undefined;
    const serverDid = envStr("SPRK_SERVER_DID") ?? "did:example:test";
    const privateKey = envStr("SPRK_PRIVATE_KEY") ?? "";
    const alternateAudienceDids = envList("SPRK_ALTERNATE_AUDIENCE_DIDS") ?? [];
    const modServiceDid = envStr("SPRK_MOD_SERVICE_DID") ?? "did:web:localhost";
    const adminPasswords = envList("SPRK_ADMIN_PASSWORDS") ?? ["admin-token"];

    const indexedAtEpochEnv = Deno.env.get("SPRK_INDEXED_AT_EPOCH");
    const indexedAtEpoch = indexedAtEpochEnv !== undefined
      ? new Date(indexedAtEpochEnv)
      : undefined;

    const bigThreadUris = new Set(envList("SPRK_BIG_THREAD_URIS"));
    const bigThreadDepth = envInt("SPRK_BIG_THREAD_DEPTH") ?? 10;
    const maxThreadDepth = envInt("SPRK_MAX_THREAD_DEPTH") ?? 10;
    const maxThreadParents = envInt("SPRK_MAX_THREAD_PARENTS") ?? 10;
    const notificationsDelayMs = envInt("SPRK_NOTIFICATIONS_DELAY_MS") ?? 10;

    const videoCdn = envStr("SPRK_VIDEO_CDN") ?? "https://video.sprk.so";
    const mediaCdn = envStr("SPRK_MEDIA_CDN") ?? "https://media.sprk.so";
    const thumbCdn = envStr("SPRK_THUMB_CDN") ?? "https://thumb.sprk.so";

    const dbUri = envStr("SPRK_DB_URI") ??
      "mongodb://mongo:mongo@localhost:27017/dev";
    const dbName = envStr("SPRK_DB_NAME") ?? "dev";
    const dbUser = envStr("SPRK_DB_USER") ?? "mongo";
    const dbPass = envStr("SPRK_DB_PASS") ?? "mongo";
    const relayUrl = envStr("SPRK_RELAY") ??
      "wss://relay1.us-east.bsky.network";
    const plcUrl = envStr("SPRK_PLC") ?? "https://plc.directory";

    const labelsFromIssuerDids = envList("SPRK_LABELS_FROM_ISSUER_DIDS") ?? [];

    return new ServerConfig({
      version,
      debugMode,
      port,
      publicUrl,
      serverDid,
      privateKey,
      alternateAudienceDids,
      modServiceDid,
      adminPasswords,
      indexedAtEpoch,
      bigThreadUris,
      bigThreadDepth,
      maxThreadDepth,
      maxThreadParents,
      notificationsDelayMs,
      videoCdn,
      mediaCdn,
      thumbCdn,
      dbUri,
      dbName,
      dbUser,
      dbPass,
      relayUrl,
      plcUrl,
      labelsFromIssuerDids,
    });
  }

  get version() {
    return this.cfg.version;
  }
  get debugMode() {
    return this.cfg.debugMode;
  }
  get port() {
    return this.cfg.port;
  }
  get publicUrl() {
    return this.cfg.publicUrl;
  }
  get serverDid() {
    return this.cfg.serverDid;
  }
  get privateKey() {
    return this.cfg.privateKey;
  }
  get alternateAudienceDids() {
    return this.cfg.alternateAudienceDids;
  }
  get modServiceDid() {
    return this.cfg.modServiceDid;
  }
  get adminPasswords() {
    return this.cfg.adminPasswords;
  }
  get indexedAtEpoch() {
    return this.cfg.indexedAtEpoch;
  }

  // Threads
  get bigThreadDepth() {
    return this.cfg.bigThreadDepth;
  }
  get bigThreadUris() {
    return this.cfg.bigThreadUris;
  }
  get maxThreadParents() {
    return this.cfg.maxThreadParents;
  }
  get maxThreadDepth() {
    return this.cfg.maxThreadDepth;
  }
  get notificationsDelayMs() {
    return this.cfg.notificationsDelayMs;
  }

  // CDNs
  get videoCdn() {
    return this.cfg.videoCdn;
  }
  get mediaCdn() {
    return this.cfg.mediaCdn;
  }
  get thumbCdn() {
    return this.cfg.thumbCdn;
  }

  get dbUri() {
    return this.cfg.dbUri;
  }
  get dbName() {
    return this.cfg.dbName;
  }
  get dbUser() {
    return this.cfg.dbUser;
  }
  get dbPass() {
    return this.cfg.dbPass;
  }
  get relayUrl() {
    return this.cfg.relayUrl;
  }
  get plcUrl() {
    return this.cfg.plcUrl;
  }

  get labelsFromIssuerDids() {
    return this.cfg.labelsFromIssuerDids;
  }
}
