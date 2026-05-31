import { assertEquals } from "@std/assert";
import type {
  AtUriString,
  BlobRef,
  CidString,
  DatetimeString,
  DidString,
  UriString,
} from "@atp/lex";
import { parseCid } from "@atp/lex/data";

import { HydrationState } from "../hydration/index.ts";
import { Label, Labels } from "../hydration/label.ts";
import { Actor } from "../hydration/actor.ts";
import { FeedGen, Post, Reply, Sound } from "../hydration/feed.ts";
import { HydrationMap, RecordInfo } from "../hydration/util.ts";
import * as com from "../lex/com.ts";
import * as so from "../lex/so.ts";
import { Views } from "../views/index.ts";

interface SelfLabels extends com.atproto.label.defs.SelfLabels {
  $type: "com.atproto.label.defs#selfLabels";
}

const NOW = new Date("2026-01-01T00:00:00.000Z");
const NOW_ISO = NOW.toISOString() as DatetimeString;
const LABELER_DID = "did:plc:labeler" as DidString;
const AUTHOR_DID = "did:plc:author" as DidString;
const CID =
  "bafyreihdwdcefgh4dqkjv67uzcmw7ojee6xedzdetojuzjevtenxquvyku" as CidString;

const blob = {
  $type: "blob",
  ref: parseCid(CID),
  mimeType: "image/jpeg",
  size: 1,
} as unknown as BlobRef;

const audioBlob = {
  ...blob,
  mimeType: "audio/mpeg",
} as unknown as BlobRef;

const selfLabels = (val: string): SelfLabels => ({
  $type: "com.atproto.label.defs#selfLabels",
  values: [{ val }],
});

const recordInfo = <T extends { $type: string }>(
  record: T,
): RecordInfo<T> => ({
  record,
  cid: CID,
  sortedAt: NOW,
  indexedAt: NOW,
  takedownRef: undefined,
});

const addLabel = (labels: Labels, subject: string, val: string) => {
  const label: Label = {
    src: LABELER_DID,
    uri: subject as UriString,
    cid: CID,
    val,
    cts: NOW_ISO,
  };
  const existing = labels.get(subject);
  const entry = existing ?? {
    isImpersonation: false,
    isTakendown: false,
    needsReview: false,
    labels: new HydrationMap<Label>(),
  };
  entry.labels.set(Labels.key(label), label);
  labels.set(subject, entry);
};

Deno.test("view builders return hydrated and self labels", () => {
  const views = new Views({});
  const labels = new Labels();
  const profileUri =
    `at://${AUTHOR_DID}/so.sprk.actor.profile/self` as AtUriString;
  const postUri = `at://${AUTHOR_DID}/so.sprk.feed.post/post` as AtUriString;
  const replyUri = `at://${AUTHOR_DID}/so.sprk.feed.reply/reply` as AtUriString;
  const soundUri =
    `at://${AUTHOR_DID}/so.sprk.sound.audio/sound` as AtUriString;
  const generatorUri =
    `at://${AUTHOR_DID}/so.sprk.feed.generator/feed` as AtUriString;

  addLabel(labels, AUTHOR_DID, "account-label");
  addLabel(labels, profileUri, "profile-label");
  addLabel(labels, postUri, "post-label");
  addLabel(labels, replyUri, "reply-label");
  addLabel(labels, soundUri, "sound-label");
  addLabel(labels, generatorUri, "generator-label");

  const profile: so.sprk.actor.profile.Main = {
    $type: so.sprk.actor.profile.$type,
    displayName: "Author",
    labels: selfLabels("self-profile"),
    createdAt: NOW_ISO,
  };
  const post: so.sprk.feed.post.Main = {
    $type: so.sprk.feed.post.$type,
    media: {
      $type: "so.sprk.media.images",
      images: [{ image: blob, alt: "alt" }],
    },
    labels: selfLabels("self-post"),
    createdAt: NOW_ISO,
  };
  const reply: so.sprk.feed.reply.Main = {
    $type: so.sprk.feed.reply.$type,
    text: "reply",
    reply: {
      root: { uri: postUri, cid: CID },
      parent: { uri: postUri, cid: CID },
    },
    labels: selfLabels("self-reply"),
    createdAt: NOW_ISO,
  };
  const sound: so.sprk.sound.audio.Main = {
    $type: so.sprk.sound.audio.$type,
    sound: audioBlob,
    title: "sound",
    labels: selfLabels("self-sound"),
    createdAt: NOW_ISO,
  };
  const generator: so.sprk.feed.generator.Main = {
    $type: so.sprk.feed.generator.$type,
    did: "did:web:feed.example" as DidString,
    displayName: "Feed",
    labels: selfLabels("self-generator"),
    createdAt: NOW_ISO,
  };

  const state: HydrationState = {
    actors: new HydrationMap<Actor>().set(AUTHOR_DID, {
      did: AUTHOR_DID,
      handle: "author.test",
      profile,
      profileCid: CID,
      sortedAt: NOW,
      indexedAt: NOW,
      createdAt: NOW,
      upstreamStatus: "active",
    }),
    posts: new HydrationMap<Post>().set(postUri, recordInfo(post)),
    replies: new HydrationMap<Reply>().set(replyUri, recordInfo(reply)),
    sounds: new HydrationMap<Sound>().set(soundUri, recordInfo(sound)),
    feedgens: new HydrationMap<FeedGen>().set(
      generatorUri,
      recordInfo(generator),
    ),
    labels,
  };

  assertEquals(
    views.profileBasic(AUTHOR_DID, state)?.labels?.map((label) => label.val),
    ["account-label", "profile-label", "self-profile"],
  );
  assertEquals(
    views.post(postUri, state)?.labels?.map((label) => label.val),
    ["post-label", "self-post"],
  );
  assertEquals(
    views.reply(replyUri, state)?.labels?.map((label) => label.val),
    ["reply-label", "self-reply"],
  );
  assertEquals(
    views.sound(soundUri, state)?.labels?.map((label) => label.val),
    ["sound-label", "self-sound"],
  );
  assertEquals(
    views.feedGenerator(generatorUri, state)?.labels?.map((label) => label.val),
    ["generator-label", "self-generator"],
  );
  assertEquals(
    views.generator(generatorUri, state)?.labels?.map((label) => label.val),
    ["generator-label", "self-generator"],
  );
});
