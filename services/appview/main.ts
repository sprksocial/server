import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { HTTPException } from 'hono/http-exception'
import { logger } from 'hono/logger'
import { pino } from 'pino'
import { Database } from './services/data-plane/server/index.ts'
import { env } from './utils/env.ts'
import { createAuthVerifier } from './services/auth/auth-verifier.ts'
import API from './api/index.ts'
import { createServer } from './lexicon/index.ts'
import {
  createBidirectionalResolver,
  createIdResolver,
} from './utils/id-resolver.ts'
import { takedownFilterMiddleware } from './services/takedown-filter.ts'
import { createGetProfileRouter } from './api/so/sprk/actor/getProfile.ts'
import { createSearchActorRouter } from './api/so/sprk/actor/searchActors.ts'
import { createGetAuthorFeedRouter } from './api/so/sprk/feed/getAuthorFeed.ts'
import { createGetPostsRouter } from './api/so/sprk/feed/getPosts.ts'
import { createGetPostThreadRouter } from './api/so/sprk/feed/getPostThread.ts'
import { createGetFollowersRouter } from './api/so/sprk/graph/getFollowers.ts'
import { createGetFollowsRouter } from './api/so/sprk/graph/getFollows.ts'
import { createGetRecordRouter } from './api/com/atproto/repo/getRecord.ts'
import { createResolveHandleRouter } from './api/com/atproto/identity/resolveHandle.ts'
import wellKnownRouter from './utils/well-known.ts'
import { TakedownService } from './services/takedown.ts'
import { IndexingService } from './services/indexing.ts'
import { expressToHono } from './utils/express-adapter.ts'
import { createPutPreferencesRouter } from './api/so/sprk/actor/putPreferences.ts'
import { createGetPreferencesRouter } from './api/so/sprk/actor/getPreferences.ts'
import { BidirectionalResolver } from "./utils/id-resolver.ts"
import { DidResolver } from "@atproto/identity"
import { AuthVerifier } from "./services/auth/auth-verifier.ts"


// Setup logger and database
const appLogger = pino({ name: 'server start' })
const db = new Database()
await db.connect()

// DID and resolver setup
const baseIdResolver = createIdResolver()
const resolver = createBidirectionalResolver(baseIdResolver)
const serviceDid = env.SERVICE_DID

// Services
const takedownService = new TakedownService(db)
const indexingService = new IndexingService(db, resolver)
const authVerifier = createAuthVerifier(db, {
  ownDid: serviceDid,
  alternateAudienceDids: [],
  modServiceDid: env.MOD_SERVICE_DID,
  adminPasses: [env.ADMIN_PASSWORD],
})

export type AppContext = {
  db: Database
  logger: pino.Logger
  resolver: BidirectionalResolver
  serviceDid: string
  didResolver: DidResolver
  takedownService: TakedownService
  indexingService: IndexingService
  authVerifier: AuthVerifier
}

export type AppEnv = {
  Bindings: AppContext,
  Variables: {
    did: string
    isAdmin: boolean
  }
}

const ctx = {
  db,
  logger: appLogger,
  resolver,
  serviceDid,
  didResolver: baseIdResolver.did,
  takedownService,
  indexingService,
  authVerifier,
}

// Initialize Hono app
const app = new Hono<AppEnv>()

app.use('*', cors())
app.use('*', logger())
app.use('*', async (c, next) => {
  c.env.serviceDid = serviceDid
  c.env.didResolver = baseIdResolver.did
  c.env.takedownService = takedownService
  c.env.indexingService = indexingService
  c.env.authVerifier = authVerifier
  await next()
})
app.use('*', takedownFilterMiddleware)

// Lexicon/XRPC server and routers
const lexServer = createServer()
API(lexServer, ctx)

app.route('/', createGetPostsRouter(ctx))
app.route('/', createGetPostThreadRouter(ctx))
app.route('/', createGetProfileRouter(ctx))
app.route('/', createGetFollowersRouter(ctx))
app.route('/', createGetFollowsRouter(ctx))
app.route('/', createGetAuthorFeedRouter(ctx))
app.route('/', createSearchActorRouter(ctx))
app.route('/', createGetRecordRouter(ctx))
app.route('/', createResolveHandleRouter(ctx))
app.route('/', createPutPreferencesRouter(ctx))
app.route('/', createGetPreferencesRouter(ctx))
app.route('/', wellKnownRouter())

// Root route
app.get('/', (c) => {
  return c.text(
    '✧･ﾟ: ✧･ﾟ:. ݁₊ ⊹ . ݁˖ . ݁ SPARK API . ݁₊ ⊹ . ݁˖ . ݁ :･ﾟ✧:･ﾟ✧',
  )
})

// Mount XRPC router
app.use(expressToHono(lexServer.xrpc.router))

// Error handling
app.onError((err, c) => {
  if (err instanceof HTTPException) return err.getResponse()
  appLogger.error({ err }, 'Server error')
  return c.json({ error: 'Internal Server Error', message: 'An unexpected error occurred' }, 500)
})

// Start server
const { HOST, PORT } = env
Deno.serve({ hostname: HOST, port: PORT, onListen: (info) => {
  appLogger.info(`Server listening on ${info.hostname}:${info.port}`)
} }, app.fetch)

// Handle shutdown
Deno.addSignalListener('SIGINT', async () => {
  appLogger.info('Shutting down server')
  await db.disconnect()
  Deno.exit(0)
})
Deno.addSignalListener('SIGTERM', async () => {
  appLogger.info('Shutting down server')
  await db.disconnect()
  Deno.exit(0)
})
