import { assertEquals } from "@std/assert";
import { createTestApp, TEST_USERS } from "./util.ts";
import { $OutputBody } from "../lex/so/sprk/feed/getLikes.ts";

Deno.test({
  name: "getLikes endpoint",
  sanitizeOps: false,
  sanitizeResources: false,
  fn: async (t) => {
    const { app, ctx, cleanup } = await createTestApp({
      actors: true,
      profiles: true,
      posts: true,
      replies: false,
      stories: false,
      likes: true,
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
      const postUri = `at://${TEST_USERS[0].did}/app.sprk.post/post1`;
      const postCid =
        "bafyreihdwdcefgh4dqkjv67uzcmw7ojee6xedzdetojuzjevtenxquvyku";
      const otherCid =
        "bafyreicb5k4mmdf3nm42h6jp7dqz7hd23w5g7xeykvw7q74dgqg7b5ykva";

      await ctx.db.models.Like.updateMany(
        { subject: postUri },
        { subjectCid: postCid },
      );

      await t.step("returns actors who liked a post", async () => {
        const params = new URLSearchParams({ uri: postUri });
        const res = await app.request(
          `/xrpc/so.sprk.feed.getLikes?${params.toString()}`,
        );

        assertEquals(res.status, 200);
        const body = await res.json() as $OutputBody;
        assertEquals(body.uri, postUri);
        assertEquals(body.likes.length, 2);
        assertEquals(
          body.likes.map((like) => String(like.actor.did)),
          [TEST_USERS[2].did, TEST_USERS[1].did],
        );
        assertEquals(String(body.likes[0].actor.handle), TEST_USERS[2].handle);
        assertEquals(typeof body.likes[0].createdAt, "string");
        assertEquals(typeof body.likes[0].indexedAt, "string");
      });

      await t.step("filters likes by subject CID", async () => {
        const params = new URLSearchParams({ uri: postUri, cid: postCid });
        const res = await app.request(
          `/xrpc/so.sprk.feed.getLikes?${params.toString()}`,
        );

        assertEquals(res.status, 200);
        const body = await res.json() as $OutputBody;
        assertEquals(body.cid, postCid);
        assertEquals(body.likes.length, 2);
      });

      await t.step("returns no likes for a different subject CID", async () => {
        const params = new URLSearchParams({
          uri: postUri,
          cid: otherCid,
        });
        const res = await app.request(
          `/xrpc/so.sprk.feed.getLikes?${params.toString()}`,
        );

        assertEquals(res.status, 200);
        const body = await res.json() as $OutputBody;
        assertEquals(body.likes, []);
      });
    } finally {
      await cleanup();
    }
  },
});
