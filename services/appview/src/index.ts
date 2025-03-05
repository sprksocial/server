import { createDb, migrateToLatest } from './db.js'
import { createClient } from './auth/client.js'
import { pino } from 'pino'
import { Database } from './db.js'
import { createIngester } from './ingester.js'
import {
  BidirectionalResolver,
  createBidirectionalResolver,
  createIdResolver,
} from './id-resolver.js'
import type { OAuthClient } from '@atproto/oauth-client-node'
import { Firehose } from '@atproto/sync'
import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { createAuthRouter } from './auth/login.js'
import { env } from './env.js'
import { serve } from '@hono/node-server'
import { HTTPException } from 'hono/http-exception'

export type AppContext = {
  db: Database
  ingester: Firehose
  logger: pino.Logger
  oauthClient: OAuthClient
  resolver: BidirectionalResolver
}

export class Server {
  constructor(
    public app: Hono,
    public ctx: AppContext,
  ) {}

  static async create() {
    const appLogger = pino({ name: 'server start' })

    const db = createDb()
    await migrateToLatest(db)

    const oauthClient = await createClient(db)
    const baseIdResolver = createIdResolver()
    const ingester = createIngester(db, baseIdResolver)
    const resolver = createBidirectionalResolver(baseIdResolver)

    const ctx = {
      db,
      ingester,
      logger: appLogger,
      oauthClient,
      resolver,
    }

    // Subscribe to events on the firehose
    ingester.start()

    const app = new Hono()

    // Middleware
    app.use('*', logger())

    // Auth routes
    const authRouter = createAuthRouter(ctx)
    app.route('/', authRouter)

    // Root route
    app.get('/', (c) => {
      return c.text('Hello Hono')
    })

    app.onError((err, c) => {
      if (err instanceof HTTPException) {
        // Known HTTP error, just return it
        return err.getResponse()
      }
      appLogger.error({ err }, 'Server error')
      return c.json(
        {
          error: 'Internal Server Error',
          message: 'An unexpected error occurred',
        },
        500,
      )
    })

    return new Server(app, ctx)
  }

  async close() {
    this.ctx.logger.info('Shutting down server')
    await this.ctx.ingester.destroy()
  }

  start() {
    const { HOST, PORT } = env
    this.ctx.logger.info(`Server starting on http://${HOST}:${PORT}`)
    return serve({
      fetch: this.app.fetch,
      port: PORT,
      hostname: HOST,
    })
  }
}

const run = async () => {
  try {
    const server = await Server.create()
    server.start()

    // Handle shutdown gracefully
    process.on('SIGINT', async () => {
      await server.close()
      process.exit(0)
    })

    process.on('SIGTERM', async () => {
      await server.close()
      process.exit(0)
    })
  } catch (err) {
    console.error('Failed to start server:', err)
    process.exit(1)
  }
}

run()
