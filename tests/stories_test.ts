import { assertEquals } from "@std/assert";
import { HydrationState } from "../hydration/index.ts";
import { Actor } from "../hydration/actor.ts";
import { HydrationMap, RecordInfo } from "../hydration/util.ts";
import * as so from "../lex/so.ts";
import { Views } from "../views/index.ts";
import { createTestContext, TEST_USERS } from "./util.ts";

type PostRecord = so.sprk.feed.post.Main;
type StoryRecord = so.sprk.story.post.Main;

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

    await t.step(
      "hydrateStories fully hydrates embedded post metadata",
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
          const now = new Date();
          const nowIso = now.toISOString();
          const storyAuthorDid = TEST_USERS[0].did;
          const postAuthorDid = TEST_USERS[1].did;
          const storyUri =
            `at://${storyAuthorDid}/so.sprk.story.post/story-hydrated`;
          const postUri =
            `at://${postAuthorDid}/so.sprk.feed.post/post-hydrated`;
          const soundUri =
            `at://${postAuthorDid}/so.sprk.sound.audio/sound-hydrated`;

          await ctx.db.models.Actor.create([
            {
              did: storyAuthorDid,
              handle: "story-author.test",
              indexedAt: nowIso,
              keys: [],
              services: "[]",
            },
            {
              did: postAuthorDid,
              handle: "post-author.test",
              indexedAt: nowIso,
              keys: [],
              services: "[]",
            },
          ]);

          const soundRecord = {
            $type: "so.sprk.sound.audio",
            sound: {
              $type: "blob",
              ref: { $link: VALID_BLOB_CID },
              mimeType: "audio/mpeg",
              size: 12345,
            },
            title: "Hydrated Sound",
            createdAt: nowIso,
          };
          const postRecord = {
            $type: "so.sprk.feed.post",
            media: {
              $type: "so.sprk.media.images",
              images: [{
                $type: "so.sprk.media.image",
                image: {
                  $type: "blob",
                  ref: { $link: VALID_BLOB_CID },
                  mimeType: "image/jpeg",
                  size: 22222,
                },
                alt: "Hydrated post image",
              }],
            },
            sound: { uri: soundUri, cid: VALID_BLOB_CID },
            createdAt: nowIso,
          };
          const storyRecord = {
            $type: "so.sprk.story.post",
            media: {
              $type: "so.sprk.media.image",
              image: {
                $type: "blob",
                ref: { $link: VALID_BLOB_CID },
                mimeType: "image/jpeg",
                size: 11111,
              },
              alt: "Hydrated story image",
              aspectRatio: { width: 1080, height: 1920 },
            },
            embeds: [
              {
                $type: "so.sprk.embed.record",
                placement: {
                  frame: { x: 1000, y: 1000, w: 7000, h: 2500 },
                },
                post: { uri: postUri, cid: VALID_BLOB_CID },
              },
            ],
            createdAt: nowIso,
          };

          await ctx.db.models.Audio.create({
            uri: soundUri,
            cid: VALID_BLOB_CID,
            authorDid: postAuthorDid,
            createdAt: nowIso,
            indexedAt: nowIso,
            sound: soundRecord.sound,
            title: soundRecord.title,
            useCount: 8,
          });

          await ctx.db.models.Post.create({
            uri: postUri,
            cid: VALID_BLOB_CID,
            authorDid: postAuthorDid,
            createdAt: nowIso,
            indexedAt: nowIso,
            caption: { text: "Hydrated post caption" },
            media: postRecord.media,
            sound: postRecord.sound,
            labels: [],
            tags: [],
            likeCount: 17,
            replyCount: 4,
            repostCount: 2,
          });

          await ctx.db.models.Record.create([
            {
              uri: soundUri,
              cid: VALID_BLOB_CID,
              did: postAuthorDid,
              collectionName: "so.sprk.sound.audio",
              rkey: "sound-hydrated",
              createdAt: nowIso,
              indexedAt: nowIso,
              json: JSON.stringify(soundRecord),
              takenDown: false,
            },
            {
              uri: postUri,
              cid: VALID_BLOB_CID,
              did: postAuthorDid,
              collectionName: "so.sprk.feed.post",
              rkey: "post-hydrated",
              createdAt: nowIso,
              indexedAt: nowIso,
              json: JSON.stringify(postRecord),
              takenDown: false,
            },
            {
              uri: storyUri,
              cid: VALID_BLOB_CID,
              did: storyAuthorDid,
              collectionName: "so.sprk.story.post",
              rkey: "story-hydrated",
              createdAt: nowIso,
              indexedAt: nowIso,
              json: JSON.stringify(storyRecord),
              takenDown: false,
            },
          ]);

          const hydrateCtx = await ctx.hydrator.createContext({
            viewer: storyAuthorDid,
            labelers: ctx.reqLabelers(new Request("https://example.com")),
          });

          const hydration = await ctx.hydrator.hydrateStories(
            [storyUri],
            hydrateCtx,
          );
          const storyView = ctx.views.story(storyUri, hydration);
          const embed = storyView?.embeds?.[0] as {
            post: {
              $type?: string;
              likeCount?: number;
              replyCount?: number;
              repostCount?: number;
              viewer?: unknown;
              sound?: { uri: string };
            };
          } | undefined;

          assertEquals(embed?.post.$type, "so.sprk.feed.defs#postView");
          assertEquals(embed?.post.likeCount, 17);
          assertEquals(embed?.post.replyCount, 4);
          assertEquals(embed?.post.repostCount, 2);
          assertEquals(embed?.post.viewer !== undefined, true);
          assertEquals(embed?.post.sound?.uri, soundUri);
        } finally {
          await cleanup();
        }
      },
    );

    await t.step(
      "story view hydrates mention and post embeds",
      () => {
        const now = new Date();
        const storyAuthorDid = TEST_USERS[0].did;
        const mentionDid = TEST_USERS[1].did;
        const postAuthorDid = TEST_USERS[2].did;
        const storyUri =
          `at://${storyAuthorDid}/so.sprk.story.post/embed-story`;
        const postUri = `at://${postAuthorDid}/so.sprk.feed.post/embed-post`;

        const storyRecord = {
          $type: "so.sprk.story.post",
          createdAt: now.toISOString(),
          media: {
            $type: "so.sprk.media.image",
            image: {
              ref: { $link: VALID_BLOB_CID },
              mimeType: "image/jpeg",
              size: 12345,
            },
            alt: "Story image",
            aspectRatio: { width: 1080, height: 1920 },
          },
          embeds: [
            {
              $type: "so.sprk.embed.mention",
              placement: {
                frame: { x: 1000, y: 1000, w: 3000, h: 1000 },
              },
              did: mentionDid,
            },
            {
              $type: "so.sprk.embed.record",
              placement: {
                frame: { x: 800, y: 5000, w: 8400, h: 3000 },
              },
              post: {
                uri: postUri,
                cid:
                  "bafyreihdwdcefgh4dqkjv67uzcmw7ojee6xedzdetojuzjevtenxquvyaa",
              },
            },
          ],
        } as unknown as StoryRecord;

        const postRecord = {
          $type: "so.sprk.feed.post",
          createdAt: now.toISOString(),
          media: {
            $type: "so.sprk.media.images",
            images: [{
              $type: "so.sprk.media.image",
              image: {
                ref: { $link: VALID_BLOB_CID },
                mimeType: "image/jpeg",
                size: 22222,
              },
              alt: "Embedded post image",
            }],
          },
        } as unknown as PostRecord;

        const stories = new HydrationMap<RecordInfo<StoryRecord>>();
        stories.set(storyUri, {
          record: storyRecord,
          cid: "bafyreihdwdcefgh4dqkjv67uzcmw7ojee6xedzdetojuzjevtenxquvybb",
          sortedAt: now,
          indexedAt: now,
          takedownRef: undefined,
        });

        const posts = new HydrationMap<RecordInfo<PostRecord>>();
        posts.set(postUri, {
          record: postRecord,
          cid: "bafyreihdwdcefgh4dqkjv67uzcmw7ojee6xedzdetojuzjevtenxquvycc",
          sortedAt: now,
          indexedAt: now,
          takedownRef: undefined,
        });

        const actors = new HydrationMap<Actor>();
        actors.set(storyAuthorDid, {
          did: storyAuthorDid,
          handle: "story-author.test",
          createdAt: now,
          sortedAt: now,
        });
        actors.set(mentionDid, {
          did: mentionDid,
          handle: "mentioned-user.test",
          createdAt: now,
          sortedAt: now,
        });
        actors.set(postAuthorDid, {
          did: postAuthorDid,
          handle: "post-author.test",
          createdAt: now,
          sortedAt: now,
        });

        const state: HydrationState = {
          stories,
          posts,
          actors,
        };

        const views = new Views({
          mediaCdn: "https://media.example.com",
          thumbCdn: "https://thumb.example.com",
          videoCdn: "https://video.example.com",
        });

        const view = views.story(storyUri, state);
        assertEquals(view?.embeds?.length, 2);

        const mentionView = view?.embeds?.[0] as {
          $type: string;
          did: string;
          actor?: { did: string };
        };
        assertEquals(mentionView.$type, "so.sprk.embed.mention#view");
        assertEquals(mentionView.did, mentionDid);
        assertEquals(mentionView.actor?.did, mentionDid);

        const postView = view?.embeds?.[1] as {
          $type: string;
          post: { $type?: string; uri: string };
        };
        assertEquals(postView.$type, "so.sprk.embed.record#view");
        assertEquals(postView.post.$type, "so.sprk.feed.defs#postView");
        assertEquals(postView.post.uri, postUri);
      },
    );

    await t.step(
      "story view ignores malformed post embeds",
      () => {
        const now = new Date();
        const storyAuthorDid = TEST_USERS[0].did;
        const storyUri =
          `at://${storyAuthorDid}/so.sprk.story.post/bad-embed-story`;

        const storyRecord = {
          $type: "so.sprk.story.post",
          createdAt: now.toISOString(),
          media: {
            $type: "so.sprk.media.image",
            image: {
              ref: { $link: VALID_BLOB_CID },
              mimeType: "image/jpeg",
              size: 12345,
            },
            alt: "Story image",
            aspectRatio: { width: 1080, height: 1920 },
          },
          embeds: [
            {
              $type: "so.sprk.embed.record",
              placement: {
                frame: { x: 800, y: 5000, w: 8400, h: 3000 },
              },
            },
          ],
        } as unknown as StoryRecord;

        const stories = new HydrationMap<RecordInfo<StoryRecord>>();
        stories.set(storyUri, {
          record: storyRecord,
          cid: "bafyreihdwdcefgh4dqkjv67uzcmw7ojee6xedzdetojuzjevtenxquvydd",
          sortedAt: now,
          indexedAt: now,
          takedownRef: undefined,
        });

        const actors = new HydrationMap<Actor>();
        actors.set(storyAuthorDid, {
          did: storyAuthorDid,
          handle: "story-author.test",
          createdAt: now,
          sortedAt: now,
        });

        const state: HydrationState = {
          stories,
          actors,
        };

        const views = new Views({
          mediaCdn: "https://media.example.com",
          thumbCdn: "https://thumb.example.com",
          videoCdn: "https://video.example.com",
        });

        const view = views.story(storyUri, state);
        assertEquals(view?.embeds, undefined);
      },
    );

    await t.step(
      "story view ignores mention embed missing did",
      () => {
        const now = new Date();
        const storyAuthorDid = TEST_USERS[0].did;
        const storyUri =
          `at://${storyAuthorDid}/so.sprk.story.post/no-did-mention-story`;

        const storyRecord = {
          $type: "so.sprk.story.post",
          createdAt: now.toISOString(),
          media: {
            $type: "so.sprk.media.image",
            image: {
              ref: { $link: VALID_BLOB_CID },
              mimeType: "image/jpeg",
              size: 12345,
            },
            alt: "Story image",
            aspectRatio: { width: 1080, height: 1920 },
          },
          embeds: [
            {
              $type: "so.sprk.embed.mention",
              placement: {
                frame: { x: 1000, y: 1000, w: 3000, h: 1000 },
              },
              // did is intentionally absent
            },
          ],
        } as unknown as StoryRecord;

        const stories = new HydrationMap<RecordInfo<StoryRecord>>();
        stories.set(storyUri, {
          record: storyRecord,
          cid: "bafyreihdwdcefgh4dqkjv67uzcmw7ojee6xedzdetojuzjevtenxquvyee",
          sortedAt: now,
          indexedAt: now,
          takedownRef: undefined,
        });

        const actors = new HydrationMap<Actor>();
        actors.set(storyAuthorDid, {
          did: storyAuthorDid,
          handle: "story-author.test",
          createdAt: now,
          sortedAt: now,
        });

        const state: HydrationState = { stories, actors };

        const views = new Views({
          mediaCdn: "https://media.example.com",
          thumbCdn: "https://thumb.example.com",
          videoCdn: "https://video.example.com",
        });

        const view = views.story(storyUri, state);
        assertEquals(view?.embeds, undefined);
      },
    );

    await t.step(
      "story view ignores embeds missing placement",
      () => {
        const now = new Date();
        const storyAuthorDid = TEST_USERS[0].did;
        const mentionDid = TEST_USERS[1].did;
        const postAuthorDid = TEST_USERS[2].did;
        const storyUri =
          `at://${storyAuthorDid}/so.sprk.story.post/no-placement-story`;
        const postUri =
          `at://${postAuthorDid}/so.sprk.feed.post/no-placement-post`;

        const storyRecord = {
          $type: "so.sprk.story.post",
          createdAt: now.toISOString(),
          media: {
            $type: "so.sprk.media.image",
            image: {
              ref: { $link: VALID_BLOB_CID },
              mimeType: "image/jpeg",
              size: 12345,
            },
            alt: "Story image",
            aspectRatio: { width: 1080, height: 1920 },
          },
          embeds: [
            {
              $type: "so.sprk.embed.mention",
              // placement is intentionally absent
              did: mentionDid,
            },
            {
              $type: "so.sprk.embed.record",
              // placement is intentionally absent
              post: {
                uri: postUri,
                cid:
                  "bafyreihdwdcefgh4dqkjv67uzcmw7ojee6xedzdetojuzjevtenxquvyff",
              },
            },
          ],
        } as unknown as StoryRecord;

        const stories = new HydrationMap<RecordInfo<StoryRecord>>();
        stories.set(storyUri, {
          record: storyRecord,
          cid: "bafyreihdwdcefgh4dqkjv67uzcmw7ojee6xedzdetojuzjevtenxquvygg",
          sortedAt: now,
          indexedAt: now,
          takedownRef: undefined,
        });

        const actors = new HydrationMap<Actor>();
        actors.set(storyAuthorDid, {
          did: storyAuthorDid,
          handle: "story-author.test",
          createdAt: now,
          sortedAt: now,
        });
        actors.set(mentionDid, {
          did: mentionDid,
          handle: "mentioned-user.test",
          createdAt: now,
          sortedAt: now,
        });

        const state: HydrationState = { stories, actors };

        const views = new Views({
          mediaCdn: "https://media.example.com",
          thumbCdn: "https://thumb.example.com",
          videoCdn: "https://video.example.com",
        });

        const view = views.story(storyUri, state);
        assertEquals(view?.embeds, undefined);
      },
    );

    await t.step(
      "hydrateProfiles returns hydrated story views on profiles",
      async () => {
        const { ctx, cleanup } = await createTestContext({
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
          const now = new Date().toISOString();
          const did = TEST_USERS[0].did;
          const profileUri = `at://${did}/so.sprk.actor.profile/self`;
          const storyUri = `at://${did}/so.sprk.story.post/profile-story`;

          await ctx.db.models.Record.create([
            {
              uri: profileUri,
              cid: `${VALID_BLOB_CID}profile`,
              did,
              collectionName: "so.sprk.actor.profile",
              rkey: "self",
              createdAt: now,
              indexedAt: now,
              json: JSON.stringify({
                $type: "so.sprk.actor.profile",
                displayName: "Alice",
                createdAt: now,
              }),
              takedownRef: "",
            },
            {
              uri: storyUri,
              cid: `${VALID_BLOB_CID}story`,
              did,
              collectionName: "so.sprk.story.post",
              rkey: "profile-story",
              createdAt: now,
              indexedAt: now,
              json: JSON.stringify({
                $type: "so.sprk.story.post",
                createdAt: now,
                media: {
                  $type: "so.sprk.media.image",
                  image: {
                    $type: "blob",
                    ref: { $link: VALID_BLOB_CID },
                    mimeType: "image/jpeg",
                    size: 12345,
                  },
                  alt: "Profile story",
                  aspectRatio: { width: 1080, height: 1920 },
                },
              }),
              takedownRef: "",
            },
          ]);

          await ctx.db.models.Story.create({
            uri: storyUri,
            cid: `${VALID_BLOB_CID}story`,
            authorDid: did,
            createdAt: now,
            indexedAt: now,
            media: {
              $type: "so.sprk.media.image",
              image: {
                $type: "blob",
                ref: { $link: VALID_BLOB_CID },
                mimeType: "image/jpeg",
                size: 12345,
              },
              alt: "Profile story",
              aspectRatio: { width: 1080, height: 1920 },
            },
            labels: [],
          });

          const hydrateCtx = await ctx.hydrator.createContext({
            viewer: null,
            labelers: ctx.reqLabelers(new Request("https://example.com")),
          });

          const hydration = await ctx.hydrator.hydrateProfiles(
            [did],
            hydrateCtx,
          );
          const profile = ctx.views.profile(did, hydration);

          assertEquals(profile?.stories?.length, 1);
          assertEquals(profile?.stories?.[0].uri, storyUri);
          assertEquals(profile?.stories?.[0].author.did as string, did);
          assertEquals(
            (profile?.stories?.[0].record as { $type?: string }).$type,
            "so.sprk.story.post",
          );
        } finally {
          await cleanup();
        }
      },
    );
  },
});
