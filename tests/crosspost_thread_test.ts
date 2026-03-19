import { assertEquals } from "@std/assert";
import { createTestApp, TEST_USERS } from "./util.ts";
import { OutputSchema } from "../lex/types/so/sprk/feed/getCrosspostThread.ts";

Deno.test({
  name: "Crosspost thread endpoint",
  sanitizeOps: false,
  sanitizeResources: false,
  fn: async (t) => {
    const { app, ctx, cleanup } = await createTestApp({
      actors: true,
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
      const parentUri = `at://${TEST_USERS[0].did}/so.sprk.feed.post/post1`;
      const validCid =
        "bafyreihdwdcefgh4dqkjv67uzcmw7ojee6xedzdetojuzjevtenxquvyku";
      const parentCid = validCid;
      const reply1Uri = `at://${TEST_USERS[1].did}/app.bsky.feed.post/cross1`;
      const reply2Uri = `at://${TEST_USERS[2].did}/app.bsky.feed.post/cross2`;
      const reply3Uri = `at://${TEST_USERS[2].did}/app.bsky.feed.post/cross3`;
      const reply4Uri = `at://${TEST_USERS[3].did}/app.bsky.feed.post/cross4`;
      const cycleAUri = `at://${TEST_USERS[1].did}/app.bsky.feed.post/cycleA`;
      const cycleBUri = `at://${TEST_USERS[2].did}/app.bsky.feed.post/cycleB`;
      const reply1Cid = validCid;
      const reply2Cid = validCid;
      const reply3Cid = validCid;
      const reply4Cid = validCid;
      const cycleACid = validCid;
      const cycleBCid = validCid;

      const time0 = new Date("2026-01-01T00:00:00.000Z").toISOString();
      const time1 = new Date("2026-01-01T00:01:00.000Z").toISOString();
      const time2 = new Date("2026-01-01T00:02:00.000Z").toISOString();
      const time3 = new Date("2026-01-01T00:03:00.000Z").toISOString();
      const time4 = new Date("2026-01-01T00:04:00.000Z").toISOString();
      const time5 = new Date("2026-01-01T00:05:00.000Z").toISOString();
      const time6 = new Date("2026-01-01T00:06:00.000Z").toISOString();

      await ctx.db.models.Post.create({
        uri: parentUri,
        cid: parentCid,
        authorDid: TEST_USERS[0].did,
        caption: { text: "root" },
        media: {
          $type: "so.sprk.media.images",
          images: [],
        },
        createdAt: time0,
        indexedAt: time0,
        likeCount: 1,
        replyCount: 2,
        repostCount: 0,
      });

      await ctx.db.models.CrosspostReply.create([
        {
          uri: reply1Uri,
          cid: reply1Cid,
          authorDid: TEST_USERS[1].did,
          text: "reply-1",
          reply: {
            root: { uri: parentUri, cid: parentCid },
            parent: { uri: parentUri, cid: parentCid },
          },
          createdAt: time1,
          indexedAt: time1,
          likeCount: 2,
          replyCount: 1,
        },
        {
          uri: reply2Uri,
          cid: reply2Cid,
          authorDid: TEST_USERS[2].did,
          text: "reply-2",
          reply: {
            root: { uri: parentUri, cid: parentCid },
            parent: { uri: reply1Uri, cid: reply1Cid },
          },
          createdAt: time2,
          indexedAt: time2,
          likeCount: 3,
          replyCount: 0,
        },
        {
          uri: reply3Uri,
          cid: reply3Cid,
          authorDid: TEST_USERS[2].did,
          text: "reply-3",
          reply: {
            root: { uri: parentUri, cid: parentCid },
            parent: { uri: parentUri, cid: parentCid },
          },
          createdAt: time3,
          indexedAt: time3,
          likeCount: 1,
          replyCount: 0,
        },
        {
          uri: reply4Uri,
          cid: reply4Cid,
          authorDid: TEST_USERS[3].did,
          text: "reply-4",
          reply: {
            root: { uri: parentUri, cid: parentCid },
            parent: { uri: parentUri, cid: parentCid },
          },
          createdAt: time4,
          indexedAt: time4,
          likeCount: 10,
          replyCount: 0,
        },
        {
          uri: cycleAUri,
          cid: cycleACid,
          authorDid: TEST_USERS[1].did,
          text: "cycle-a",
          reply: {
            root: { uri: parentUri, cid: parentCid },
            parent: { uri: cycleBUri, cid: cycleBCid },
          },
          createdAt: time5,
          indexedAt: time5,
          likeCount: 0,
          replyCount: 0,
        },
        {
          uri: cycleBUri,
          cid: cycleBCid,
          authorDid: TEST_USERS[2].did,
          text: "cycle-b",
          reply: {
            root: { uri: parentUri, cid: parentCid },
            parent: { uri: cycleAUri, cid: cycleACid },
          },
          createdAt: time6,
          indexedAt: time6,
          likeCount: 0,
          replyCount: 0,
        },
      ]);

      const blockUri = `at://${TEST_USERS[1].did}/so.sprk.graph.block/block1`;
      await ctx.db.models.Block.create({
        uri: blockUri,
        cid: validCid,
        authorDid: TEST_USERS[1].did,
        subject: TEST_USERS[2].did,
        createdAt: time6,
        indexedAt: time6,
      });

      await t.step(
        "returns thread-style descendants from a post anchor",
        async () => {
          const res = await app.request(
            `/xrpc/so.sprk.feed.getCrosspostThread?anchor=${
              encodeURIComponent(parentUri)
            }&depth=5&parentHeight=5&sort=oldest&limit=50`,
          );
          assertEquals(res.status, 200);

          const body = await res.json() as OutputSchema;
          assertEquals(body.thread.length, 5);
          assertEquals(body.thread[0].uri, parentUri);
          assertEquals(body.thread[0].depth, 0);
          assertEquals(body.thread[1].uri, reply1Uri);
          assertEquals(body.thread[1].depth, 1);
          assertEquals(body.thread[2].uri, reply3Uri);
          assertEquals(body.thread[2].depth, 1);
          assertEquals(body.thread[3].uri, reply4Uri);
          assertEquals(body.thread[3].depth, 1);
          assertEquals(body.thread[4].uri, reply2Uri);
          assertEquals(body.thread[4].depth, 2);
        },
      );

      await t.step("applies limit and cursor pagination", async () => {
        const firstRes = await app.request(
          `/xrpc/so.sprk.feed.getCrosspostThread?anchor=${
            encodeURIComponent(parentUri)
          }&depth=5&parentHeight=5&sort=oldest&limit=2`,
        );
        assertEquals(firstRes.status, 200);
        const firstBody = await firstRes.json() as OutputSchema;
        assertEquals(firstBody.thread.length, 2);
        assertEquals(firstBody.thread[0].uri, parentUri);
        assertEquals(firstBody.thread[1].uri, reply1Uri);
        assertEquals(firstBody.cursor, "2");

        const secondRes = await app.request(
          `/xrpc/so.sprk.feed.getCrosspostThread?anchor=${
            encodeURIComponent(parentUri)
          }&depth=5&parentHeight=5&sort=oldest&limit=2&cursor=${firstBody.cursor}`,
        );
        assertEquals(secondRes.status, 200);
        const secondBody = await secondRes.json() as OutputSchema;
        assertEquals(secondBody.thread.length, 2);
        assertEquals(secondBody.thread[0].uri, reply3Uri);
        assertEquals(secondBody.thread[1].uri, reply4Uri);
        assertEquals(secondBody.cursor, "4");

        const thirdRes = await app.request(
          `/xrpc/so.sprk.feed.getCrosspostThread?anchor=${
            encodeURIComponent(parentUri)
          }&depth=5&parentHeight=5&sort=oldest&limit=2&cursor=${secondBody.cursor}`,
        );
        assertEquals(thirdRes.status, 200);
        const thirdBody = await thirdRes.json() as OutputSchema;
        assertEquals(thirdBody.thread.length, 1);
        assertEquals(thirdBody.thread[0].uri, reply2Uri);
        assertEquals(thirdBody.cursor, undefined);
      });

      await t.step("respects newest sibling ordering", async () => {
        const res = await app.request(
          `/xrpc/so.sprk.feed.getCrosspostThread?anchor=${
            encodeURIComponent(parentUri)
          }&depth=1&parentHeight=5&sort=newest&limit=50`,
        );
        assertEquals(res.status, 200);

        const body = await res.json() as OutputSchema;
        assertEquals(body.thread.length, 4);
        assertEquals(body.thread[0].uri, parentUri);
        assertEquals(body.thread[1].uri, reply4Uri);
        assertEquals(body.thread[2].uri, reply3Uri);
        assertEquals(body.thread[3].uri, reply1Uri);
      });

      await t.step("respects top sibling ordering", async () => {
        const res = await app.request(
          `/xrpc/so.sprk.feed.getCrosspostThread?anchor=${
            encodeURIComponent(parentUri)
          }&depth=1&parentHeight=5&sort=top&limit=50`,
        );
        assertEquals(res.status, 200);

        const body = await res.json() as OutputSchema;
        assertEquals(body.thread.length, 4);
        assertEquals(body.thread[0].uri, parentUri);
        assertEquals(body.thread[1].uri, reply4Uri);
        assertEquals(body.thread[2].uri, reply1Uri);
        assertEquals(body.thread[3].uri, reply3Uri);
      });

      await t.step("includes ancestors for reply anchor", async () => {
        const res = await app.request(
          `/xrpc/so.sprk.feed.getCrosspostThread?anchor=${
            encodeURIComponent(reply2Uri)
          }&depth=0&parentHeight=5&sort=oldest&limit=50`,
        );
        assertEquals(res.status, 200);

        const body = await res.json() as OutputSchema;
        assertEquals(body.thread.length, 3);
        assertEquals(body.thread[0].uri, parentUri);
        assertEquals(body.thread[0].depth, -2);
        assertEquals(body.thread[1].uri, reply1Uri);
        assertEquals(body.thread[1].depth, -1);
        assertEquals(body.thread[2].uri, reply2Uri);
        assertEquals(body.thread[2].depth, 0);
      });

      await t.step("applies parent/root 3p-block moderation", async () => {
        const res = await app.request(
          `/xrpc/so.sprk.feed.getCrosspostThread?anchor=${
            encodeURIComponent(parentUri)
          }&depth=5&parentHeight=5&sort=oldest&limit=50`,
        );
        assertEquals(res.status, 200);

        const body = await res.json() as OutputSchema;
        const blocked = body.thread.find((item) => item.uri === reply2Uri);
        assertEquals(
          blocked?.value.$type,
          "so.sprk.feed.defs#blockedPost",
        );
      });

      await t.step(
        "hides taken-down thread records for standard viewers",
        async () => {
          await ctx.db.models.Record.create({
            uri: reply4Uri,
            cid: reply4Cid,
            did: TEST_USERS[3].did,
            collectionName: "app.bsky.feed.post",
            rkey: "cross4",
            createdAt: time4,
            indexedAt: time4,
            json: JSON.stringify({
              $type: "app.bsky.feed.post",
              text: "reply-4",
              createdAt: time4,
            }),
            takedownRef: "TAKEDOWN",
          });

          const res = await app.request(
            `/xrpc/so.sprk.feed.getCrosspostThread?anchor=${
              encodeURIComponent(parentUri)
            }&depth=5&parentHeight=5&sort=oldest&limit=50`,
          );
          assertEquals(res.status, 200);
          const body = await res.json() as OutputSchema;
          assertEquals(
            body.thread.some((item) => item.uri === reply4Uri),
            false,
          );
        },
      );

      await t.step(
        "stops on cyclic ancestors and keeps anchor at depth 0",
        async () => {
          const res = await app.request(
            `/xrpc/so.sprk.feed.getCrosspostThread?anchor=${
              encodeURIComponent(cycleAUri)
            }&depth=0&parentHeight=10&sort=oldest&limit=50`,
          );
          assertEquals(res.status, 200);

          const body = await res.json() as OutputSchema;
          assertEquals(body.thread.length, 2);
          assertEquals(body.thread[0].uri, cycleBUri);
          assertEquals(body.thread[0].depth, -1);
          assertEquals(body.thread[1].uri, cycleAUri);
          assertEquals(body.thread[1].depth, 0);
        },
      );
    } finally {
      await cleanup();
    }
  },
});
