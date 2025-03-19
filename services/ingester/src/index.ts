import { pino } from 'pino'
import { Database } from './db/connection.js'
import {
  createIdResolver,
  createBidirectionalResolver,
} from './utils/id-resolver.js'
import { createJetstreamClient } from './utils/jetstream-client.js'

const logger = pino({
  name: 'ingester',
  transport: {
    target: 'pino-pretty',
  },
})

async function main() {
  logger.info('Starting Jetstream ingester service')

  // Set up database connection
  const db = new Database()
  try {
    await db.connect()
  } catch (err) {
    logger.error({ err }, 'Failed to connect to database')
    process.exit(1)
  }

  // Create ID resolver
  const resolver = createIdResolver()
  const bidirectionalResolver = createBidirectionalResolver(resolver)

  // Create and start Jetstream client
  const jetstreamClient = createJetstreamClient(db, bidirectionalResolver)
  const connection = jetstreamClient.connect({
    filterCollections: ['so.sprk.*'],
  })

  // Handle shutdown gracefully
  const shutdown = async () => {
    logger.info('Shutting down...')
    connection.close()
    await db.disconnect()
    process.exit(0)
  }

  process.on('SIGINT', shutdown)
  process.on('SIGTERM', shutdown)

  logger.info('Ingester service is running')
}

main().catch((err) => {
  logger.error({ err }, 'Fatal error in main process')
  process.exit(1)
})
