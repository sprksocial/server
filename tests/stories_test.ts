import { assertEquals } from "@std/assert";
import { createTestContext, TEST_USERS } from "./util.ts";

Deno.test({
  name: "Stories",
  sanitizeOps: false,
  sanitizeResources: false,
  fn: async (t) => {
    await t.step(
      "getStories excludes archived and expired stories",
      async () => {
        const { ctx, cleanup } = await createTestContext({
          actors: false,
          profiles: false,
          posts: false,
          replies: false,
          stories: true,
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
          const archivedUri = `at://${TEST_USERS[0].did}/app.sprk.story/story1`;
          const expiredUri = `at://${TEST_USERS[2].did}/app.sprk.story/story2`;
          const activeUri = `at://${TEST_USERS[1].did}/app.sprk.story/story3`;

          await ctx.db.models.Story.findOneAndUpdate(
            { uri: archivedUri },
            { archived: true },
          );

          const expiredDate = new Date();
          expiredDate.setHours(expiredDate.getHours() - 25);
          await ctx.db.models.Story.findOneAndUpdate(
            { uri: expiredUri },
            { indexedAt: expiredDate.toISOString() },
          );

          await ctx.db.models.Story.create({
            uri: activeUri,
            cid: "bafyreihivhfhv6rh4x4a4znkqrvqwp5xw4xvqjqstory3",
            authorDid: TEST_USERS[1].did,
            createdAt: new Date().toISOString(),
            indexedAt: new Date().toISOString(),
            media: {
              $type: "app.sprk.story#imageMedia",
              image: {
                $type: "blob",
                ref: {
                  $link: "bafyreihivhfhv6rh4x4a4znkqrvqwp5xw4xvqjqstoryimg3",
                },
                alt: "Active story image",
                aspectRatio: { width: 1080, height: 1920 },
                mimeType: "image/jpeg",
                size: 250000,
              },
            },
            labels: [],
          });

          const stories = await ctx.dataplane.stories.getStories([
            archivedUri,
            expiredUri,
            activeUri,
          ]);

          assertEquals(stories.length, 1);
          assertEquals(stories[0].uri, activeUri);
          assertEquals(stories[0].archived, false);
        } finally {
          await cleanup();
        }
      },
    );
  },
});
