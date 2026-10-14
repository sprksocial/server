import { assertEquals, assertExists } from "@std/assert";
import type {
  AtUriString,
  CidString,
  DatetimeString,
  DidString,
  UriString,
} from "@atp/lex";
import { parseCid } from "@atp/lex/data";
import { AtUri } from "@atp/syntax";
import { BackgroundQueue } from "../data-plane/background.ts";
import { makePlugin as makePostPlugin } from "../data-plane/indexing/plugins/post.ts";
import { makePlugin as makeReplyPlugin } from "../data-plane/indexing/plugins/reply.ts";
import * as so from "../lex/so.ts";
import { PushService } from "../utils/push.ts";
import { createTestContext, EMPTY_TEST_DATA } from "./util.ts";

const TIMESTAMP = "2026-10-14T01:00:00.000Z" as DatetimeString;
const CID = parseCid(
  "bafyreihdwdcefgh4dqkjv67uzcmw7ojee6xedzdetojuzjevtenxquvyku",
);
const MENTIONED_DID = "did:web:mentioned.test" as DidString;
const PREVIOUS_MENTION_DID = "did:web:previous-mention.test";

const features = {
  tag: {
    $type: "so.sprk.richtext.facet#tag",
    tag: "test",
  },
  link: {
    $type: "so.sprk.richtext.facet#link",
    uri: "https://example.org/" as UriString,
  },
  mention: {
    $type: "so.sprk.richtext.facet#mention",
    did: MENTIONED_DID,
  },
} as const;

function postRecord(
  facets: so.sprk.richtext.facet.Main[] = [],
): so.sprk.feed.post.Main {
  return {
    $type: "so.sprk.feed.post",
    caption: { text: "test", facets },
    media: { $type: "so.sprk.media.images", images: [] },
    createdAt: TIMESTAMP,
  };
}

Deno.test("post and reply indexing completes for rich-text facets", async (t) => {
  const { ctx, cleanup } = await createTestContext(EMPTY_TEST_DATA);
  const background = new BackgroundQueue(ctx.db);
  const posts = makePostPlugin(ctx.db, background);
  const replies = makeReplyPlugin(ctx.db, background);
  const deliveries: Array<{ did: string; reason: string; uri: string }> = [];
  const pushService = new PushService(ctx.dataplane.pushTokens, ctx.db, {
    enabled: true,
  });
  // Exercise push queueing without contacting a delivery provider.
  pushService.sendPush = (did, payload) => {
    deliveries.push({ did, reason: payload.reason, uri: payload.uri });
    return Promise.resolve();
  };
  posts.setPushService(pushService);
  replies.setPushService(pushService);

  try {
    for (const kind of ["post", "reply"] as const) {
      for (const action of ["create", "update"] as const) {
        for (const featureName of ["tag", "link", "mention"] as const) {
          await t.step(`${kind} ${action} with ${featureName}`, async () => {
            const caseName = `${kind}-${action}-${featureName}`;
            const authorDid = `did:web:${caseName}.test`;
            const uri = new AtUri(
              `at://${authorDid}/so.sprk.feed.${kind}/3mxs557zsxlm2`,
            );
            const rootAuthor = `did:web:root-${caseName}.test`;
            const rootUri = new AtUri(
              `at://${rootAuthor}/so.sprk.feed.post/3mxs557zsxlm2`,
            );
            const facets: so.sprk.richtext.facet.Main[] = [{
              index: { byteStart: 0, byteEnd: 4 },
              features: [features[featureName]],
            }];
            const replyRecord = (
              facets: so.sprk.richtext.facet.Main[] = [],
            ): so.sprk.feed.reply.Main => ({
              $type: "so.sprk.feed.reply",
              text: "test",
              facets,
              reply: {
                root: {
                  uri: rootUri.toString() as AtUriString,
                  cid: CID.toString() as CidString,
                },
                parent: {
                  uri: rootUri.toString() as AtUriString,
                  cid: CID.toString() as CidString,
                },
              },
              createdAt: TIMESTAMP,
            });

            await ctx.db.models.Profile.create({
              uri: `at://${authorDid}/so.sprk.actor.profile/self`,
              cid: CID.toString(),
              authorDid,
              createdAt: TIMESTAMP,
              indexedAt: TIMESTAMP,
              postsCount: 99,
            });
            if (kind === "reply") {
              await posts.insertRecord(rootUri, CID, postRecord(), TIMESTAMP);
            }

            const plugin = kind === "post" ? posts : replies;
            if (action === "update") {
              // Seed a facet-free revision so the UPDATE itself exercises the
              // regression even when run against the broken implementation.
              await plugin.insertRecord(
                uri,
                CID,
                kind === "post" ? postRecord() : replyRecord(),
                TIMESTAMP,
              );
              await background.processAll();
              await ctx.db.models.Notification.create({
                did: PREVIOUS_MENTION_DID,
                recordUri: uri.toString(),
                recordCid: CID.toString(),
                author: authorDid,
                reason: "mention",
                sortAt: TIMESTAMP,
              });
            }

            // A stale counter makes successful downstream aggregation visible.
            if (kind === "post") {
              await ctx.db.models.Profile.updateOne(
                { authorDid },
                { $set: { postsCount: 99 } },
              );
            } else {
              await ctx.db.models.Post.updateOne(
                { uri: rootUri.toString() },
                { $set: { replyCount: 99 } },
              );
            }

            const record = kind === "post"
              ? postRecord(facets)
              : replyRecord(facets);
            deliveries.length = 0;
            if (action === "create") {
              await plugin.insertRecord(uri, CID, record, TIMESTAMP);
            } else {
              await plugin.updateRecord(uri, CID, record, TIMESTAMP);
            }
            await background.processAll();

            const raw = await ctx.db.models.Record.findOne({
              uri: uri.toString(),
            }).lean();
            assertExists(raw);
            assertEquals(JSON.parse(raw.json), record);
            if (kind === "post") {
              const stored = await ctx.db.models.Post.findOne({
                uri: uri.toString(),
              }).lean();
              assertExists(stored);
              assertEquals(stored.caption?.facets, facets);
              const profile = await ctx.db.models.Profile.findOne({ authorDid })
                .lean();
              assertEquals(profile?.postsCount, 1);
            } else {
              const stored = await ctx.db.models.Reply.findOne({
                uri: uri.toString(),
              }).lean();
              assertExists(stored);
              assertEquals(stored.facets, facets);
              const parent = await ctx.db.models.Post.findOne({
                uri: rootUri.toString(),
              }).lean();
              assertEquals(parent?.replyCount, 1);
            }

            const notifications = await ctx.db.models.Notification.find({
              recordUri: uri.toString(),
            }).lean();
            const expected = [];
            if (featureName === "mention") {
              expected.push({ did: MENTIONED_DID, reason: "mention" });
            }
            if (kind === "reply") {
              expected.push({ did: rootAuthor, reason: "reply" });
            }
            const sortByDid = (a: { did: string }, b: { did: string }) =>
              a.did.localeCompare(b.did);
            assertEquals(
              notifications.map(({ did, reason }) => ({ did, reason })).sort(
                sortByDid,
              ),
              expected.sort(sortByDid),
            );
            assertEquals(
              deliveries.sort(sortByDid),
              expected.map((notif) => ({ ...notif, uri: uri.toString() })).sort(
                sortByDid,
              ),
            );
          });
        }
      }
    }
  } finally {
    await background.destroy();
    await cleanup();
  }
});
