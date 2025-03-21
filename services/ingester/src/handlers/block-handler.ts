import { pino } from 'pino'
import { Database } from '../db/connection.js'
import type { NormalizedEvent } from '../types/events.js'

const logger = pino({ name: 'block-handler' })

export async function handleBlockEvent(evt: NormalizedEvent, db: Database): Promise<void> {
  if (evt.collection !== 'so.sprk.graph.block') {
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
    logger.warn({ uri: evt.uri }, 'Block event missing record data')
    return
  }

  logger.info({
    did: evt.did,
    handle: evt.handle,
    collection: evt.collection,
    uri: evt.uri,
  }, 'Processing block event')

  try {
    const blockData = {
      uri: evt.uri,
      subject: record.subject,
      authorDid: evt.did,
      authorHandle: evt.handle || 'unknown',
      createdAt: record.createdAt,
      indexedAt: now.toISOString(),
      cid: evt.commit.cid
    }

    await db.models.Block.findOneAndUpdate(
      { uri: evt.uri },
      blockData,
      { upsert: true, new: true }
    )

    logger.info(
      { uri: evt.uri },
      'Successfully saved block to database'
    )
  } catch (error) {
    logger.error(
      { error, uri: evt.uri },
      'Failed to save block to database'
    )
  }
}

async function handleDelete(evt: NormalizedEvent, db: Database): Promise<void> {
  try {
    const result = await db.models.Block.deleteOne({ uri: evt.uri })

    if (result.deletedCount > 0) {
      logger.info({ uri: evt.uri }, 'Successfully removed block from database')
      return
    }

    logger.warn({ uri: evt.uri }, 'Block not found in database for deletion')
  } catch (error) {
    logger.error({ error, uri: evt.uri }, 'Failed to delete block from database')
  }
}