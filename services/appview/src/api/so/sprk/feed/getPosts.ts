import { Hono } from 'hono'

import { OutputSchema as GetPostsView } from '../../../../lexicon/types/so/sprk/feed/getPosts.js'
import { AppContext } from '../../../../index.js'
import { transformPostToPostView } from '../../../../utils/post-transformer.js'
import { Database } from '../../../../data-plane/server/index.js'
import type * as SoSprkFeedDefs from '../../../../lexicon/types/so/sprk/feed/defs.js'
import { optionalAuthMiddleware } from '../../../../auth/middleware.js'

// Function to fetch posts by URIs
async function getPosts(
  uris: string | string[],
  db: Database,
  userDid?: string,
): Promise<SoSprkFeedDefs.PostView[]> {
  if (!uris) {
    return []
  }

  const uriArray = Array.isArray(uris) ? uris : [uris]

  if (uriArray.length === 0) {
    return []
  }

  const dbPosts = await db.models.Post.find({ uri: { $in: uriArray } }).lean()

  // Transform each post to PostView format
  const postViews = await Promise.all(
    dbPosts.map((post) => transformPostToPostView(post, db, userDid)),
  )

  return postViews
}

export const createGetPostsRouter = (ctx: AppContext) => {
  const router = new Hono()

  router.get('/xrpc/so.sprk.feed.getPosts',
    optionalAuthMiddleware,
    async (c) => {
    const uris = c.req.queries('uris')
    const userDid = c.get('did') as string | undefined

    if (!uris || uris.length === 0) {
      return c.json({ posts: [] } as GetPostsView)
    }

    const posts = await getPosts(uris, ctx.db, userDid)

    return c.json({ posts } as GetPostsView)
  })
  return router
}
