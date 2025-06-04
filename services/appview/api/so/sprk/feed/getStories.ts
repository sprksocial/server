import { Hono } from 'hono'

import type * as SoSprkFeedDefs from '../../../../lexicon/types/so/sprk/feed/defs.ts'
import { OutputSchema as GetStoriesView } from '../../../../lexicon/types/so/sprk/feed/getStories.ts'
import { AppContext } from '../../../../main.ts'
import { optionalAuthMiddleware } from '../../../../services/auth/middleware.ts'
import { Database } from '../../../../services/data-plane/server/index.ts'
import { transformStoryToStoryView } from '../../../../utils/story-transformer.ts'

// Function to fetch stories by URIs
async function getStories(
  uris: string | string[],
  db: Database,
): Promise<SoSprkFeedDefs.StoryView[]> {
  if (!uris) {
    return []
  }

  const uriArray = Array.isArray(uris) ? uris : [uris]

  if (uriArray.length === 0) {
    return []
  }

  const dbStories = await db.models.Story.find({
    uri: { $in: uriArray },
  }).lean()

  // Transform each story to StoryView format
  const storyViews = await Promise.all(
    dbStories.map((story) => transformStoryToStoryView(story, db)),
  )

  return storyViews
}

export const createGetStoriesRouter = (ctx: AppContext) => {
  const router = new Hono()

  router.get(
    '/xrpc/so.sprk.feed.getStories',
    optionalAuthMiddleware,
    async (c) => {
      const uris = c.req.queries('uris')

      if (!uris || uris.length === 0) {
        return c.json({ stories: [] } as GetStoriesView)
      }

      const stories = await getStories(uris, ctx.db)

      return c.json({ stories } as GetStoriesView)
    },
  )
  return router
}
