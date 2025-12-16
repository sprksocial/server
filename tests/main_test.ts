import { assertEquals } from "@std/assert";
import { assertMatch } from "@std/assert/match";
import { createMockApp, createMockContext } from "./util.ts";

Deno.test("Basic App Creation", async () => {
  const app = createMockApp();

  const res = await app.request("/", {
    headers: {
      "Content-Type": "application/json",
    },
  });

  assertEquals(res.status, 200);
});

Deno.test("Well Known Endpoint", async () => {
  const app = createMockApp();

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

Deno.test("Mock Context Creation", () => {
  const ctx = createMockContext();

  assertEquals(typeof ctx.db, "object");
  assertEquals(typeof ctx.dataplane, "object");
  assertEquals(typeof ctx.hydrator, "object");
  assertEquals(typeof ctx.views, "object");
  assertEquals(typeof ctx.authVerifier, "function"); // AuthVerifier is a callable function
  assertEquals(typeof ctx.logger, "object");
  assertEquals(typeof ctx.idResolver, "object");
  assertEquals(ctx.cfg.serverDid, "did:web:localhost");
});

Deno.test("Mock Context with Config Overrides", () => {
  const ctx = createMockContext({
    serverDid: "did:web:custom.test",
    adminPasswords: ["custom-password"],
  });

  assertEquals(ctx.cfg.serverDid, "did:web:custom.test");
  assertEquals(ctx.cfg.adminPasswords, ["custom-password"]);
});
