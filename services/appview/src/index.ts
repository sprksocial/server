import { Database } from './db.js'
import { pino } from 'pino'
import {
  BidirectionalResolver,
  createBidirectionalResolver,
  createIdResolver,
} from './id-resolver.js'
import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { env } from './env.js'
import { serve } from '@hono/node-server'
import { HTTPException } from 'hono/http-exception'
import { authMiddleware, optionalAuthMiddleware } from './auth/middleware.js'
import { createFeedRouter } from './feed/feed.js'
import { createGetPostsRouter } from './routes/getPosts.js'
import { createGetPostThreadRouter } from './routes/getPostThread.js'
import wellKnownRouter from './well-known.js'
import { DidResolver } from '@atproto/identity'

export type AppContext = {
  db: Database
  logger: pino.Logger
  resolver: BidirectionalResolver
  serviceDid: string
  didResolver: DidResolver
}

export class Server {
  constructor(
    public app: Hono,
    public ctx: AppContext,
  ) {}

  static async create() {
    const appLogger = pino({ name: 'server start' })

    const db = new Database()
    await db.connect()

    const baseIdResolver = createIdResolver()
    const resolver = createBidirectionalResolver(baseIdResolver)

    // Get service DID from environment
    const serviceDid = env.SERVICE_DID

    const ctx = {
      db,
      logger: appLogger,
      resolver,
      serviceDid,
      didResolver: baseIdResolver.did,
    }

    const app = new Hono()

    // Middleware
    app.use('*', logger())

    // Set context variables for auth middleware
    app.use('*', async (c, next) => {
      // Type-safe way to set context variables
      c.set('serviceDid', serviceDid)
      c.set('didResolver', baseIdResolver.did)
      await next()
    })

    // Apply optional auth to getPosts - enables auth but doesn't require it
    app.use('/xrpc/so.sprk.feed.getPosts', optionalAuthMiddleware)

    // Auth routes
    const feedRouter = createFeedRouter(ctx)
    app.route('/', feedRouter)

    const getPostsRouter = createGetPostsRouter(ctx)
    const getPostThreadRouter = createGetPostThreadRouter(ctx)
    app.route('/', getPostsRouter)
    app.route('/', getPostThreadRouter)

    app.route('/', wellKnownRouter())

    // Root route
    app.get('/', (c) => {
      return c.text('✧･ﾟ: ✧･ﾟ:. ݁₊ ⊹ . ݁˖ . ݁ 𝚂𝙿𝙰𝚁𝙺 𝙰𝙿𝙸 . ݁₊ ⊹ . ݁˖ . ݁ :･ﾟ✧:･ﾟ✧')
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
    if (this.ctx.db instanceof Database) {
      await this.ctx.db.disconnect()
    }
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
