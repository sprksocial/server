import { assertEquals } from "@std/assert";
import { parseCid } from "@atp/lex/data";
import { AtUri } from "@atp/syntax";
import { type RepoRecord, WriteOpAction } from "@atp/repo";
import { BackgroundQueue } from "../data-plane/background.ts";
import { IndexingService } from "../data-plane/indexing/index.ts";
import { createTestApp, TEST_USERS } from "./util.ts";
import { $OutputBody as SearchAudiosOutput } from "../lex/so/sprk/sound/searchAudios.ts";
import { $OutputBody as GetAudiosOutput } from "../lex/so/sprk/sound/getAudios.ts";
import { ATPROTO_CONTENT_LABELERS } from "../api/util.ts";

const VALID_BLOB_CID =
  "bafyreihdwdcefgh4dqkjv67uzcmw7ojee6xedzdetojuzjevtenxquvyku";
const TEST_LABELER_DID = "did:plc:testlabeler";
const TEST_LABELER_HEADER = `${TEST_LABELER_DID};redact`;

Deno.test({
  name: "Sound search",
  sanitizeOps: false,
  sanitizeResources: false,
  fn: async (t) => {
    const { app, ctx, cleanup } = await createTestApp(
      {
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
      },
      { labelsFromIssuerDids: [TEST_LABELER_DID] },
    );

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

      await t.step("returns labeler headers for sound views", async () => {
        const audioParams = new URLSearchParams();
        audioParams.append("uris", chillUri);
        const responses = await Promise.all([
          app.request(
            `/xrpc/so.sprk.sound.getAudios?${audioParams.toString()}`,
          ),
          app.request(
            `/xrpc/so.sprk.sound.getActorAudios?actor=${
              encodeURIComponent(authorDid)
            }`,
          ),
          app.request(
            `/xrpc/so.sprk.sound.getAudioPosts?uri=${
              encodeURIComponent(chillUri)
            }`,
          ),
          app.request("/xrpc/so.sprk.sound.getTrendingAudios?limit=2"),
        ]);

        for (const res of responses) {
          assertEquals(res.status, 200);
          assertEquals(
            res.headers.get(ATPROTO_CONTENT_LABELERS),
            TEST_LABELER_HEADER,
          );
        }
      });

      await t.step("preserves Spark audio use counts on reindex", async () => {
        const indexingService = new IndexingService(
          ctx.db,
          ctx.cfg,
          ctx.idResolver,
          new BackgroundQueue(ctx.db),
          ctx.pushService,
        );
        await indexingService.indexRecord(
          new AtUri(chillUri),
          parseCid(VALID_BLOB_CID),
          ({
            ...chillRecord,
            sound: {
              ...chillRecord.sound,
              ref: parseCid(VALID_BLOB_CID),
            },
            title: "Chill Beats Remastered",
          }) as unknown as RepoRecord,
          WriteOpAction.Create,
          nowIso,
        );

        const audio = await ctx.db.models.Audio.findOne({ uri: chillUri })
          .lean();
        assertEquals(audio?.title, "Chill Beats Remastered");
        assertEquals(audio?.useCount, 10);
      });

      await t.step("indexes and searches Plyr tracks as sounds", async () => {
        const plyrAuthorDid = TEST_USERS[2].did;
        const plyrUri = `at://${plyrAuthorDid}/fm.plyr.track/governor`;
        const lockedBlobTrackUri =
          `at://${plyrAuthorDid}/fm.plyr.track/locked-blob-governor`;
        const imageUrl = "https://cdn.plyr.example/images/governor.jpg";

        await ctx.db.models.Actor.create({
          did: plyrAuthorDid,
          handle: "dame.is",
          indexedAt: nowIso,
          keys: [],
          services: "[]",
        });
        await ctx.db.models.Profile.create({
          uri: `at://${plyrAuthorDid}/app.bsky.actor.profile/self`,
          cid: VALID_BLOB_CID,
          authorDid: plyrAuthorDid,
          createdAt: nowIso,
          indexedAt: nowIso,
          displayName: "Dame",
          labels: [],
          postsCount: 0,
          followersCount: 0,
          followsCount: 0,
        });

        const indexingService = new IndexingService(
          ctx.db,
          ctx.cfg,
          ctx.idResolver,
          new BackgroundQueue(ctx.db),
          ctx.pushService,
        );
        await indexingService.indexRecord(
          new AtUri(plyrUri),
          parseCid(VALID_BLOB_CID),
          ({
            $type: "fm.plyr.track",
            title: "Governor's Ball Symphony",
            artist: "Dame",
            audioBlob: {
              $type: "blob",
              ref: parseCid(VALID_BLOB_CID),
              mimeType: "audio/mpeg",
              size: 12345,
            },
            fileType: "mp3",
            imageUrl,
            createdAt: nowIso,
          }) as unknown as RepoRecord,
          WriteOpAction.Create,
          nowIso,
        );

        await ctx.db.models.Audio.updateOne(
          { uri: plyrUri },
          { $set: { useCount: 7 } },
        );
        await indexingService.indexRecord(
          new AtUri(plyrUri),
          parseCid(VALID_BLOB_CID),
          ({
            $type: "fm.plyr.track",
            title: "Governor's Ball Symphony Redux",
            artist: "Dame",
            audioBlob: {
              $type: "blob",
              ref: parseCid(VALID_BLOB_CID),
              mimeType: "audio/mpeg",
              size: 12345,
            },
            fileType: "mp3",
            imageUrl,
            createdAt: nowIso,
          }) as unknown as RepoRecord,
          WriteOpAction.Create,
          nowIso,
        );
        const reindexedPlyrAudio = await ctx.db.models.Audio.findOne({
          uri: plyrUri,
        }).lean();
        assertEquals(
          reindexedPlyrAudio?.title,
          "Governor's Ball Symphony Redux",
        );
        assertEquals(reindexedPlyrAudio?.useCount, 7);

        await indexingService.indexRecord(
          new AtUri(lockedBlobTrackUri),
          parseCid(VALID_BLOB_CID),
          ({
            $type: "fm.plyr.track",
            title: "Locked Blob Governor Symphony",
            artist: "Dame",
            audioUrl: "https://cdn.plyr.example/audio/locked-blob.mp3",
            audioBlob: {
              $type: "blob",
              ref: parseCid(VALID_BLOB_CID),
              mimeType: "audio/mpeg",
              size: 12345,
            },
            fileType: "mp3",
            supportGate: { type: "any" },
            createdAt: nowIso,
          }) as unknown as RepoRecord,
          WriteOpAction.Create,
          nowIso,
        );

        const res = await app.request(
          "/xrpc/so.sprk.sound.searchAudios?q=governor",
        );
        assertEquals(res.status, 200);

        const body = await res.json() as SearchAudiosOutput;
        assertEquals(body.audios.length, 1);
        assertEquals(body.audios[0].uri, plyrUri);
        assertEquals(body.audios[0].title, "Governor's Ball Symphony Redux");
        assertEquals(
          body.audios[0].audio,
          `https://media.sprk.so/sound/${encodeURIComponent(plyrAuthorDid)}/${
            encodeURIComponent(VALID_BLOB_CID)
          }`,
        );
        assertEquals(body.audios[0].coverArt, imageUrl);
        assertEquals(body.audios[0].details?.artist, "Dame");

        const params = new URLSearchParams();
        params.append("uris", lockedBlobTrackUri);
        const getAudiosRes = await app.request(
          `/xrpc/so.sprk.sound.getAudios?${params.toString()}`,
        );
        assertEquals(getAudiosRes.status, 200);

        const getAudiosBody = await getAudiosRes.json() as GetAudiosOutput;
        assertEquals(getAudiosBody.audios.length, 1);
        const audio = getAudiosBody.audios[0];
        const record = audio.record as Record<string, unknown>;
        assertEquals(audio.audio, undefined);
        assertEquals(record.audioUrl, undefined);
        assertEquals(record.audioBlob, undefined);
      });
    } finally {
      await cleanup();
    }
  },
});
