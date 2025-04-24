import { ensureValidDid, isValidHandle } from '@atproto/syntax'
import { Hono } from 'hono'

import { optionalAuthMiddleware } from '../../../../auth/middleware.js'
import { AppContext } from '../../../../index.js'
import type { Label } from '../../../../lexicon/types/com/atproto/label/defs.js'
import type * as ComAtprotoRepoStrongRef from '../../../../lexicon/types/com/atproto/repo/strongRef.js'
import type * as SoSprkActorDefs from '../../../../lexicon/types/so/sprk/actor/defs.js'
import type * as SoSprkGraphDefs from '../../../../lexicon/types/so/sprk/graph/defs.js'

export const createGetProfileRouter = (ctx: AppContext) => {
  const router = new Hono()

  router.get(
    '/xrpc/so.sprk.actor.getProfile',
    optionalAuthMiddleware,
    async (c) => {
      const actorIdentifier = c.req.query('actor')
      const viewerDid = c.get('did') as string | undefined
      const now = new Date().toISOString()

      if (!actorIdentifier) {
        return c.json({ error: 'Actor not provided' }, 400)
      }

      // Resolve actor DID from handle or DID
      let actorDid: string
      try {
        if (isValidHandle(actorIdentifier)) {
          const didDoc = await ctx.resolver.resolveHandleToDidDoc(actorIdentifier)
          actorDid = didDoc.did
        } else {
          ensureValidDid(actorIdentifier)
          actorDid = actorIdentifier
        }
      } catch (err) {
        return c.json({ error: 'Invalid actor' }, 400)
      }

      // Use the indexing service - it will handle recency checks internally
      try {
        await ctx.indexingService.indexHandle(actorDid, now)
      } catch (error) {
        ctx.logger.warn({ error, did: actorDid }, 'Failed to index handle')
        // Continue anyway - we might still have data
      }

      // Find the actor with populated profile
      const actor = await ctx.db.models.Actor.findOne({ did: actorDid })
        .populate('profile')
        .lean()

      if (!actor) {
        return c.json({ error: 'Actor not found' }, 404)
      }
      
      return generateProfileResponse(c, ctx, actor, viewerDid, actorDid)
    },
  )

  return router
}

// Helper function to handle the rest of the profile rendering logic
async function generateProfileResponse(
  c: any, 
  ctx: AppContext, 
  actor: any, 
  viewerDid: string | undefined, 
  actorDid: string
) {
  const profile = actor.profile as any
  
  // Build viewer state if a user is authenticated
  const viewer: SoSprkActorDefs.ViewerState = {}

  if (viewerDid) {
    // Check if viewer follows this profile
    const follow = await ctx.db.models.Follow.findOne({
      subject: actorDid,
      authorDid: viewerDid,
    })
    if (follow) {
      viewer.following = follow.uri
    }

    // Check if this profile follows the viewer
    const followedBy = await ctx.db.models.Follow.findOne({
      subject: viewerDid,
      authorDid: actorDid,
    })
    if (followedBy) {
      viewer.followedBy = followedBy.uri
    }

    // Check if viewer has blocked this profile
    const block = await ctx.db.models.Block.findOne({
      subject: actorDid,
      authorDid: viewerDid,
    })
    if (block) {
      viewer.blocking = block.uri
    }

    // Check if this profile has blocked the viewer
    const blockedBy = await ctx.db.models.Block.findOne({
      subject: viewerDid,
      authorDid: actorDid,
    })
    if (blockedBy) {
      viewer.blockedBy = true
    }

    // Get known followers only if profile exists
    if (profile && actor.followersCount > 0) {
      // Get the followers of this profile
      const followers = await ctx.db.models.Follow.find({
        subject: actorDid,
      }).lean()

      const followerDids = followers.map((f) => f.authorDid)

      // Check which of these followers the viewer follows
      const knownFollowsQuery = await ctx.db.models.Follow.find({
        subject: { $in: followerDids },
        authorDid: viewerDid,
      }).lean()

      if (knownFollowsQuery.length > 0) {
        const knownFollowerDids = knownFollowsQuery.map((f) => f.subject)

        // Get actors for known followers
        const knownFollowerActors = await ctx.db.models.Actor.find({
          did: { $in: knownFollowerDids },
        })
          .populate('profile')
          .limit(3)
          .lean()

        const knownFollowersBasic = knownFollowerActors
          .filter(a => a.profile)
          .map((a) => {
            const p = a.profile as any
            return {
              did: a.did,
              handle: a.handle || a.did,
              displayName: p?.displayName,
              avatar: p?.avatar
                ? `https://media.sprk.so/avatar/tiny/${a.did}/${p.avatar.ref.$link}/webp`
                : undefined,
            } as SoSprkActorDefs.ProfileViewBasic
          })

        viewer.knownFollowers = {
          count: knownFollowsQuery.length,
          followers: knownFollowersBasic,
        }
      }
    }
  }

  // Build the ProfileViewDetailed response with required fields
  const profileView: SoSprkActorDefs.ProfileViewDetailed = {
    did: actorDid,
    handle: actor.handle || actorDid,
    viewer: viewerDid ? viewer : undefined,
  }

  // Only add optional fields if profile exists
  if (profile) {
    const associated: SoSprkActorDefs.ProfileAssociated = {}

    // Check for feed generators
    let feedgensCount = 0
    try {
      if (ctx.db.models.Generator) {
        feedgensCount = await ctx.db.models.Generator.countDocuments({
          authorDid: actorDid,
        })
      }
    } catch (error) {
      // Ignore if model doesn't exist
    }

    if (feedgensCount > 0) {
      associated.feedgens = feedgensCount
    }

    Object.assign(profileView, {
      displayName: profile.displayName,
      description: profile.description,
      avatar: profile.avatar
        ? `https://media.sprk.so/avatar/tiny/${actorDid}/${profile.avatar.ref.$link}/webp`
        : undefined,
      banner: profile.banner
        ? `https://media.sprk.so/img/tiny/${actorDid}/${profile.banner.ref.$link}/webp`
        : undefined,
      followersCount: actor.followersCount,
      followsCount: actor.followingCount,
      postsCount: actor.postsCount,
      associated: Object.keys(associated).length > 0 ? associated : undefined,
      joinedViaStarterPack: profile.joinedViaStarterPack as unknown as SoSprkGraphDefs.StarterPackViewBasic,
      indexedAt: profile.indexedAt,
      createdAt: profile.createdAt,
      labels: Array.isArray(profile.labels) ? profile.labels as Label[] : undefined,
      pinnedPost: profile.pinnedPost as unknown as ComAtprotoRepoStrongRef.Main,
    })
  }

  return c.json(profileView)
}