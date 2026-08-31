import { assertEquals } from "@std/assert";

import { createTestContext, EMPTY_TEST_DATA } from "./util.ts";

Deno.test({
  name: "Actor search",
  sanitizeOps: false,
  sanitizeResources: false,
  fn: async (t) => {
    const { ctx, cleanup } = await createTestContext(EMPTY_TEST_DATA);

    try {
      await ctx.db.models.Actor.init();
      await ctx.db.models.Profile.init();

      const actors = Array.from({ length: 6 }, (_, index) => {
        const suffix = String(index).padStart(2, "0");
        return {
          did: `did:plc:search${suffix}`,
          handle: index % 2 === 0
            ? `search-${suffix}.test`
            : `unrelated-${suffix}.test`,
          indexedAt: new Date(Date.UTC(2026, 0, 1, 0, 0, index)).toISOString(),
          keys: [],
          services: "[]",
        };
      });

      await ctx.db.models.Actor.create(actors);
      await ctx.db.models.Profile.create(actors.map((actor, index) => ({
        uri: `at://${actor.did}/app.bsky.actor.profile/self`,
        cid: `bafyreiactorsearch${index}`,
        authorDid: actor.did,
        createdAt: actor.indexedAt,
        indexedAt: actor.indexedAt,
        displayName: index % 2 === 1 ? `Search Result ${index}` : undefined,
      })));

      await t.step("combines and deduplicates bounded candidates", async () => {
        const result = await ctx.dataplane.search.actors("search", 4);

        assertEquals(result.dids, [
          "did:plc:search05",
          "did:plc:search04",
          "did:plc:search03",
          "did:plc:search02",
        ]);
        assertEquals(typeof result.cursor, "string");
      });

      await t.step("paginates without repeating candidates", async () => {
        const firstPage = await ctx.dataplane.search.actors("search", 2);
        const secondPage = await ctx.dataplane.search.actors(
          "search",
          2,
          firstPage.cursor,
        );

        assertEquals(firstPage.dids, [
          "did:plc:search05",
          "did:plc:search04",
        ]);
        assertEquals(secondPage.dids, [
          "did:plc:search03",
          "did:plc:search02",
        ]);
      });

      await t.step(
        "selects bounded handle candidates in result order",
        async () => {
          await Promise.all([
            ctx.db.models.Actor.deleteMany({}),
            ctx.db.models.Profile.deleteMany({}),
          ]);

          const overflowActors = Array.from({ length: 101 }, (_, index) => {
            const suffix = String(index).padStart(3, "0");
            const indexedAt = new Date(
              Date.UTC(2026, 0, 2, 0, 0, 100 - index),
            ).toISOString();
            return {
              did: `did:plc:overflowhandle${suffix}`,
              handle: `overflow-${suffix}.test`,
              indexedAt,
              keys: [],
              services: "[]",
            };
          });

          await ctx.db.models.Actor.create(overflowActors);
          await ctx.db.models.Profile.create(
            overflowActors.map((actor, index) => ({
              uri: `at://${actor.did}/app.bsky.actor.profile/self`,
              cid: `bafyreioverflowhandle${actor.did.slice(-3)}`,
              authorDid: actor.did,
              createdAt: actor.indexedAt,
              indexedAt: new Date(
                Date.UTC(2026, 0, 2, 0, 0, index),
              ).toISOString(),
            })),
          );

          const result = await ctx.dataplane.search.actors("overflow", 1);

          assertEquals(result.dids, ["did:plc:overflowhandle100"]);
        },
      );

      await t.step(
        "selects bounded text candidates in result order",
        async () => {
          await Promise.all([
            ctx.db.models.Actor.deleteMany({}),
            ctx.db.models.Profile.deleteMany({}),
          ]);

          const overflowActors = Array.from({ length: 101 }, (_, index) => {
            const suffix = String(index).padStart(3, "0");
            const indexedAt = new Date(
              Date.UTC(2026, 0, 3, 0, 0, index),
            ).toISOString();
            return {
              did: `did:plc:overflowtext${suffix}`,
              handle: `unrelated-${suffix}.test`,
              indexedAt,
              keys: [],
              services: "[]",
            };
          });

          await ctx.db.models.Actor.create(overflowActors);
          await ctx.db.models.Profile.create(overflowActors.map((actor) => ({
            uri: `at://${actor.did}/app.bsky.actor.profile/self`,
            cid: `bafyreioverflowtext${actor.did.slice(-3)}`,
            authorDid: actor.did,
            createdAt: actor.indexedAt,
            indexedAt: actor.indexedAt,
            displayName: "Needle Overflow",
          })));

          const result = await ctx.dataplane.search.actors("needle", 1);

          assertEquals(result.dids, ["did:plc:overflowtext100"]);
        },
      );
    } finally {
      await cleanup();
    }
  },
});

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
