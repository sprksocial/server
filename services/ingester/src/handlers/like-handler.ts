import { pino } from 'pino'
import { customConfig } from '../utils/logger-config.js'
import { Database } from '../db/connection.js'
import type { NormalizedEvent } from '../types/events.js'

const logger = pino(customConfig('like-handler'))

export async function handleLikeEvent(evt: NormalizedEvent, db: Database): Promise<void> {
  // Skip if not a like event
  if (evt.collection !== 'so.sprk.feed.like') {
    return
  }

  if (evt.event === 'create' || evt.event === 'update') {
    await handleCreateOrUpdate(evt, db)
  } else if (evt.event === 'delete') {
    await handleDelete(evt, db)
  }
}

async function handleCreateOrUpdate(evt: NormalizedEvent, db: Database): Promise<void> {
  const now = new Date()
  const record = evt.record

  // Verify the subject URI exists
  if (!record?.subject?.uri) {
    logger.warn({ uri: evt.uri }, 'Like event missing subject URI')
    return
  }

  logger.info({
    did: evt.did,
    handle: evt.handle,
    collection: evt.collection,
    uri: evt.uri,
    subject: record.subject.uri,
  }, 'Processing like event')

  try {
    // Create or update the like record
    await db.models.Like.findOneAndUpdate(
      { uri: evt.uri },
      {
        uri: evt.uri,
        subject: record.subject.uri,
        subjectCid: record.subject.cid,
        authorDid: evt.did,
        authorHandle: evt.handle || 'unknown',
        createdAt: record.createdAt || now.toISOString(),
        indexedAt: now.toISOString(),
        cid: evt.commit.cid,
      },
      { upsert: true, new: true },
    )

    logger.info(
      { uri: evt.uri, subject: record.subject.uri },
      'Successfully saved like to database'
    )
  } catch (error) {
    logger.error(
      { error, uri: evt.uri },
      'Failed to save like to database'
    )
  }
}

async function handleDelete(evt: NormalizedEvent, db: Database): Promise<void> {
  try {
    const result = await db.models.Like.deleteOne({ uri: evt.uri })

    if (result.deletedCount > 0) {
      logger.info({ uri: evt.uri }, 'Successfully removed like from database')
    } else {
      logger.warn({ uri: evt.uri }, 'Like not found in database for deletion')
    }
  } catch (error) {
    logger.error({ error, uri: evt.uri }, 'Failed to delete like from database')
  }
}