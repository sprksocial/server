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

    // Build the filter for actors instead of directly searching profiles
    const actorFilter: any = {}
    const sort: any = {}

    // Only search for actors that already have profiles
    actorFilter.profile = { $exists: true, $ne: null }

    if (q) {
      const escaped = escapeRegExp(q)
      const regex = new RegExp(escaped, 'i')
      
      // Search by handle directly on actor model
      actorFilter.$or = [
        { handle: regex }
      ]
      
      // For queries matching profile fields, we need to find actors by their profiles
      const profileIds = await ctx.db.models.Profile.find({
        $or: [
          { displayName: regex },
          { description: regex }
        ]
      })
      .select('_id authorDid')
      .lean()
      
      // Add actor DIDs from matching profiles
      if (profileIds.length > 0) {
        const profileDids = profileIds.map(p => p.authorDid)
        // Add to $or condition
        actorFilter.$or.push({ did: { $in: profileDids } })
      }
      
      // Sort by recency and relevance
      sort.indexedAt = -1
    } else {
      // Default sort for discovery - prioritize recently indexed actors
      sort.indexedAt = -1
    }

    // Find actors with populated profiles - no need to index them
    const actorsWithProfiles = await ctx.db.models.Actor.find(actorFilter)
      .populate('profile')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean()

    // Filter out any invalid profiles and transform to profile views
    const actors: SoSprkActorDefs.ProfileView[] = actorsWithProfiles
      .filter(actor => actor.profile)
      .map(actor => {
        const profile = actor.profile as any
        
        const avatar = profile?.avatar
          ? `https://media.sprk.so/avatar/tiny/${actor.did}/${profile.avatar.ref.$link}/webp`
          : undefined
        
        const labels = profile?.labels && Array.isArray(profile.labels)
          ? (profile.labels as Label[])
          : undefined
        
        return {
          $type: 'so.sprk.actor.defs#profileView',
          did: actor.did,
          handle: actor.handle || actor.did,
          displayName: profile?.displayName,
          description: profile?.description,
          avatar,
          indexedAt: actor.indexedAt,
          createdAt: actor.createdAt ? new Date(actor.createdAt).toISOString() : undefined,
          labels,
        } satisfies SoSprkActorDefs.ProfileView
      })

    // Calculate cursor for pagination
    const nextCursor =
      actorsWithProfiles.length === limit ? String(skip + limit) : undefined
    const result: SoSprkActorSearch.OutputSchema = { actors }
    if (nextCursor) {
      result.cursor = nextCursor
    }

    return c.json(result)
  })

  return router
}
