import { pino } from 'pino'
import { Database } from '../db/connection.js'
import type { NormalizedEvent } from '../types/events.js'
import { handleLikeEvent } from './like-handler.js'
import { handlePostEvent } from './post-handler.js'
import { handleFollowEvent } from './follow-handler.js'
import { handleBlockEvent } from './block-handler.js'
import { handleProfileEvent } from './profile-handler.js'
import { handleAudioEvent } from './audio-handler.js'
import { handleRepostEvent } from './repost-handler.js'
import { handleMusicEvent } from './music-handler.js'

const logger = pino({ name: 'event-handler' })

export async function handleEvent(evt: NormalizedEvent, db: Database): Promise<void> {
  try {
    // Handle different events based on collection
    if (evt.collection === 'so.sprk.feed.like') {
      await handleLikeEvent(evt, db)
      return
    }

    if (evt.collection === 'so.sprk.feed.post') {
      await handlePostEvent(evt, db)
      return
    }

    if (evt.collection === 'so.sprk.graph.follow') {
      await handleFollowEvent(evt, db)
      return
    }

    if (evt.collection === 'so.sprk.graph.block') {
      await handleBlockEvent(evt, db)
      return
    }

    if (evt.collection === 'so.sprk.actor.profile') {
      await handleProfileEvent(evt, db)
      return
    }

    if (evt.collection === 'so.sprk.feed.audio') {
      await handleAudioEvent(evt, db)
      return
    }

    if (evt.collection === 'so.sprk.feed.repost') {
      await handleRepostEvent(evt, db)
      return
    }

    if (evt.collection === 'so.sprk.feed.music') {
      await handleMusicEvent(evt, db)
      return
    }

    // Log unhandled collections
    logger.debug(
      { collection: evt.collection, event: evt.event },
      'Unhandled collection type'
    )
  } catch (error) {
    logger.error({ error }, 'Error in event handler')
  }
}