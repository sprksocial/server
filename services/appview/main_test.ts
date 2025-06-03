import { assertEquals } from "jsr:@std/assert";
import app from "./main.ts";
import { assertMatch } from "jsr:@std/assert/match";

const testEnv = {
  SERVICE_DID: "did:web:test",
  MOD_SERVICE_DID: "did:web:test",
  ADMIN_PASSWORD: "test",
};
Deno.test("Server Running", async () => {
  const res = await app.request("/", {
    headers: {
      "Content-Type": "application/json",
    },
  }, testEnv);

  assertEquals(res.status, 200);
});

Deno.test("Well Known", async () => {
  const res = await app.request("/.well-known/did.json", {
    headers: {
      "Content-Type": "application/json",
    },
  }, testEnv);

  assertMatch(
    await res.text(),
    new RegExp(
      [
        "^\\{",
        '"@context":\\["https://www\\.w3\\.org/ns/did/v1"\\],',
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
