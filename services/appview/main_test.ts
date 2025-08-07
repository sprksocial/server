import { assertEquals } from "jsr:@std/assert";
import { assertMatch } from "jsr:@std/assert/match";
import { AppContext, createApp } from "./main.ts";
import { Database } from "./data-plane/server/index.ts";
import {
  createBidirectionalResolver,
  createIdResolver,
} from "./utils/id-resolver.ts";
import { TakedownService } from "./services/takedown.ts";
import { createAuthVerifier } from "./services/auth-verifier.ts";
import { RepoSubscription } from "./data-plane/server/subscription.ts";
import { configure, getConsoleSink, getLogger } from "@logtape/logtape";

await configure({
  sinks: { console: getConsoleSink() },
  loggers: [
    { category: "appview", lowestLevel: "debug", sinks: ["console"] },
  ],
});

Deno.env.set("SERVICE_DID", "did:web:test");
Deno.env.set("MOD_SERVICE_DID", "did:web:test");
Deno.env.set("ADMIN_PASSWORD", "test");
Deno.env.set(
  "APPVIEW_K256_PRIVATE_KEY_HEX",
  "5676df35fd3a185a1771a43536635ad90057e0c0d1fd91436344bb50ce23a460", // random valid test key
);

// Create a mock context for testing without database
function createMockContext(): AppContext {
  const appLogger = getLogger(["appview"]);
  const baseIdResolver = createIdResolver();
  const resolver = createBidirectionalResolver(baseIdResolver);
  const serviceDid = "did:web:test";

  // Create mock database that doesn't actually connect
  const mockDb = {
    connect: () => Promise.resolve(),
    disconnect: () => Promise.resolve(),
    models: {},
  } as unknown as Database;

  const takedownService = new TakedownService(mockDb);
  const sub = new RepoSubscription({
    service: "wss://relay1.us-west.bsky.network",
    db: mockDb,
    idResolver: baseIdResolver,
  });
  const authVerifier = createAuthVerifier(mockDb, {
    ownDid: serviceDid,
    alternateAudienceDids: [],
    modServiceDid: "did:web:test",
    adminPasses: ["test"],
  });

  return {
    db: mockDb,
    logger: appLogger,
    resolver,
    serviceDid,
    didResolver: baseIdResolver.did,
    takedownService,
    sub,
    authVerifier,
  };
}

Deno.test("Basic App Creation", async () => {
  console.log("Testing basic app creation...");

  const ctx = createMockContext();
  const app = createApp(ctx);

  console.log("App created successfully");

  const res = await app.request("/", {
    headers: {
      "Content-Type": "application/json",
    },
  });

  assertEquals(res.status, 200);
  console.log("Basic app test passed");
});

Deno.test("Well Known Endpoint", async () => {
  console.log("Testing well-known endpoint...");

  const ctx = createMockContext();
  const app = createApp(ctx);

  const res = await app.request("/.well-known/did.json", {
    headers: {
      "Content-Type": "application/json",
    },
  });

  assertMatch(
    await res.text(),
    new RegExp(
      [
        "^\\{",
        '"@context":\\["https://www\\.w3\\.org/ns/did/v1","https://w3id\\.org/security/multikey/v1"\\],',
        '"id":"(did:web:[^"]+)",',
        '"verificationMethod":\\[\\{',
        '"id":"\\1#atproto",',
        '"type":"Multikey",',
        '"controller":"\\1",',
        '"publicKeyMultibase":"[a-zA-Z0-9]+"',
        "\\}\\],",
        '"service":\\[\\{',
        '"id":"#sprk_appview",',
        '"type":"SprkAppView",',
        '"serviceEndpoint":"https?://[^"]+"',
        "\\}\\]",
        "\\}$",
      ].join(""),
    ),
  );
  console.log("Well-known endpoint test passed");
});
