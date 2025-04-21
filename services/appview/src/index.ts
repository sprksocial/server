import { DidResolver } from '@atproto/identity'
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { logger } from 'hono/logger'
import { pino } from 'pino'
import { Database } from './db.js'
import { env } from './env.js'
import { createFeedRouter } from './feed/feed.js'
import {
  BidirectionalResolver,
  createBidirectionalResolver,
  createIdResolver,
} from './id-resolver.js'
import { createGetProfileRouter } from './routes/actor/getProfile.js'
import { createGetAuthorFeedRouter } from './routes/feed/getAuthorFeed.js'
import { createGetPostsRouter } from './routes/feed/getPosts.js'
import { createGetPostThreadRouter } from './routes/feed/getPostThread.js'
import { createGetFollowersRouter } from './routes/graph/getFollowers.js'
import { createGetFollowsRouter } from './routes/graph/getFollows.js'
import wellKnownRouter from './well-known.js'
import { TakedownService } from './services/takedown.js'
import takedownRoutes from './routes/admin/takedowns.js'
import { takedownFilterMiddleware } from './middleware/takedown-filter.js'

export type AppContext = {
  db: Database
  logger: pino.Logger
  resolver: BidirectionalResolver
  serviceDid: string
  didResolver: DidResolver
  takedownService: TakedownService
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
    
    // Create takedown service
    const takedownService = new TakedownService(db)

    const ctx = {
      db,
      logger: appLogger,
      resolver,
      serviceDid,
      didResolver: baseIdResolver.did,
      takedownService,
    }

    const app = new Hono()

    // Middleware
    app.use('*', logger())

    // Set context variables for auth middleware
    app.use('*', async (c, next) => {
      // Type-safe way to set context variables
      c.set('serviceDid', serviceDid)
      c.set('didResolver', baseIdResolver.did)
      c.set('takedownService', takedownService)
      await next()
    })

    // TODO: Remove this after getAuthorFeedRouter is properly implemented on frontend
    const feedRouter = createFeedRouter(ctx)
    app.route('/', feedRouter)

    const getPostsRouter = createGetPostsRouter(ctx)
    const getPostThreadRouter = createGetPostThreadRouter(ctx)
    const getProfileRouter = createGetProfileRouter(ctx)
    const getFollowersRouter = createGetFollowersRouter(ctx)
    const getFollowsRouter = createGetFollowsRouter(ctx)
    const getAuthorFeedRouter = createGetAuthorFeedRouter(ctx)
    
    // Apply takedown filter middleware to content routes
    app.use('/', takedownFilterMiddleware)
    
    app.route('/', getPostsRouter)
    app.route('/', getPostThreadRouter)
    app.route('/', getProfileRouter)
    app.route('/', getFollowersRouter)
    app.route('/', getFollowsRouter)
    app.route('/', getAuthorFeedRouter)

    // Admin routes
    app.route('/admin/takedowns', takedownRoutes)

    // XRPC routes - make sure the Ozone endpoint is accessible
    app.route('/xrpc', takedownRoutes)

    app.route('/', wellKnownRouter())

    // Root route
    app.get('/', (c) => {
      return c.text(
        '✧･ﾟ: ✧･ﾟ:. ݁₊ ⊹ . ݁˖ . ݁ SPARK API . ݁₊ ⊹ . ݁˖ . ݁ :･ﾟ✧:･ﾟ✧',
      )
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
