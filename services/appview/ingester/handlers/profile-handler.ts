import { pino } from "pino";
import { customConfig } from "../utils/logger-config.ts";
import { Database } from "../../data-plane/server/index.ts";
import type { NormalizedEvent } from "../types/events.ts";
import { ensureActor, linkProfileToActor } from "../utils/actor-utils.ts";
import type { ProfileDocument } from "../../data-plane/server/index.ts";

const logger = pino(customConfig("profile-handler"));

export async function handleProfileEvent(
  evt: NormalizedEvent,
  db: Database,
): Promise<void> {
  if (evt.collection !== "so.sprk.actor.profile") {
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
  const record = evt.record;

  if (!record) {
    logger.warn({ uri: evt.uri }, "Profile event missing record data");
    return;
  }

  logger.info({
    did: evt.did,
    handle: evt.handle,
    collection: evt.collection,
    uri: evt.uri,
  }, "Processing profile event");

  try {
    // First, ensure we have an actor for this DID
    await ensureActor(evt.did, evt.handle || undefined, db);

    const profileData = {
      uri: evt.uri,
      displayName: record.displayName,
      description: record.description,
      avatar: record.avatar,
      banner: record.banner,
      labels: record.labels,
      joinedViaStarterPack: record.joinedViaStarterPack,
      pinnedPost: record.pinnedPost,
      authorDid: evt.did,
      authorHandle: evt.handle || "unknown.invalid",
      createdAt: record.createdAt,
      indexedAt: now.toISOString(),
      cid: evt.commit.cid,
    };

    // Save the profile
    const profile = await db.models.Profile.findOneAndUpdate(
      { uri: evt.uri },
      profileData,
      { upsert: true, new: true },
    ) as ProfileDocument;

    if (profile && profile._id) {
      // Link the profile to the actor
      await linkProfileToActor(
        evt.did,
        profile._id.toString(),
        evt.commit.cid,
        db,
      );
    }

    logger.info(
      { uri: evt.uri },
      "Successfully saved profile to database and linked to actor",
    );
  } catch (error) {
    logger.error(
      { error, uri: evt.uri },
      "Failed to save profile to database",
    );
  }
}

async function handleDelete(evt: NormalizedEvent, db: Database): Promise<void> {
  try {
    const result = await db.models.Profile.deleteOne({ uri: evt.uri });

    if (result.deletedCount > 0) {
      logger.info(
        { uri: evt.uri },
        "Successfully removed profile from database",
      );
      return;
    }

    logger.warn({ uri: evt.uri }, "Profile not found in database for deletion");
  } catch (error) {
    logger.error(
      { error, uri: evt.uri },
      "Failed to delete profile from database",
    );
  }
}
