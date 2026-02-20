import { assertEquals } from "@std/assert";
import { createTestContext, TEST_USERS } from "./util.ts";

const VALID_BLOB_CID =
  "bafyreihdwdcefgh4dqkjv67uzcmw7ojee6xedzdetojuzjevtenxquvyku";

Deno.test({
  name: "Stories",
  sanitizeOps: false,
  sanitizeResources: false,
  fn: async (t) => {
    await t.step(
      "getStories excludes expired stories",
      async () => {
        const { ctx, cleanup } = await createTestContext({
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
          const expiredUri = `at://${
            TEST_USERS[2].did
          }/so.sprk.story.post/story2`;
          const activeUri = `at://${
            TEST_USERS[1].did
          }/so.sprk.story.post/story3`;

          const expiredDate = new Date();
          expiredDate.setHours(expiredDate.getHours() - 25);
          await ctx.db.models.Story.create({
            uri: expiredUri,
            cid: "bafyreihivhfhv6rh4x4a4znkqrvqwp5xw4xvqjqstory2",
            authorDid: TEST_USERS[2].did,
            createdAt: expiredDate.toISOString(),
            indexedAt: expiredDate.toISOString(),
            media: {
              $type: "so.sprk.media.image",
              image: {
                $type: "blob",
                ref: {
                  $link: VALID_BLOB_CID,
                },
                alt: "Expired story image",
                aspectRatio: { width: 1080, height: 1920 },
                mimeType: "image/jpeg",
                size: 250000,
              },
              alt: "Expired story image",
              aspectRatio: { width: 1080, height: 1920 },
            },
            labels: [],
          });

          await ctx.db.models.Story.create({
            uri: activeUri,
            cid: "bafyreihivhfhv6rh4x4a4znkqrvqwp5xw4xvqjqstory3",
            authorDid: TEST_USERS[1].did,
            createdAt: new Date().toISOString(),
            indexedAt: new Date().toISOString(),
            media: {
              $type: "so.sprk.media.image",
              image: {
                $type: "blob",
                ref: {
                  $link: VALID_BLOB_CID,
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

    await t.step(
      "getTimeline excludes expired stories from the viewer",
      async () => {
        const { ctx, cleanup } = await createTestContext({
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
          const viewerDid = TEST_USERS[0].did;
          const expiredUri = `at://${viewerDid}/so.sprk.story.post/expired`;
          const activeUri = `at://${viewerDid}/so.sprk.story.post/active`;

          const expiredDate = new Date();
          expiredDate.setHours(expiredDate.getHours() - 25);

          await ctx.db.models.Story.create({
            uri: expiredUri,
            cid: "bafyreihivhfhv6rh4x4a4znkqrvqwp5xw4xvqjqexpired",
            authorDid: viewerDid,
            createdAt: expiredDate.toISOString(),
            indexedAt: expiredDate.toISOString(),
            media: {
              $type: "so.sprk.media.image",
              image: {
                $type: "blob",
                ref: {
                  $link: VALID_BLOB_CID,
                },
                alt: "Expired viewer story image",
                aspectRatio: { width: 1080, height: 1920 },
                mimeType: "image/jpeg",
                size: 250000,
              },
            },
            labels: [],
          });

          await ctx.db.models.Story.create({
            uri: activeUri,
            cid: "bafyreihivhfhv6rh4x4a4znkqrvqwp5xw4xvqjqactive",
            authorDid: viewerDid,
            createdAt: new Date().toISOString(),
            indexedAt: new Date().toISOString(),
            media: {
              $type: "so.sprk.media.image",
              image: {
                $type: "blob",
                ref: {
                  $link: VALID_BLOB_CID,
                },
                alt: "Active viewer story image",
                aspectRatio: { width: 1080, height: 1920 },
                mimeType: "image/jpeg",
                size: 250000,
              },
            },
            labels: [],
          });

          const timeline = await ctx.dataplane.stories.getTimeline(
            viewerDid,
            [],
          );

          assertEquals(timeline.stories.length, 1);
          assertEquals(timeline.stories[0].uri, activeUri);
        } finally {
          await cleanup();
        }
      },
    );
  },
});
