import { assertEquals } from "@std/assert";
import { createTestApp, TEST_USERS } from "./util.ts";
import { $OutputBody as SearchAudiosOutput } from "../lex/so/sprk/sound/searchAudios.ts";

const VALID_BLOB_CID =
  "bafyreihdwdcefgh4dqkjv67uzcmw7ojee6xedzdetojuzjevtenxquvyku";

Deno.test({
  name: "Sound search",
  sanitizeOps: false,
  sanitizeResources: false,
  fn: async (t) => {
    const { app, ctx, cleanup } = await createTestApp({
      actors: false,
      profiles: false,
      posts: false,
      replies: false,
      stories: false,
      likes: false,
      reposts: false,
      follows: false,
      blocks: false,
      audio: false,
      generators: false,
      preferences: false,
      records: false,
      actorSync: false,
    });

    try {
      await ctx.db.models.Audio.init();
      await ctx.db.models.Profile.init();

      const nowIso = new Date().toISOString();
      const authorDid = TEST_USERS[1].did;
      const chillUri = `at://${authorDid}/so.sprk.sound.audio/chill`;
      const summerUri = `at://${authorDid}/so.sprk.sound.audio/summer`;

      await ctx.db.models.Actor.create({
        did: authorDid,
        handle: "sound-author.test",
        indexedAt: nowIso,
        keys: [],
        services: "[]",
      });
      await ctx.db.models.Profile.create({
        uri: `at://${authorDid}/app.bsky.actor.profile/self`,
        cid: VALID_BLOB_CID,
        authorDid,
        createdAt: nowIso,
        indexedAt: nowIso,
        displayName: "Sound Author",
        labels: [],
        postsCount: 0,
        followersCount: 0,
        followsCount: 0,
      });

      const chillRecord = {
        $type: "so.sprk.sound.audio",
        sound: {
          $type: "blob",
          ref: { $link: VALID_BLOB_CID },
          mimeType: "audio/mpeg",
          size: 12345,
        },
        title: "Chill Beats",
        details: { artist: "Desk Coders", title: "Relaxing music" },
        createdAt: nowIso,
      };
      const summerRecord = {
        $type: "so.sprk.sound.audio",
        sound: {
          $type: "blob",
          ref: { $link: VALID_BLOB_CID },
          mimeType: "audio/mpeg",
          size: 12345,
        },
        title: "Summer Vibes",
        details: { artist: "Beach Club", title: "Upbeat summer track" },
        createdAt: nowIso,
      };

      await ctx.db.models.Audio.create([
        {
          uri: chillUri,
          cid: VALID_BLOB_CID,
          authorDid,
          createdAt: nowIso,
          indexedAt: nowIso,
          sound: chillRecord.sound,
          title: chillRecord.title,
          details: chillRecord.details,
          labels: [],
          useCount: 10,
        },
        {
          uri: summerUri,
          cid: VALID_BLOB_CID,
          authorDid,
          createdAt: nowIso,
          indexedAt: nowIso,
          sound: summerRecord.sound,
          title: summerRecord.title,
          details: summerRecord.details,
          labels: [],
          useCount: 5,
        },
      ]);

      await ctx.db.models.Record.create([
        {
          uri: chillUri,
          cid: VALID_BLOB_CID,
          did: authorDid,
          collectionName: "so.sprk.sound.audio",
          rkey: "chill",
          createdAt: nowIso,
          indexedAt: nowIso,
          json: JSON.stringify(chillRecord),
          takenDown: false,
        },
        {
          uri: summerUri,
          cid: VALID_BLOB_CID,
          did: authorDid,
          collectionName: "so.sprk.sound.audio",
          rkey: "summer",
          createdAt: nowIso,
          indexedAt: nowIso,
          json: JSON.stringify(summerRecord),
          takenDown: false,
        },
      ]);

      await t.step("searches sounds by title", async () => {
        const res = await app.request(
          "/xrpc/so.sprk.sound.searchAudios?q=summer",
        );
        assertEquals(res.status, 200);

        const body = await res.json() as SearchAudiosOutput;
        assertEquals(body.audios.length, 1);
        assertEquals(body.audios[0].uri, summerUri);
        assertEquals(body.audios[0].title, "Summer Vibes");
      });

      await t.step("searches sounds by artist details", async () => {
        const res = await app.request(
          "/xrpc/so.sprk.sound.searchAudios?q=coders",
        );
        assertEquals(res.status, 200);

        const body = await res.json() as SearchAudiosOutput;
        assertEquals(body.audios.length, 1);
        assertEquals(body.audios[0].uri, chillUri);
      });

      await t.step("searches sounds by author handle", async () => {
        const res = await app.request(
          "/xrpc/so.sprk.sound.searchAudios?q=@sound-author",
        );
        assertEquals(res.status, 200);

        const body = await res.json() as SearchAudiosOutput;
        assertEquals(body.audios.length, 2);
        assertEquals(body.audios[0].uri, chillUri);
        assertEquals(body.audios[1].uri, summerUri);
      });

      await t.step("searches sounds by author display name", async () => {
        const res = await app.request(
          "/xrpc/so.sprk.sound.searchAudios?q=author",
        );
        assertEquals(res.status, 200);

        const body = await res.json() as SearchAudiosOutput;
        assertEquals(body.audios.length, 2);
        assertEquals(body.audios[0].uri, chillUri);
        assertEquals(body.audios[1].uri, summerUri);
      });

      await t.step("returns an empty result for blank queries", async () => {
        const res = await app.request(
          `/xrpc/so.sprk.sound.searchAudios?q=${encodeURIComponent("   ")}`,
        );
        assertEquals(res.status, 200);

        const body = await res.json() as SearchAudiosOutput;
        assertEquals(body.audios, []);
      });
    } finally {
      await cleanup();
    }
  },
});
