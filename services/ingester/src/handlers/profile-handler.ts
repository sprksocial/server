import { pino } from 'pino'
import { Database } from '../db/connection.js'
import type { NormalizedEvent } from '../types/events.js'

const logger = pino({ name: 'profile-handler' })

export async function handleProfileEvent(evt: NormalizedEvent, db: Database): Promise<void> {
  if (evt.collection !== 'so.sprk.actor.profile') {
    return
  }

  if (evt.event === 'create' || evt.event === 'update') {
    await handleCreateOrUpdate(evt, db)
    return
  }

  if (evt.event === 'delete') {
    await handleDelete(evt, db)
    return
  }
}

async function handleCreateOrUpdate(evt: NormalizedEvent, db: Database): Promise<void> {
  const now = new Date()
  const record = evt.record

  if (!record) {
    logger.warn({ uri: evt.uri }, 'Profile event missing record data')
    return
  }

  logger.info({
    did: evt.did,
    handle: evt.handle,
    collection: evt.collection,
    uri: evt.uri,
  }, 'Processing profile event')

  try {
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
      authorHandle: evt.handle || 'unknown',
      createdAt: record.createdAt,
      indexedAt: now.toISOString(),
      cid: evt.commit.cid
    }

    await db.models.Profile.findOneAndUpdate(
      { uri: evt.uri },
      profileData,
      { upsert: true, new: true }
    )

    logger.info(
      { uri: evt.uri },
      'Successfully saved profile to database'
    )
  } catch (error) {
    logger.error(
      { error, uri: evt.uri },
      'Failed to save profile to database'
    )
  }
}

async function handleDelete(evt: NormalizedEvent, db: Database): Promise<void> {
  try {
    const result = await db.models.Profile.deleteOne({ uri: evt.uri })

    if (result.deletedCount > 0) {
      logger.info({ uri: evt.uri }, 'Successfully removed profile from database')
      return
    }

    logger.warn({ uri: evt.uri }, 'Profile not found in database for deletion')
  } catch (error) {
    logger.error({ error, uri: evt.uri }, 'Failed to delete profile from database')
  }
}