import { pino } from 'pino'
import WebSocket from 'ws'
import type { Database } from './db.js'
import { BidirectionalResolver } from './id-resolver.js'

// Define types for the Jetstream events
interface JetstreamEvent {
  kind: string
  time_us: number
  did: string
  commit: {
    operation: 'create' | 'update' | 'delete'
    collection: string
    rkey: string
    record: any
    cid: string
  }
}

interface NormalizedEvent {
  did: string
  handle: string | null
  commit: {
    operation: 'create' | 'update' | 'delete'
    collection: string
    rkey: string
    record: any
    cid: string
  }
  time_us: number
  event: 'create' | 'update' | 'delete'
  collection: string
  rkey: string
  record: any
  uri: string
}

export function createIngester(db: Database, resolver: BidirectionalResolver) {
  const logger = pino({ name: 'jetstream ingestion' })

  const JETSTREAM_URL = 'wss://jetstream2.us-east.bsky.network/subscribe'
  let cursorPosition: number | null = null

  // Connect to Jetstream and process events
  function connectToJetstream(filterCollections: string[] = ['so.sprk.*']) {
    // Build the URL with query parameters
    const collectionsParam = filterCollections.join(',')
    let url = `${JETSTREAM_URL}?wantedCollections=${collectionsParam}`

    if (cursorPosition) {
      // Subtract a few seconds (in microseconds) to ensure no gaps
      const rewindCursor = parseInt(cursorPosition.toString()) - 5000000 // 5 seconds in microseconds
      url += `&cursor=${rewindCursor}`
    }

    logger.info(`Connecting to Jetstream: ${url}`)

    const ws = new WebSocket(url)

    ws.on('open', () => {
      logger.info('Connected to Jetstream')
    })

    ws.on('message', async (data) => {
      try {
        const event = JSON.parse(data.toString()) as JetstreamEvent

        // Save cursor position for each event
        if (event.time_us) {
          cursorPosition = event.time_us
        }

        // Process events
        await processEvent(event)
      } catch (error) {
        logger.error({ error }, 'Error parsing or processing message')
      }
    })

    ws.on('error', (error) => {
      logger.error({ error }, 'WebSocket error')
      setTimeout(() => connectToJetstream(filterCollections), 5000) // Reconnect after 5 seconds
    })

    ws.on('close', () => {
      logger.info('Connection closed. Attempting to reconnect...')
      setTimeout(() => connectToJetstream(filterCollections), 5000) // Reconnect after 5 seconds
    })

    // Heartbeat to keep the connection alive
    const interval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.ping()
      } else {
        clearInterval(interval)
      }
    }, 30000)

    return {
      close: () => {
        clearInterval(interval)
        if (ws.readyState === WebSocket.OPEN) {
          ws.close()
        }
      },
    }
  }

  // Process Jetstream events
  async function processEvent(event: JetstreamEvent) {
    try {
      // Only process commit events
      if (event.kind !== 'commit') {
        return
      }

      const { did, time_us } = event
      const { operation, collection, rkey, record, cid } = event.commit

      logger.debug(
        `Processing ${operation} operation for DID: ${did}, collection: ${collection}, rkey: ${rkey}`,
      )

      // Resolve DID to handle if needed
      let handle = null
      try {
        if (did) {
          const didData = await resolver.resolveDidToDidDoc(did)
          handle = didData.handle
        }
      } catch (error: unknown) {
        logger.warn(
          { did, error: (error as Error).message },
          'Failed to resolve DID to handle',
        )
      }

      // Construct a normalized event object that's similar to the old Firehose format
      // for compatibility with existing code
      const normalizedEvent: NormalizedEvent = {
        did,
        handle,
        commit: event.commit,
        time_us,
        event: operation, // 'create', 'update', or 'delete'
        collection,
        rkey,
        record,
        uri: `at://${did}/${collection}/${rkey}`,
      }

      // Call the provided event handler with normalized data
      await handleEvent(normalizedEvent)
    } catch (error) {
      logger.error({ error }, 'Error processing event')
    }
  }

  // Event handler function
  async function handleEvent(evt: NormalizedEvent) {
    try {
      // Watch for create, update, delete events
      if (evt.event === 'create' || evt.event === 'update') {
        const now = new Date()
        const record = evt.record

        // Process so.sprk.feed.like collection (likes)
        if (evt.collection === 'so.sprk.feed.like') {
          // Extract the subject (the post that was liked)
          if (!record?.subject?.uri) {
            logger.warn({ uri: evt.uri }, 'Like event missing subject URI')
            return
          }

          logger.info(
            {
              did: evt.did,
              handle: evt.handle,
              collection: evt.collection,
              uri: evt.uri,
              subject: record.subject.uri,
            },
            'Processing like event',
          )

          // Save the like to the database
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
              },
              { upsert: true, new: true },
            )

            logger.info(
              { uri: evt.uri, subject: record.subject.uri },
              'Successfully saved like to database',
            )
          } catch (dbError) {
            logger.error(
              { error: dbError, uri: evt.uri },
              'Failed to save like to database',
            )
          }
        }

        // Add handling for other collections if needed
      } else if (evt.event === 'delete') {
        // Handle delete operations
        if (evt.collection === 'so.sprk.feed.like') {
          try {
            // Remove the like from the database
            const result = await db.models.Like.deleteOne({ uri: evt.uri })

            if (result.deletedCount > 0) {
              logger.info(
                { uri: evt.uri },
                'Successfully removed like from database',
              )
            } else {
              logger.warn(
                { uri: evt.uri },
                'Like not found in database for deletion',
              )
            }
          } catch (dbError) {
            logger.error(
              { error: dbError, uri: evt.uri },
              'Failed to delete like from database',
            )
          }
        }
      }
    } catch (error) {
      logger.error({ error }, 'Error in event handler')
    }
  }

  return {
    start: () => {
      logger.info('Starting Jetstream consumer...')
      const connection = connectToJetstream()

      return {
        close: () => {
          logger.info('Closing Jetstream connection')
          connection.close()
        },
      }
    },
  }
}
