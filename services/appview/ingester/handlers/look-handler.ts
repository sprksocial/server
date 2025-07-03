import { pino } from "pino";
import { customConfig } from "../utils/logger-config.ts";
import { Database } from "../../data-plane/server/index.ts";
import type { NormalizedEvent } from "../types/events.ts";

const logger = pino(customConfig("look-handler"));

export async function handleLookEvent(
  evt: NormalizedEvent,
  db: Database,
): Promise<void> {
  if (evt.collection !== "so.sprk.feed.look") {
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
    logger.warn({ uri: evt.uri }, "Look event missing record data");
    return;
  }

  logger.info({
    did: evt.did,
    handle: evt.handle,
    collection: evt.collection,
    uri: evt.uri,
  }, "Processing look event");

  try {
    const lookData = {
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

    await db.models.Look.findOneAndUpdate(
      { uri: evt.uri },
      lookData,
      { upsert: true, new: true },
    );

    logger.info(
      { uri: evt.uri },
      "Successfully saved look to database",
    );
  } catch (error) {
    logger.error(
      { error, uri: evt.uri },
      "Failed to save look to database",
    );
  }
}

async function handleDelete(evt: NormalizedEvent, db: Database): Promise<void> {
  try {
    const result = await db.models.Look.deleteOne({ uri: evt.uri });

    if (result.deletedCount > 0) {
      logger.info({ uri: evt.uri }, "Successfully removed look from database");
      return;
    }

    logger.warn({ uri: evt.uri }, "Look not found in database for deletion");
  } catch (error) {
    logger.error(
      { error, uri: evt.uri },
      "Failed to delete look from database",
    );
  }
}
