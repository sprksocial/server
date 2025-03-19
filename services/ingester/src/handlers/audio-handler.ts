import { pino } from 'pino'
import { Database } from '../db/connection.js'
import type { NormalizedEvent } from '../types/events.js'

const logger = pino({ name: 'audio-handler' })

export async function handleAudioEvent(evt: NormalizedEvent, db: Database): Promise<void> {
  if (evt.collection !== 'so.sprk.feed.audio') {
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
    logger.warn({ uri: evt.uri }, 'Audio event missing record data')
    return
  }

  logger.info({
    did: evt.did,
    handle: evt.handle,
    collection: evt.collection,
    uri: evt.uri,
  }, 'Processing audio event')

  try {
    const audioData = {
      uri: evt.uri,
      sound: record.sound?.ref,
      origin: {
        uri: record.origin.uri,
        cid: record.origin.cid
      },
      title: record.title,
      text: record.text,
      labels: record.labels,
      authorDid: evt.did,
      authorHandle: evt.handle || 'unknown',
      createdAt: record.createdAt,
      indexedAt: now.toISOString()
    }

    await db.models.Audio.findOneAndUpdate(
      { uri: evt.uri },
      audioData,
      { upsert: true, new: true }
    )

    logger.info(
      { uri: evt.uri },
      'Successfully saved audio to database'
    )
  } catch (error) {
    logger.error(
      { error, uri: evt.uri },
      'Failed to save audio to database'
    )
  }
}

async function handleDelete(evt: NormalizedEvent, db: Database): Promise<void> {
  try {
    const result = await db.models.Audio.deleteOne({ uri: evt.uri })

    if (result.deletedCount > 0) {
      logger.info({ uri: evt.uri }, 'Successfully removed audio from database')
      return
    }

    logger.warn({ uri: evt.uri }, 'Audio not found in database for deletion')
  } catch (error) {
    logger.error({ error, uri: evt.uri }, 'Failed to delete audio from database')
  }
}