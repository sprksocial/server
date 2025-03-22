import { Hono } from 'hono'
import { Database } from '../db/connection'
import { validateAuth } from '../auth'
import { MemoryCache, DidResolver } from '@atproto/identity'
import { env } from '../utils/env'
import algos from '../algos'

const didCache = new MemoryCache()
const didResolver = new DidResolver({
  plcUrl: 'https://plc.directory',
  didCache,
})

const xrpcRouter = (db: Database) => {
  const router = new Hono()

  router.get('/so.sprk.feed.getFeedSkeleton', async (c) => {
      try {
      const feed = c.req.query('feed') ?? ''
      const limit = parseInt(c.req.query('limit') ?? '1')
      const cursor = c.req.query('cursor') ?? ''
      let requesterDid = ''

      const algoInfo = algos[feed]
      if (algoInfo.needsAuth){
          requesterDid = await validateAuth(c.req, `did:web:${env.FEEDGEN_DOMAIN}`, didResolver)
      }


      const body = await algoInfo.handler(db, {
        feed: feed,
        limit,
        cursor,
        requesterDid
      })
      return c.json(body)
    } catch (e){
      const errorMsg = e instanceof Error ? e.message : 'Unknown';
      return c.text(`Error found; Reason: ${errorMsg}`, 400);
    }
  })

  router.get('/so.sprk.feed.getFeed', (c) => {
    return c.json({
      feed: [],
    })
  })

  return router
}

export default xrpcRouter
