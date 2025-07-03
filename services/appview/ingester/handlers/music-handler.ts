import { pino } from "pino";
import { customConfig } from "../utils/logger-config.ts";
import { Database } from "../../data-plane/server/index.ts";
import type { NormalizedEvent } from "../types/events.ts";

const logger = pino(customConfig("music-handler"));

export async function handleMusicEvent(
  evt: NormalizedEvent,
  db: Database,
): Promise<void> {
  if (evt.collection !== "so.sprk.feed.music") {
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
    sound?: { ref: string };
    title: string;
    author: string;
    releaseDate: string;
    album?: string;
    recordLabel?: string;
    cover?: { ref: string };
    text?: string;
    copyright?: string[];
    facets?: Array<{
      index: {
        byteStart: number;
        byteEnd: number;
      };
      features: Array<{
        $type: string;
        uri?: string;
        did?: string;
        tag?: string;
      }>;
    }>;
    labels?: Array<{
      src: string;
      uri: string;
      cid: string;
      val: string;
      neg: boolean;
    }>;
    tags?: string[];
    createdAt?: string;
  };

  if (!record) {
    logger.warn({ uri: evt.uri }, "Music event missing record data");
    return;
  }

  logger.info({
    did: evt.did,
    handle: evt.handle,
    collection: evt.collection,
    uri: evt.uri,
  }, "Processing music event");

  try {
    const musicData = {
      uri: evt.uri,
      sound: record.sound?.ref,
      title: record.title,
      author: record.author,
      releaseDate: record.releaseDate,
      album: record.album,
      recordLabel: record.recordLabel,
      cover: record.cover?.ref,
      text: record.text,
      copyright: record.copyright,
      facets: record.facets || [],
      labels: record.labels,
      tags: record.tags || [],
      authorDid: evt.did,
      authorHandle: evt.handle || "unknown",
      createdAt: record.createdAt,
      indexedAt: now.toISOString(),
      cid: evt.commit.cid,
    };

    await db.models.Music.findOneAndUpdate(
      { uri: evt.uri },
      musicData,
      { upsert: true, new: true },
    );

    logger.info(
      { uri: evt.uri },
      "Successfully saved music to database",
    );
  } catch (error) {
    logger.error(
      { error, uri: evt.uri },
      "Failed to save music to database",
    );
  }
}

async function handleDelete(evt: NormalizedEvent, db: Database): Promise<void> {
  try {
    const result = await db.models.Music.deleteOne({ uri: evt.uri });

    if (result.deletedCount > 0) {
      logger.info({ uri: evt.uri }, "Successfully removed music from database");
      return;
    }

    logger.warn({ uri: evt.uri }, "Music not found in database for deletion");
  } catch (error) {
    logger.error(
      { error, uri: evt.uri },
      "Failed to delete music from database",
    );
  }
}
