import { assertEquals } from "@std/assert";

import { createTestContext, EMPTY_TEST_DATA } from "./util.ts";

Deno.test({
  name: "Actor typeahead",
  sanitizeOps: false,
  sanitizeResources: false,
  fn: async (t) => {
    const { ctx, cleanup } = await createTestContext(EMPTY_TEST_DATA);

    try {
      await ctx.db.models.Actor.init();
      await ctx.db.models.Profile.init();

      const now = new Date().toISOString();
      const exactDid = "did:plc:exacthandle";
      const longerHandleDid = "did:plc:longerhandle";
      const secondLongerHandleDid = "did:plc:secondlongerhandle";
      const textMatchDid = "did:plc:textmatch";
      const viewerDid = "did:plc:viewer";

      await ctx.db.models.Actor.create([
        {
          did: exactDid,
          handle: "alice.test",
          indexedAt: now,
          keys: [],
          services: "[]",
        },
        {
          did: longerHandleDid,
          handle: "alice.testing",
          indexedAt: now,
          keys: [],
          services: "[]",
        },
        {
          did: secondLongerHandleDid,
          handle: "alice.testers",
          indexedAt: now,
          keys: [],
          services: "[]",
        },
        {
          did: textMatchDid,
          handle: "unrelated.social",
          indexedAt: now,
          keys: [],
          services: "[]",
        },
      ]);
      await ctx.db.models.Profile.create([
        {
          uri: `at://${exactDid}/app.bsky.actor.profile/self`,
          cid: "bafyreiexactprofile",
          authorDid: exactDid,
          createdAt: now,
          indexedAt: now,
          displayName: "Alice",
          followersCount: 1,
        },
        {
          uri: `at://${longerHandleDid}/app.bsky.actor.profile/self`,
          cid: "bafyreilongerprofile",
          authorDid: longerHandleDid,
          createdAt: now,
          indexedAt: now,
          displayName: "Popular Alice",
          followersCount: 100,
        },
        {
          uri: `at://${secondLongerHandleDid}/app.bsky.actor.profile/self`,
          cid: "bafyreisecondlongerprofile",
          authorDid: secondLongerHandleDid,
          createdAt: now,
          indexedAt: now,
          displayName: "More Popular Alice",
          followersCount: 200,
        },
        {
          uri: `at://${textMatchDid}/app.bsky.actor.profile/self`,
          cid: "bafyreitextprofile",
          authorDid: textMatchDid,
          createdAt: now,
          indexedAt: now,
          displayName: "Test Example",
        },
      ]);
      await ctx.db.models.Follow.create({
        uri: `at://${viewerDid}/app.bsky.graph.follow/longer-handle`,
        cid: "bafyreifollowlongerhandle",
        authorDid: viewerDid,
        createdAt: now,
        indexedAt: now,
        subject: longerHandleDid,
      });

      await t.step("uses profile text search for names", async () => {
        const result = await ctx.dataplane.search.actorsTypeahead("example");

        assertEquals(result.dids, [textMatchDid]);
      });

      await t.step(
        "does not broaden dotted handles into text terms",
        async () => {
          const result = await ctx.dataplane.search.actorsTypeahead(
            "alice.test",
          );

          assertEquals(result.dids, [
            exactDid,
            secondLongerHandleDid,
            longerHandleDid,
          ]);
        },
      );

      await t.step("keeps the exact handle with a small limit", async () => {
        const result = await ctx.dataplane.search.actorsTypeahead(
          "alice.test",
          1,
        );

        assertEquals(result.dids, [exactDid]);
      });

      await t.step(
        "keeps the exact handle ahead of followed candidates",
        async () => {
          const result = await ctx.dataplane.search.actorsTypeahead(
            "alice.test",
            3,
            viewerDid,
          );

          assertEquals(result.dids, [
            exactDid,
            longerHandleDid,
            secondLongerHandleDid,
          ]);
        },
      );
    } finally {
      await cleanup();
    }
  },
});
