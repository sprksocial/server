import { pino } from "pino";
import { Database } from "../db/connection.js";
import type { NormalizedEvent } from "../types/events.js";
import { customConfig } from "../utils/logger-config.js";

const logger = pino(customConfig("story-handler"));

export async function handleStoryEvent(
  evt: NormalizedEvent,
  db: Database,
): Promise<void> {
  // Skip if not a story event
  if (evt.collection !== "so.sprk.feed.story") {
    return;
  }

  if (evt.event === "create" || evt.event === "update") {
    await handleCreateOrUpdate(evt, db);
  } else if (evt.event === "delete") {
    await handleDelete(evt, db);
  }
}

async function handleCreateOrUpdate(
  evt: NormalizedEvent,
  db: Database,
): Promise<void> {
  const now = new Date();
  const record = evt.record;

  if (!record) {
    logger.warn({ uri: evt.uri }, "Story event missing record data");
    return;
  }

  logger.info({
    did: evt.did,
    handle: evt.handle,
    collection: evt.collection,
    uri: evt.uri,
  }, "Processing story event");

  try {
    // Extract story data from record
    const storyData = {
      uri: evt.uri,
      media: record.media || null,
      sound: record.sound || null,
      labels: record.labels || null,
      tags: record.tags || [],
      authorDid: evt.did,
      authorHandle: evt.handle || "unknown",
      createdAt: record.createdAt,
      indexedAt: now.toISOString(),
      cid: evt.commit.cid,
    };

    // Create or update the story record
    await db.models.Story.findOneAndUpdate(
      { uri: evt.uri },
      storyData,
      { upsert: true, new: true },
    );

    logger.info(
      { uri: evt.uri },
      "Successfully saved story to database",
    );
  } catch (error) {
    logger.error(
      { error, uri: evt.uri },
      "Failed to save story to database",
    );
  }
}

async function handleDelete(evt: NormalizedEvent, db: Database): Promise<void> {
  try {
    const result = await db.models.Story.deleteOne({ uri: evt.uri });

    if (result.deletedCount > 0) {
      logger.info({ uri: evt.uri }, "Successfully removed story from database");
    } else {
      logger.warn({ uri: evt.uri }, "Story not found in database for deletion");
    }
  } catch (error) {
    logger.error(
      { error, uri: evt.uri },
      "Failed to delete story from database",
    );
  }
}
