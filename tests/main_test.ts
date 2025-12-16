import { assertEquals } from "@std/assert";
import { assertMatch } from "@std/assert/match";
import { createMockApp, createMockContext } from "./util.ts";
import { createApp } from "../main.ts";

Deno.test("Basic Endpoints", async (t) => {
  const app = createMockApp();
  await t.step("/", async () => {
    const res = await app.request("/", {
      headers: {
        "Content-Type": "application/json",
      },
    });

    assertEquals(res.status, 200);
  });
  await t.step("/.well-known/did.json", async () => {
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
});

Deno.test("Health Check", async (t) => {
  await t.step("succeeds when DB is healthy", async () => {
    const ctx = createMockContext();
    ctx.db.ping = () => Promise.resolve();

    const app = createApp(ctx);
    const res = await app.request("/xrpc/_health");

    assertEquals(res.status, 200);
    const body = await res.json();
    assertEquals(typeof body.version, "string");
    assertEquals(body.error, undefined);
  });

  await t.step("returns 503 when DB is unavailable", async () => {
    const ctx = createMockContext();
    ctx.db.ping = () => Promise.reject(new Error("Connection failed"));

    const app = createApp(ctx);
    const res = await app.request("/xrpc/_health");

    assertEquals(res.status, 503);
    const body = await res.json();
    assertEquals(typeof body.version, "string");
    assertEquals(body.error, "Database not connected");
  });
});
