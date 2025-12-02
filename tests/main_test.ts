import { assertEquals } from "@std/assert";
import { assertMatch } from "@std/assert/match";
import { createApp } from "../main.ts";
import { AppContext } from "../context.ts";
import { Database } from "../data-plane/db/index.ts";
import { createAuthVerifier } from "../auth-verifier.ts";
import { getLogger } from "@logtape/logtape";
import { DataPlane } from "../data-plane/index.ts";
import { Hydrator } from "../hydration/index.ts";
import { Views } from "../views/index.ts";
import { IdResolver } from "@atp/identity";
import { ServerConfig } from "../config.ts";

const cfg = new ServerConfig({
  relayUrl: "http://localhost:8080",
  serverDid: "did:web:localhost",
  modServiceDid: "did:web:test",
  adminPasswords: ["test"],
  privateKey:
    "5676df35fd3a185a1771a43536635ad90057e0c0d1fd91436344bb50ce23a460",
  publicUrl: "http://localhost:4000",
  alternateAudienceDids: [],
  bigThreadUris: new Set(["did:web:test"]),
  maxThreadParents: 10,
});

// Create a mock context for testing without database
function createMockContext(): AppContext {
  const appLogger = getLogger(["appview"]);
  const idResolver = new IdResolver();
  const serviceDid = "did:web:test";

  // Create mock database that doesn't actually connect
  const mockDb = {
    connect: () => Promise.resolve(),
    disconnect: () => Promise.resolve(),
    models: {},
    getCursorState: () => Promise.resolve(null),
    saveCursorState: () => Promise.resolve(),
  } as unknown as Database;

  const dataplane = new DataPlane(mockDb, idResolver);
  const hydrator = new Hydrator(dataplane);
  const views = new Views(cfg);
  const authVerifier = createAuthVerifier(dataplane, {
    ownDid: serviceDid,
    alternateAudienceDids: [],
    modServiceDid: "did:web:test",
    adminPasses: ["test"],
  });

  return {
    db: mockDb,
    dataplane,
    hydrator,
    views,
    logger: appLogger,
    idResolver,
    cfg,
    authVerifier,
  };
}

Deno.test("Basic App Creation", async () => {
  const ctx = createMockContext();
  const app = createApp(ctx);

  const res = await app.request("/", {
    headers: {
      "Content-Type": "application/json",
    },
  });

  assertEquals(res.status, 200);
});

Deno.test("Well Known Endpoint", async () => {
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
});
