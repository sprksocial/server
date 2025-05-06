import { DidResolver } from '@atproto/identity'
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
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
import { takedownFilterMiddleware } from './middleware/takedown-filter.js'
import { createGetProfileRouter } from './routes/so/sprk/actor/getProfile.js'
import { createSearchActorRouter } from './routes/so/sprk/actor/searchActors.js'
import { createGetAuthorFeedRouter } from './routes/so/sprk/feed/getAuthorFeed.js'
import { createGetPostsRouter } from './routes/so/sprk/feed/getPosts.js'
import { createGetPostThreadRouter } from './routes/so/sprk/feed/getPostThread.js'
import { createGetFollowersRouter } from './routes/so/sprk/graph/getFollowers.js'
import { createGetFollowsRouter } from './routes/so/sprk/graph/getFollows.js'
import { createTakedownRouter } from './routes/admin/takedowns.js'
import { createUpdateSubjectStatusRouter } from './routes/com/atproto/admin/updateSubjectStatus.js'
import { createGetRecordRouter } from './routes/com/atproto/repo/getRecord.js'
import { createGetAccountInfosRouter } from './routes/com/atproto/admin/getAccountInfos.js'
import { createGetSubjectStatusRouter } from './routes/com/atproto/admin/getSubjectStatus.js'
import { createResolveHandleRouter } from './routes/com/atproto/identity/resolveHandle.js'
import wellKnownRouter from './well-known.js'
import { TakedownService } from './services/takedown.js'
import { IndexingService } from './services/indexing.js'

// Extend Hono's context variable map to include our services
declare module 'hono' {
  interface ContextVariableMap {
    serviceDid: string
    didResolver: DidResolver
    takedownService: TakedownService
    indexingService: IndexingService
  }
}

export type AppContext = {
  db: Database
  logger: pino.Logger
  resolver: BidirectionalResolver
  serviceDid: string
  didResolver: DidResolver
  takedownService: TakedownService
  indexingService: IndexingService
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

    // Create services
    const takedownService = new TakedownService(db)
    const indexingService = new IndexingService(db, resolver)

    const ctx = {
      db,
      logger: appLogger,
      resolver,
      serviceDid,
      didResolver: baseIdResolver.did,
      takedownService,
      indexingService,
    }

    const app = new Hono()

    app.use('*', cors())

    app.use('*', logger())

    app.use('*', async (c, next) => {
      c.set('serviceDid', serviceDid)
      c.set('didResolver', baseIdResolver.did)
      c.set('takedownService', takedownService)
      c.set('indexingService', indexingService)
      await next()
    })

    app.use('*', takedownFilterMiddleware)

    // TODO: Remove this after getAuthorFeedRouter is properly implemented on frontend
    const feedRouter = createFeedRouter(ctx)
    app.route('/', feedRouter)

    const getPostsRouter = createGetPostsRouter(ctx)
    const getPostThreadRouter = createGetPostThreadRouter(ctx)
    const getProfileRouter = createGetProfileRouter(ctx)
    const getFollowersRouter = createGetFollowersRouter(ctx)
    const getFollowsRouter = createGetFollowsRouter(ctx)
    const getAuthorFeedRouter = createGetAuthorFeedRouter(ctx)
    const searchActorRouter = createSearchActorRouter(ctx)
    const updateSubjectStatusRouter = createUpdateSubjectStatusRouter(ctx)
    const takedownRouter = createTakedownRouter(ctx)
    const getRecordRouter = createGetRecordRouter(ctx)
    const getAccountInfosRouter = createGetAccountInfosRouter(ctx)
    const getSubjectStatusRouter = createGetSubjectStatusRouter(ctx)
    const resolveHandleRouter = createResolveHandleRouter(ctx)

    app.route('/', getPostsRouter)
    app.route('/', getPostThreadRouter)
    app.route('/', getProfileRouter)
    app.route('/', getFollowersRouter)
    app.route('/', getFollowsRouter)
    app.route('/', getAuthorFeedRouter)
    app.route('/', searchActorRouter)
    app.route('/', updateSubjectStatusRouter)
    app.route('/', takedownRouter)
    app.route('/', getRecordRouter)
    app.route('/', getAccountInfosRouter)
    app.route('/', getSubjectStatusRouter)
    app.route('/', resolveHandleRouter)
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
