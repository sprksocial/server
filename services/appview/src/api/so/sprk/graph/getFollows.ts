import { Hono } from 'hono'

import { optionalAuthMiddleware } from '../../../../auth/middleware.js'
import { AppContext } from '../../../../index.js'
import type * as SoSprkActorDefs from '../../../../lexicon/types/so/sprk/actor/defs.js'

export const createGetFollowsRouter = (ctx: AppContext) => {
  const router = new Hono()

  router.get('/xrpc/so.sprk.graph.getFollows', optionalAuthMiddleware, async (c) => {
    const actor = c.req.query('actor')
    const limit = parseInt(c.req.query('limit') ?? '50')
    const cursor = c.req.query('cursor')

    if (!actor) {
      return c.json({ error: 'Actor is required' }, 400)
    }

    // Validate limit
    if (limit < 1 || limit > 100) {
      return c.json({ error: 'Limit must be between 1 and 100' }, 400)
    }

    // Build query
    const query: any = { authorDid: actor }
    if (cursor) {
      query._id = { $gt: cursor }
    }

    // Get follows with pagination
    const follows = await ctx.db.models.Follow.find(query)
      .sort({ _id: 1 })
      .limit(limit)
      .lean()

    // Get profile views for each follow
    const profileViews = await Promise.all(
      follows.map(async (follow) => {
        const profile = await ctx.db.models.Profile.findOne({ authorDid: follow.subject })
        // Basic profile view with just DID
        const basicProfileView: SoSprkActorDefs.ProfileView = {
          $type: 'so.sprk.actor.defs#profileView',
          did: follow.authorDid,
          handle: follow.authorHandle,
          viewer: {
            $type: 'so.sprk.actor.defs#viewerState',
            followedBy: follow.uri
          }
        }

        // If we found a profile, add the additional fields
        if (profile) {
          return {
            ...basicProfileView,
            handle: profile.authorHandle,
            displayName: profile.displayName,
            description: profile.description,
            avatar: profile.avatar?.ref?.link,
            indexedAt: profile.indexedAt,
            createdAt: profile.createdAt
          }
        }

        return basicProfileView
      })
    )

    // Get next cursor
    const nextCursor = follows.length === limit ? follows[follows.length - 1]._id : undefined

    // Get subject profile if it exists
    const subjectProfile = await ctx.db.models.Profile.findOne({ authorDid: actor })
    const subjectProfileView: SoSprkActorDefs.ProfileView = {
      $type: 'so.sprk.actor.defs#profileView',
      did: actor,
      handle: 'unknown'
    }
    // If we found the subject profile, add the additional fields
    if (subjectProfile) {
      Object.assign(subjectProfileView, {
        handle: subjectProfile.authorHandle,
        displayName: subjectProfile.displayName,
        description: subjectProfile.description,
        avatar: subjectProfile.avatar?.ref?.link,
        indexedAt: subjectProfile.indexedAt,
        createdAt: subjectProfile.createdAt
      })
    } else {
        let handle = null
        try {
          if (actor) {
            const didData = await ctx.resolver.resolveDidToDidDoc(actor)
            handle = didData.handle
          }
        } catch (error) {
          ctx.logger.warn(
            { did: actor, error: (error as Error).message },
            'Failed to resolve DID to handle',
          )
        }
        Object.assign(subjectProfileView, {
          handle: handle ?? 'unknown'
        })
    }

    return c.json({
      subject: subjectProfileView,
      follows: profileViews,
      cursor: nextCursor
    })
  })

  return router
}
