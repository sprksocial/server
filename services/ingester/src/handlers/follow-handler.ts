import { pino } from 'pino'
import { Database } from '../db/connection.js'
import type { NormalizedEvent } from '../types/events.js'

const logger = pino({ name: 'follow-handler' })

export async function handleFollowEvent(evt: NormalizedEvent, db: Database): Promise<void> {
  if (evt.collection !== 'so.sprk.graph.follow') {
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
    logger.warn({ uri: evt.uri }, 'Follow event missing record data')
    return
  }

  logger.info({
    did: evt.did,
    handle: evt.handle,
    collection: evt.collection,
    uri: evt.uri,
  }, 'Processing follow event')

  try {
    const followData = {
      uri: evt.uri,
      subject: record.subject,
      authorDid: evt.did,
      authorHandle: evt.handle || 'unknown',
      createdAt: record.createdAt,
      indexedAt: now.toISOString(),
      cid: evt.commit.cid
    }

    await db.models.Follow.findOneAndUpdate(
      { uri: evt.uri },
      followData,
      { upsert: true, new: true }
    )

    logger.info(
      { uri: evt.uri },
      'Successfully saved follow to database'
    )
  } catch (error) {
    logger.error(
      { error, uri: evt.uri },
      'Failed to save follow to database'
    )
  }
}

async function handleDelete(evt: NormalizedEvent, db: Database): Promise<void> {
  try {
    const result = await db.models.Follow.deleteOne({ uri: evt.uri })

    if (result.deletedCount > 0) {
      logger.info({ uri: evt.uri }, 'Successfully removed follow from database')
      return
    }

    logger.warn({ uri: evt.uri }, 'Follow not found in database for deletion')
  } catch (error) {
    logger.error({ error, uri: evt.uri }, 'Failed to delete follow from database')
  }
}