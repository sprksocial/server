import { pino } from "pino";
import { Database } from "../../data-plane/server/index.ts";
import type { NormalizedEvent } from "../types/events.ts";
import { handleLikeEvent } from "./like-handler.ts";
import { handlePostEvent } from "./post-handler.ts";
import { handleStoryEvent } from "./story-handler.ts";
import { handleFollowEvent } from "./follow-handler.ts";
import { handleBlockEvent } from "./block-handler.ts";
import { handleProfileEvent } from "./profile-handler.ts";
import { handleAudioEvent } from "./audio-handler.ts";
import { handleRepostEvent } from "./repost-handler.ts";
import { handleMusicEvent } from "./music-handler.ts";
import { handleLookEvent } from "./look-handler.ts";
import { handleGeneratorEvent } from "./generator-handler.ts";
import { handleActorReferences } from "./actor-handler.ts";
import { handleAppBskyFollowEvent } from "./bsky/follow-handler.ts";
import { customConfig } from "../utils/logger-config.ts";
import type { BidirectionalResolver } from "../utils/id-resolver.ts";

const logger = pino(customConfig("event-handler"));

export async function handleEvent(
  evt: NormalizedEvent,
  db: Database,
  resolver: BidirectionalResolver,
): Promise<void> {
  try {
    // Skip actor reference handling for any app.bsky.* events
    if (evt.collection.startsWith("app.bsky.")) {
      logger.trace(
        { did: evt.did, collection: evt.collection },
        "Skipping actor reference handling for app.bsky event.",
      );
    } else {
      await handleActorReferences(evt, db, resolver);
    }

    // Then handle different events based on collection
    if (evt.collection === "so.sprk.feed.like") {
      await handleLikeEvent(evt, db);
      return;
    }

    if (evt.collection === "so.sprk.feed.post") {
      await handlePostEvent(evt, db);
      return;
    }

    if (evt.collection === "so.sprk.feed.story") {
      await handleStoryEvent(evt, db);
      return;
    }

    if (evt.collection === "so.sprk.graph.follow") {
      await handleFollowEvent(evt, db);
      return;
    }

    if (evt.collection === "app.bsky.graph.follow") {
      await handleAppBskyFollowEvent(evt, db);
      return;
    }

    if (evt.collection === "so.sprk.graph.block") {
      await handleBlockEvent(evt, db);
      return;
    }

    if (evt.collection === "so.sprk.actor.profile") {
      await handleProfileEvent(evt, db);
      return;
    }

    if (evt.collection === "so.sprk.feed.audio") {
      await handleAudioEvent(evt, db);
      return;
    }

    if (evt.collection === "so.sprk.feed.repost") {
      await handleRepostEvent(evt, db);
      return;
    }

    if (evt.collection === "so.sprk.feed.music") {
      await handleMusicEvent(evt, db);
      return;
    }

    if (evt.collection === "so.sprk.feed.look") {
      await handleLookEvent(evt, db);
      return;
    }

    if (evt.collection === "so.sprk.feed.generator") {
      await handleGeneratorEvent(evt, db);
      return;
    }

    // Log unhandled collections
    logger.debug(
      { collection: evt.collection, event: evt.event },
      "Unhandled collection type",
    );
  } catch (error) {
    logger.error({ error }, "Error in event handler");
  }
}
