import { pino } from "pino";
import { customConfig } from "../utils/logger-config.ts";
import { Database } from "../../data-plane/server/index.ts";
import type { NormalizedEvent } from "../types/events.ts";

const logger = pino(customConfig("generator-handler"));

export async function handleGeneratorEvent(
  evt: NormalizedEvent,
  db: Database,
): Promise<void> {
  // Skip if not a generator event
  if (evt.collection !== "so.sprk.feed.generator") {
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
    logger.warn({ uri: evt.uri }, "Generator event missing record data");
    return;
  }

  logger.info({
    did: evt.did,
    handle: evt.handle,
    collection: evt.collection,
    uri: evt.uri,
  }, "Processing generator event");

  try {
    // Extract generator data from record
    const generatorData = {
      uri: evt.uri,
      did: record.did,
      displayName: record.displayName,
      description: record.description || null,
      descriptionFacets: record.descriptionFacets || [],
      avatar: record.avatar || null,
      acceptsInteractions: record.acceptsInteractions || false,
      labels: record.labels || null,
      contentMode: record.contentMode || null,
      authorDid: evt.did,
      authorHandle: evt.handle || "unknown",
      createdAt: record.createdAt,
      indexedAt: now.toISOString(),
      cid: evt.commit.cid,
    };

    // Create or update the generator record
    await db.models.Generator.findOneAndUpdate(
      { uri: evt.uri },
      generatorData,
      { upsert: true, new: true },
    );

    logger.info(
      { uri: evt.uri },
      "Successfully saved generator to database",
    );
  } catch (error) {
    logger.error(
      { error, uri: evt.uri },
      "Failed to save generator to database",
    );
  }
}

async function handleDelete(evt: NormalizedEvent, db: Database): Promise<void> {
  try {
    const result = await db.models.Generator.deleteOne({ uri: evt.uri });

    if (result.deletedCount > 0) {
      logger.info(
        { uri: evt.uri },
        "Successfully removed generator from database",
      );
    } else {
      logger.warn(
        { uri: evt.uri },
        "Generator not found in database for deletion",
      );
    }
  } catch (error) {
    logger.error(
      { error, uri: evt.uri },
      "Failed to delete generator from database",
    );
  }
}
