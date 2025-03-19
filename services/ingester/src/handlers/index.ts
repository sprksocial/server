import { pino } from 'pino'
import { Database } from '../db/connection.js'
import type { NormalizedEvent } from '../types/events.js'
import { handleLikeEvent } from './like-handler.js'

const logger = pino({ name: 'event-handler' })

export async function handleEvent(evt: NormalizedEvent, db: Database): Promise<void> {
  try {
    // Handle different events based on collection
    if (evt.collection.startsWith('so.sprk.feed.like')) {
      await handleLikeEvent(evt, db)
      return
    }

    // Add more handlers here as needed

    // Log unhandled collections
    logger.debug(
      { collection: evt.collection, event: evt.event },
      'Unhandled collection type'
    )
  } catch (error) {
    logger.error({ error }, 'Error in event handler')
  }
}