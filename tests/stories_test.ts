import { assertEquals } from "@std/assert";
import { createTestContext, TEST_USERS } from "./util.ts";

const VALID_BLOB_CID =
  "bafyreihdwdcefgh4dqkjv67uzcmw7ojee6xedzdetojuzjevtenxquvyku";

const storyRecordJson = (createdAt: string) => {
  return JSON.stringify({
    $type: "so.sprk.story.post",
    createdAt,
    media: {
      $type: "so.sprk.media.image",
      image: {
        $type: "blob",
        ref: { $link: VALID_BLOB_CID },
        mimeType: "image/jpeg",
        size: 250000,
      },
      alt: "Archived story image",
      aspectRatio: { width: 1080, height: 1920 },
    },
  });
};

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
      "getArchive excludes takedown archived stories by default",
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
          const now = new Date().toISOString();
          const archivedUri = `at://${
            TEST_USERS[0].did
          }/so.sprk.story.post/story1`;
          const takedownArchivedUri = `at://${
            TEST_USERS[0].did
          }/so.sprk.story.post/story-takedown`;
          const otherAuthorArchivedUri = `at://${
            TEST_USERS[2].did
          }/so.sprk.story.post/story2`;

          await ctx.db.models.ArchivedRecord.create({
            uri: archivedUri,
            cid: "bafyreihivhfhv6rh4x4a4znkqrvqwp5xw4xvqjqstory1",
            did: TEST_USERS[0].did,
            collectionName: "so.sprk.story.post",
            rkey: "story1",
            createdAt: now,
            indexedAt: now,
            json: storyRecordJson(now),
            archivedAt: now,
            deleteReason: "user_delete",
          });
          await ctx.db.models.ArchivedRecord.create({
            uri: takedownArchivedUri,
            cid: "bafyreihivhfhv6rh4x4a4znkqrvqwp5xw4xvqjqstorytakedown",
            did: TEST_USERS[0].did,
            collectionName: "so.sprk.story.post",
            rkey: "story-takedown",
            createdAt: now,
            indexedAt: now,
            json: storyRecordJson(now),
            archivedAt: now,
            deleteReason: "takedown",
            takedownRef: "SPRK-TAKEDOWN-1",
          });
          await ctx.db.models.ArchivedRecord.create({
            uri: otherAuthorArchivedUri,
            cid: "bafyreihivhfhv6rh4x4a4znkqrvqwp5xw4xvqjqstory2",
            did: TEST_USERS[2].did,
            collectionName: "so.sprk.story.post",
            rkey: "story2",
            createdAt: now,
            indexedAt: now,
            json: storyRecordJson(now),
            archivedAt: now,
            deleteReason: "user_delete",
          });

          const res = await ctx.dataplane.stories.getArchive(
            TEST_USERS[0].did,
            10,
          );

          assertEquals(res.stories.length, 1);
          assertEquals(res.stories[0].uri, archivedUri);
          assertEquals(res.stories[0].archived, true);
          assertEquals(res.cursor, undefined);

          const resIncludingTakedowns = await ctx.dataplane.stories.getArchive(
            TEST_USERS[0].did,
            10,
            undefined,
            true,
          );
          assertEquals(resIncludingTakedowns.stories.length, 2);
        } finally {
          await cleanup();
        }
      },
    );

    await t.step(
      "getArchivedStories hydrates from archived records",
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
          const now = new Date().toISOString();
          const archivedUri = `at://${
            TEST_USERS[0].did
          }/so.sprk.story.post/story1`;
          const missingUri = `at://${
            TEST_USERS[2].did
          }/so.sprk.story.post/story2`;

          await ctx.db.models.ArchivedRecord.create({
            uri: archivedUri,
            cid: "bafyreihivhfhv6rh4x4a4znkqrvqwp5xw4xvqjqstory3",
            did: TEST_USERS[0].did,
            collectionName: "so.sprk.story.post",
            rkey: "story1",
            createdAt: now,
            indexedAt: now,
            json: storyRecordJson(now),
            archivedAt: now,
            deleteReason: "user_delete",
          });

          const hydrated = await ctx.hydrator.story.getArchivedStories([
            archivedUri,
            missingUri,
          ]);

          assertEquals(Boolean(hydrated.get(archivedUri)), true);
          assertEquals(hydrated.get(missingUri), null);
        } finally {
          await cleanup();
        }
      },
    );

    await t.step("getArchivedStories applies takedown filtering", async () => {
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
        const now = new Date().toISOString();
        const takedownUri = `at://${
          TEST_USERS[0].did
        }/so.sprk.story.post/story-takedown`;

        await ctx.db.models.ArchivedRecord.create({
          uri: takedownUri,
          cid: "bafyreihivhfhv6rh4x4a4znkqrvqwp5xw4xvqjqstory4",
          did: TEST_USERS[0].did,
          collectionName: "so.sprk.story.post",
          rkey: "story-takedown",
          createdAt: now,
          indexedAt: now,
          json: storyRecordJson(now),
          archivedAt: now,
          deleteReason: "user_delete",
          takedownRef: "SPRK-TAKEDOWN-1",
        });

        const hidden = await ctx.hydrator.story.getArchivedStories([
          takedownUri,
        ]);
        assertEquals(hidden.get(takedownUri), null);

        const included = await ctx.hydrator.story.getArchivedStories(
          [takedownUri],
          true,
        );
        assertEquals(Boolean(included.get(takedownUri)), true);
      } finally {
        await cleanup();
      }
    });
  },
});
