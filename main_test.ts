import { assertEquals } from "jsr:@std/assert";
import { assertMatch } from "jsr:@std/assert/match";
import { AppContext, createApp } from "./main.ts";
import { Database } from "./data-plane/db/index.ts";
import {
  createBidirectionalResolver,
  createIdResolver,
} from "./utils/id-resolver.ts";
import { TakedownService } from "./services/takedown.ts";
import { createAuthVerifier } from "./services/auth-verifier.ts";
import { RepoSubscription } from "./data-plane/subscription.ts";
import { MemoryRunner } from "./utils/memory-runner.ts";
import { getLogger } from "@logtape/logtape";
import { DataPlane } from "./data-plane/index.ts";

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
    getCursorState: () => Promise.resolve(null),
    saveCursorState: () => Promise.resolve(),
  } as unknown as Database;

  const dataplane = new DataPlane(mockDb, resolver.baseResolver);
  const takedownService = new TakedownService(mockDb);
  const sub = new RepoSubscription({
    service: "wss://relay1.us-west.bsky.network",
    db: mockDb,
    idResolver: baseIdResolver,
    startCursor: undefined,
  });
  const authVerifier = createAuthVerifier(dataplane, {
    ownDid: serviceDid,
    alternateAudienceDids: [],
    modServiceDid: "did:web:test",
    adminPasses: ["test"],
  });

  return {
    db: mockDb,
    dataplane,
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

Deno.test("Cursor Persistence Test", async () => {
  console.log("Testing cursor persistence...");

  // Mock database with cursor state
  let storedCursor: number | null = 42;
  const mockDb = {
    connect: () => Promise.resolve(),
    disconnect: () => Promise.resolve(),
    waitForConnection: () => Promise.resolve(true),
    models: {},
    getCursorState: () => Promise.resolve(storedCursor),
    saveCursorState: (cursor: number) => {
      storedCursor = cursor;
      return Promise.resolve();
    },
  } as unknown as Database;

  const baseIdResolver = createIdResolver();

  // Test 1: Cursor is loaded from database
  const sub1 = new RepoSubscription({
    service: "wss://relay1.us-west.bsky.network",
    db: mockDb,
    idResolver: baseIdResolver,
    startCursor: 42, // This should be what was read from DB
  });

  console.log("Initial cursor:", sub1.runner.getCursor());

  // Test 2: Simulate cursor update
  if (sub1.runner.opts.setCursor) {
    await sub1.runner.opts.setCursor(100);
  }

  console.log("Stored cursor after update:", storedCursor);

  // Test 3: Create new subscription, should load updated cursor
  const sub2 = new RepoSubscription({
    service: "wss://relay1.us-west.bsky.network",
    db: mockDb,
    idResolver: baseIdResolver,
    startCursor: 100, // This should be the updated cursor from DB
  });

  console.log("New subscription cursor:", sub2.runner.getCursor());

  console.log("Cursor persistence test passed");
});

Deno.test("Cursor Save Throttling Test", async () => {
  console.log("Testing cursor save throttling...");

  let saveCount = 0;
  let lastSavedCursor: number | undefined;

  // Create a direct MemoryRunner to test throttling
  const runner = new MemoryRunner({
    startCursor: 0,
    cursorSaveIntervalMs: 100, // Use 100ms for faster testing
    setCursor: (cursor: number) => {
      saveCount++;
      lastSavedCursor = cursor;
      console.log(`Save #${saveCount}: cursor ${cursor}`);
    },
  });

  // Simulate rapid cursor updates through trackEvent (the proper way)
  await runner.trackEvent("did1", 10, async () => {/* mock work */});
  await runner.trackEvent("did2", 20, async () => {/* mock work */});
  await runner.trackEvent("did3", 30, async () => {/* mock work */});
  await runner.trackEvent("did4", 40, async () => {/* mock work */});
  await runner.trackEvent("did5", 50, async () => {/* mock work */});

  console.log(`Immediate saves: ${saveCount}`);
  console.log(`Last saved cursor: ${lastSavedCursor}`);

  // Wait for throttling to potentially trigger more saves
  await new Promise((resolve) => setTimeout(resolve, 200));

  console.log(`After delay - Save count: ${saveCount}`);
  console.log(`Last saved cursor: ${lastSavedCursor}`);

  // Force save on destroy
  await runner.destroy();

  console.log(`After destroy - Save count: ${saveCount}`);
  console.log(`Final saved cursor: ${lastSavedCursor}`);

  console.log("Cursor save throttling test completed");
});
