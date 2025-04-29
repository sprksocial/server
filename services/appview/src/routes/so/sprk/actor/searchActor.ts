import { Hono } from 'hono'
import { optionalAuthMiddleware } from '../../../../auth/middleware.js'
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

  router.get(
    '/xrpc/so.sprk.actor.searchActors',
    optionalAuthMiddleware,
    async (c) => {
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

      // For handle search, exclude DIDs already found
      const foundDids = profiles.map((p) => p.authorDid)
      const handleFilter = { ...filter, did: { $nin: foundDids } }
      const handles = await ctx.db.models.Actor.find(handleFilter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean()

      const handleProfiles = await ctx.db.models.Profile.find({
        authorDid: { $in: handles.map((h) => h.did) },
      }).lean()

      const fullProfiles = [...profiles, ...handleProfiles]

      const viewerDid = c.get('did') as string | undefined

      const actors: SoSprkActorDefs.ProfileView[] = (
        await Promise.all(
          fullProfiles.map(async (p) => {
            const avatar = p.avatar
              ? `https://media.sprk.so/avatar/tiny/${p.authorDid}/${(p.avatar as any).ref.$link}/webp`
              : undefined
            const labels = Array.isArray(p.labels)
              ? (p.labels as Label[])
              : undefined
            const now = new Date().toISOString()
            await ctx.indexingService.indexHandle(p.authorDid, now)
            const actor = await ctx.db.models.Actor.findOne({
              did: p.authorDid,
            })
            if (!actor || !actor.handle) {
              return undefined
            }

            let viewer: SoSprkActorDefs.ViewerState | undefined = undefined
            if (viewerDid) {
              const [follow, followedBy, block, blockedBy] = await Promise.all([
                ctx.db.models.Follow.findOne({
                  subject: p.authorDid,
                  authorDid: viewerDid,
                }),
                ctx.db.models.Follow.findOne({
                  subject: viewerDid,
                  authorDid: p.authorDid,
                }),
                ctx.db.models.Block.findOne({
                  subject: p.authorDid,
                  authorDid: viewerDid,
                }),
                ctx.db.models.Block.findOne({
                  subject: viewerDid,
                  authorDid: p.authorDid,
                }),
              ])
              console.log(follow, followedBy, block, blockedBy)
              viewer = {}
              if (follow) viewer.following = follow.uri
              if (followedBy) viewer.followedBy = followedBy.uri
              if (block) viewer.blocking = block.uri
              if (blockedBy) viewer.blockedBy = true
              if (Object.keys(viewer).length === 0) viewer = undefined
            }

            return {
              $type: 'so.sprk.actor.defs#profileView',
              did: p.authorDid,
              handle: actor.handle,
              displayName: p.displayName,
              description: p.description,
              avatar,
              indexedAt: p.indexedAt,
              createdAt: p.createdAt,
              labels,
              viewer,
            } as SoSprkActorDefs.ProfileView
          }),
        )
      ).filter(
        (actor): actor is SoSprkActorDefs.ProfileView => actor !== undefined,
      )

      const nextCursor =
        profiles.length === limit ? String(skip + limit) : undefined
      const result: SoSprkActorSearch.OutputSchema = { actors }
      if (nextCursor) {
        result.cursor = nextCursor
      }

      return c.json(result)
    },
  )

  return router
}
