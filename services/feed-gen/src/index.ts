import { Hono } from 'hono'
import { pino } from 'pino'
import wellKnownRouter from './routes/well-known'
import xrpcRouter from './routes/xrpc'
import { Database } from './db/connection.js'

const logger = pino({
  name: 'feed-gen',
  transport: {
    target: 'pino-pretty',
  },
})

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

// Initialize database connection when server starts
let db: Database

export async function initializeApp() {
  logger.info('Starting Feed Generator service')

  // Set up database connection
  db = new Database()
  try {
    await db.connect()
  } catch (err) {
    logger.error({ err }, 'Failed to connect to database')
    process.exit(1)
  }

  // Handle shutdown gracefully
  const shutdown = async () => {
    logger.info('Shutting down...')
    await db.disconnect()
    process.exit(0)
  }

  process.on('SIGINT', shutdown)
  process.on('SIGTERM', shutdown)

  logger.info('Feed Generator service is running')

  app.route('/', wellKnownRouter())

  app.route('/xrpc', xrpcRouter(db))
  return app
}

// For development and testing
if (process.env.NODE_ENV !== 'test') {
  initializeApp().catch((err) => {
    logger.error({ err }, 'Fatal error in main process')
    process.exit(1)
  })
}

export default app