import { pino } from 'pino'
import { Database } from '../db/connection.js'
import type { NormalizedEvent } from '../types/events.js'

const logger = pino({ name: 'post-handler' })

export async function handlePostEvent(evt: NormalizedEvent, db: Database): Promise<void> {
  // Skip if not a post event
  if (evt.collection !== 'so.sprk.feed.post') {
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

  if (!record) {
    logger.warn({ uri: evt.uri }, 'Post event missing record data')
    return
  }

  logger.info({
    did: evt.did,
    handle: evt.handle,
    collection: evt.collection,
    uri: evt.uri,
  }, 'Processing post event')

  try {
    // Extract post data from record
    const postData = {
      uri: evt.uri,
      text: record.text,
      facets: record.facets || [],
      reply: record.reply || null,
      embed: record.embed || null,
      sound: record.sound || null,
      langs: record.langs || [],
      labels: record.labels || null,
      tags: record.tags || [],
      authorDid: evt.did,
      authorHandle: evt.handle || 'unknown',
      createdAt: record.createdAt,
      indexedAt: now.toISOString(),
      cid: evt.commit.cid
    }

    // Create or update the post record
    await db.models.Post.findOneAndUpdate(
      { uri: evt.uri },
      postData,
      { upsert: true, new: true }
    )

    logger.info(
      { uri: evt.uri },
      'Successfully saved post to database'
    )
  } catch (error) {
    logger.error(
      { error, uri: evt.uri },
      'Failed to save post to database'
    )
  }
}

async function handleDelete(evt: NormalizedEvent, db: Database): Promise<void> {
  try {
    const result = await db.models.Post.deleteOne({ uri: evt.uri })

    if (result.deletedCount > 0) {
      logger.info({ uri: evt.uri }, 'Successfully removed post from database')
    } else {
      logger.warn({ uri: evt.uri }, 'Post not found in database for deletion')
    }
  } catch (error) {
    logger.error({ error, uri: evt.uri }, 'Failed to delete post from database')
  }
}