import { pino } from 'pino'
import WebSocket from 'ws'
import { env } from './env.js'
import type { JetstreamEvent, NormalizedEvent } from '../types/events.js'
import { Database } from '../db/connection.js'
import type { BidirectionalResolver } from './id-resolver.js'
import { handleEvent } from '../handlers/index.js'

const logger = pino({ name: 'jetstream-client' })

export interface JetstreamClientOptions {
  filterCollections?: string[]
  initialCursor?: number | null
}

export async function createJetstreamClient(
  db: Database,
  resolver: BidirectionalResolver,
) {
  // Load initial cursor from DB
  let cursorPosition: number | null = await db.getCursorState()
  if (cursorPosition) {
    logger.info({ initialCursor: cursorPosition }, 'Loaded initial cursor from DB')
  } else {
    logger.info('No initial cursor found in DB, will start from live feed.')
  }

  let wsConnection: WebSocket | null = null
  let heartbeatInterval: Timer | null = null

  function connect(options: JetstreamClientOptions = {}): {
    close: () => void
  } {
    // Use the loaded cursorPosition as default if no initialCursor is provided in options
    const { filterCollections = ['so.sprk.*'], initialCursor = cursorPosition } = options

    // Update cursorPosition if an initialCursor was explicitly passed in options or from DB
    if (initialCursor) {
      cursorPosition = initialCursor
    }

    let url = filterCollections.reduce((acc, collection) => {
      return `${acc}&wantedCollections=${collection}`
    }, `${env.JETSTREAM_URL}?`)

    if (cursorPosition) {
      // Subtract a few seconds (in microseconds) to ensure no gaps
      const rewindCursor = parseInt(cursorPosition.toString()) - 5000000 // 5 seconds in microseconds
      url += `&cursor=${rewindCursor}`
    }

    logger.info(`Connecting to Jetstream: ${url}`)

    wsConnection = new WebSocket(url)

    wsConnection.on('open', () => {
      logger.info('Connected to Jetstream')
    })

    wsConnection.on('message', async (data) => {
      try {
        const event = JSON.parse(data.toString()) as JetstreamEvent

        // Save cursor position for each event
        if (event.time_us) {
          cursorPosition = event.time_us
        }

        // Process events
        await processEvent(event)

        // Save cursor position after processing the event
        if (cursorPosition) {
          await db.saveCursorState(cursorPosition)
        }
      } catch (error) {
        logger.error({ error }, 'Error parsing or processing message')
      }
    })

    wsConnection.on('error', (error) => {
      logger.error({ error }, 'WebSocket error')
      handleReconnect(options)
    })

    wsConnection.on('close', () => {
      logger.info('Connection closed. Attempting to reconnect...')
      handleReconnect(options)
    })

    // Setup heartbeat to keep the connection alive
    heartbeatInterval = setInterval(() => {
      if (wsConnection && wsConnection.readyState === WebSocket.OPEN) {
        wsConnection.ping()
      } else {
        clearHeartbeatInterval()
      }
    }, 30000)

    return {
      close: () => {
        clearHeartbeatInterval()
        if (wsConnection && wsConnection.readyState === WebSocket.OPEN) {
          wsConnection.close()
          wsConnection = null
        }
      },
    }
  }

  function clearHeartbeatInterval() {
    if (heartbeatInterval) {
      clearInterval(heartbeatInterval)
      heartbeatInterval = null
    }
  }

  function handleReconnect(options: JetstreamClientOptions) {
    clearHeartbeatInterval()

    if (wsConnection) {
      wsConnection = null
    }

    // Use setTimeout to avoid immediate reconnection
    setTimeout(() => connect(options), 5000)
  }

  async function processEvent(event: JetstreamEvent) {
    // Only process commit events
    if (event.kind !== 'commit') {
      return
    }

    // Extract REV for idempotency check
    const { rev } = event.commit
    if (!rev) {
      logger.warn({ event }, 'Event commit is missing rev, cannot ensure idempotency. Skipping.')
      return
    }

    // Check if event has already been processed
    try {
      const alreadyProcessed = await db.hasProcessedEvent(rev)
      if (alreadyProcessed) {
        logger.info({ rev }, 'Event already processed, skipping.')
        return
      }
    } catch (error) {
      logger.error({ rev, error }, 'Error checking for processed event. Proceeding with caution.')
      // Depending on desired behavior, you might want to return here or retry.
      // For now, we proceed but log the error.
    }

    const { did, time_us } = event
    const { operation, collection, rkey, record, cid } = event.commit // cid might still be needed by handleEvent

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
    } catch (error) {
      logger.warn(
        { did, error: (error as Error).message },
        'Failed to resolve DID to handle',
      )
    }

    // Construct a normalized event object
    const normalizedEvent: NormalizedEvent = {
      did,
      handle,
      commit: event.commit,
      time_us,
      event: operation,
      collection,
      rkey,
      record,
      uri: `at://${did}/${collection}/${rkey}`,
    }

    // Process the normalized event
    await handleEvent(normalizedEvent, db)

    // Record the event as processed
    try {
      await db.recordProcessedEvent(rev)
    } catch (error) {
      logger.error({ rev, error }, 'Error recording processed event after handling.')
      // This is a critical error if the event was processed but not recorded,
      // as it could lead to reprocessing. Consider further error handling or alerting.
    }
  }

  return { connect }
}
