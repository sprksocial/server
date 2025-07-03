import { pino } from "pino";
import { Database } from "../../data-plane/server/index.ts";
import type { NormalizedEvent } from "../types/events.ts";
import { customConfig } from "../utils/logger-config.ts";

const logger = pino(customConfig("repost-handler"));

export async function handleRepostEvent(
  evt: NormalizedEvent,
  db: Database,
): Promise<void> {
  if (evt.collection !== "so.sprk.feed.repost") {
    return;
  }

  if (evt.event === "create" || evt.event === "update") {
    await handleCreateOrUpdate(evt, db);
    return;
  }

  if (evt.event === "delete") {
    await handleDelete(evt, db);
    return;
  }
}

async function handleCreateOrUpdate(
  evt: NormalizedEvent,
  db: Database,
): Promise<void> {
  const now = new Date();
  const record = evt.record as {
    subject: { uri: string; cid: string };
    createdAt?: string;
  };

  if (!record) {
    logger.warn({ uri: evt.uri }, "Repost event missing record data");
    return;
  }

  logger.info({
    did: evt.did,
    handle: evt.handle,
    collection: evt.collection,
    uri: evt.uri,
  }, "Processing repost event");

  try {
    const repostData = {
      uri: evt.uri,
      subject: {
        uri: record.subject.uri,
        cid: record.subject.cid,
      },
      authorDid: evt.did,
      authorHandle: evt.handle || "unknown",
      createdAt: record.createdAt,
      indexedAt: now.toISOString(),
      cid: evt.commit.cid,
    };

    await db.models.Repost.findOneAndUpdate(
      { uri: evt.uri },
      repostData,
      { upsert: true, new: true },
    );

    logger.info(
      { uri: evt.uri },
      "Successfully saved repost to database",
    );
  } catch (error) {
    logger.error(
      { error, uri: evt.uri },
      "Failed to save repost to database",
    );
  }
}

async function handleDelete(evt: NormalizedEvent, db: Database): Promise<void> {
  try {
    const result = await db.models.Repost.deleteOne({ uri: evt.uri });

    if (result.deletedCount > 0) {
      logger.info(
        { uri: evt.uri },
        "Successfully removed repost from database",
      );
      return;
    }

    logger.warn({ uri: evt.uri }, "Repost not found in database for deletion");
  } catch (error) {
    logger.error(
      { error, uri: evt.uri },
      "Failed to delete repost from database",
    );
  }
}
