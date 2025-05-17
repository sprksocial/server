import { pino } from 'pino'
import WebSocket from 'ws'
import { env } from './env.js'
import type { JetstreamEvent, NormalizedEvent } from '../types/events.js'
import { Database } from '../db/connection.js'
import type { BidirectionalResolver } from './id-resolver.js'
import { handleEvent } from '../handlers/index.js'
import { customConfig } from './logger-config.js'

const logger = pino(customConfig('jetstream-client'))

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
    logger.info(
      { initialCursor: cursorPosition },
      'Loaded initial cursor from DB',
    )
  } else {
    logger.info('No initial cursor found in DB, will start from live feed.')
  }

  let wsConnection: WebSocket | null = null
  let heartbeatInterval: Timer | null = null
  let saveCursorInterval: Timer | null = null // Added for periodic cursor saving

  function connect(options: JetstreamClientOptions = {}): {
    close: () => void
  } {
    // Use the loaded cursorPosition as default if no initialCursor is provided in options
    const {
      filterCollections = ['so.sprk.*'],
      initialCursor = cursorPosition,
    } = options

    // Update cursorPosition if an initialCursor was explicitly passed in options or from DB
    if (initialCursor) {
      cursorPosition = initialCursor
    }

    let url = filterCollections.reduce((acc, collection) => {
      return `${acc}wantedCollections=${collection}&`
    }, `${env.JETSTREAM_URL}?`)

    if (cursorPosition) {
      // Subtract a few seconds (in microseconds) to ensure no gaps
      const rewindCursor = parseInt(cursorPosition.toString()) - 5000000 // 5 seconds in microseconds
      url += `cursor=${rewindCursor}`
    }

    logger.info(`Connecting to Jetstream: ${url}`)

    wsConnection = new WebSocket(url)

    wsConnection.on('open', () => {
      logger.info('Connected to Jetstream')
      // Start periodic cursor saving only after successful connection
      startPeriodicCursorSave()
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
        clearSaveCursorInterval() // Clear cursor save interval on close/error
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

  function clearSaveCursorInterval() {
    if (saveCursorInterval) {
      clearInterval(saveCursorInterval)
      saveCursorInterval = null
    }
  }

  function startPeriodicCursorSave() {
    clearSaveCursorInterval() // Clear any existing interval first
    saveCursorInterval = setInterval(async () => {
      if (cursorPosition !== null) {
        try {
          await db.saveCursorState(cursorPosition)
          logger.debug({ cursorPosition }, 'Periodically saved cursor state')
        } catch (error) {
          logger.error(
            { cursorPosition, error },
            'Failed to periodically save cursor state',
          )
        }
      }
    }, 30000) // Save every 30 seconds
  }

  function handleReconnect(options: JetstreamClientOptions) {
    clearHeartbeatInterval()
    clearSaveCursorInterval() // Clear cursor save interval before reconnecting

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

    const { did, time_us } = event
    const { operation, collection, rkey, record } = event.commit

    logger.debug(
      `Processing ${operation} operation for DID: ${did}, collection: ${collection}, rkey: ${rkey}`,
    )

    // Resolve DID to handle if needed
    let handle = null
    // try {
    //   if (did) {
    //     const didData = await resolver.resolveDidToDidDoc(did)
    //     handle = didData.handle
    //   }
    // } catch (error) {
    //   logger.warn(
    //     { did, error: (error as Error).message },
    //     'Failed to resolve DID to handle',
    //   )
    // }

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
  }

  return { connect }
}
