import { assert, assertEquals } from "@std/assert";

import { standardAudienceDidsFrom } from "../auth-verifier.ts";

Deno.test("standardAudienceDidsFrom accepts service-fragment audiences", () => {
  const audiences = standardAudienceDidsFrom([
    "did:web:api.sprk.so",
    "did:web:alt.sprk.so#sprk_appview",
  ]);

  assert(audiences.has("did:web:api.sprk.so"));
  assert(audiences.has("did:web:api.sprk.so#sprk_appview"));
  assert(audiences.has("did:web:alt.sprk.so#sprk_appview"));
  assertEquals(audiences.has("did:web:api.sprk.so#other_service"), false);
  assertEquals(audiences.has("did:web:alt.sprk.so"), false);
});
