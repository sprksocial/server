import { Hono } from 'hono'
import { AppContext } from '../../../../index.js'
import type { Label } from '../../../../lexicon/types/com/atproto/label/defs.js'
import type * as SoSprkActorDefs from '../../../../lexicon/types/so/sprk/actor/defs.js'
import type * as SoSprkActorSearch from '../../../../lexicon/types/so/sprk/actor/searchActors.js'

// Helper to escape user input for safe RegExp usage
function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export const createSearchActorRouter = (ctx: AppContext) => {
  const router = new Hono()

  router.get('/xrpc/so.sprk.actor.searchActors', async (c) => {
    const q = c.req.query('q')?.trim()
    let limit = parseInt(c.req.query('limit') ?? '25')
    if (isNaN(limit)) limit = 25
    if (limit < 1 || limit > 100) {
      return c.json({ error: 'Limit must be between 1 and 100' }, 400)
    }

    let skip = 0
    const cursorParam = c.req.query('cursor')
    if (cursorParam) {
      skip = parseInt(cursorParam)
      if (isNaN(skip) || skip < 0) {
        return c.json({ error: 'Invalid cursor' }, 400)
      }
    }

    const filter: any = {}
    const sort: any = {}

    if (q) {
      const escaped = escapeRegExp(q)
      const regex = new RegExp(escaped, 'i')
      filter.$or = [
        { displayName: regex },
        { description: regex },
        { handle: regex },
      ]
      // fall back to sorting by createdAt
      sort.createdAt = -1
    } else {
      sort.createdAt = -1
    }

    const profiles = await ctx.db.models.Profile.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean()

    const actors: SoSprkActorDefs.ProfileView[] = await Promise.all(
      profiles.map(async (p) => {
        const avatar = p.avatar
          ? `https://media.sprk.so/avatar/tiny/${p.authorDid}/${(p.avatar as any).ref.$link}/webp`
          : undefined
        const labels = Array.isArray(p.labels)
          ? (p.labels as Label[])
          : undefined
        const handle = await ctx.resolver.resolveDidToHandle(p.authorDid)
        return {
          $type: 'so.sprk.actor.defs#profileView',
          did: p.authorDid,
          handle: handle,
          displayName: p.displayName,
          description: p.description,
          avatar,
          indexedAt: p.indexedAt,
          createdAt: p.createdAt,
          labels,
        } satisfies SoSprkActorDefs.ProfileView
      }),
    )

    const nextCursor =
      profiles.length === limit ? String(skip + limit) : undefined
    const result: SoSprkActorSearch.OutputSchema = { actors }
    if (nextCursor) {
      result.cursor = nextCursor
    }

    return c.json(result)
  })

  return router
}