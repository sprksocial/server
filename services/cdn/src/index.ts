import { Hono } from 'hono'
import { pino } from 'pino'
import { createBidirectionalResolver, createIdResolver } from './id-resolver'
import { videoHandler } from './videoHandler'

const logger = pino({
  name: 'cdn',
  transport: {
    target: 'pino-pretty',
  },
})

const port = process.env.PORT ? parseInt(process.env.PORT) : 3000
let app: Hono

export default {
  port,
  fetch: (request: Request) => app.fetch(request),
}

async function main() {
  logger.info('Starting Spark CDN service')

  try {
    // Create ID resolver
    const resolver = createIdResolver()
    const bidirectionalResolver = createBidirectionalResolver(resolver)
    app = new Hono()

    app.get('/', (c) => {
      return c.text(
        '✧･ﾟ: ✧･ﾟ:. ݁₊ ⊹ . ݁˖ . ݁ SPARK CDN . ݁₊ ⊹ . ݁˖ . ݁ :･ﾟ✧:･ﾟ✧',
      )
    })

    // Apply video route
    app.get('/video/:did/:cid', (c) => videoHandler(c, bidirectionalResolver))

    logger.info({ port }, 'CDN service is running')
  } catch (err) {
    logger.error({ err }, 'Failed to start CDN service')
    process.exit(1)
  }
}

// Handle shutdown gracefully
const shutdown = () => {
  logger.info('Shutting down CDN service...')
  process.exit(0)
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)

main().catch((err) => {
  logger.error({ err }, 'Fatal error in main process')
  process.exit(1)
})
