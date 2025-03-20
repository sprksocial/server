import { Hono } from 'hono'
import algos from '../algos'
import { Database } from '../db/connection'

const xrpcRouter = (db: Database) => {
  const router = new Hono()

  router.get('/so.sprk.feed.getFeedSkeleton', (c) => {
    return c.json({
      feed: [],
    })
  })

  router.get('/so.sprk.feed.getFeed', (c) => {
    return c.json({
      feed: [],
    })
  })

  return router
}

export default xrpcRouter
