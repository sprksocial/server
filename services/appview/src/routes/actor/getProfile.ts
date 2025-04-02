import { ensureValidDid, isValidHandle } from '@atproto/syntax'
import { Hono } from 'hono'

import { optionalAuthMiddleware } from '../../auth/middleware.js'
import { AppContext } from '../../index.js'
import type { Label } from '../../lexicon/types/com/atproto/label/defs.js'
import type * as ComAtprotoRepoStrongRef from '../../lexicon/types/com/atproto/repo/strongRef.js'
import type * as SoSprkActorDefs from '../../lexicon/types/so/sprk/actor/defs.js'
import type * as SoSprkGraphDefs from '../../lexicon/types/so/sprk/graph/defs.js'

export const createGetProfileRouter = (ctx: AppContext) => {
  const router = new Hono()

  router.get(
    '/xrpc/so.sprk.actor.getProfile',
    optionalAuthMiddleware,
    async (c) => {
      const actor = c.req.query('actor')
      const viewerDid = c.get('did') as string | undefined

      if (!actor) {
        return c.json({ error: 'Actor not provided' }, 400)
      }

      let actorDidDoc
      if (isValidHandle(actor)) {
        actorDidDoc = await ctx.resolver.resolveHandleToDidDoc(actor)
      } else {
        try {
          ensureValidDid(actor)
          actorDidDoc = await ctx.resolver.resolveDidToDidDoc(actor)
        } catch (err) {
          return c.json({ error: 'Invalid actor' }, 400)
        }
      }

      const actorDid = actorDidDoc.did

      // Get profile data
      const profile = await ctx.db.models.Profile.findOne({
        authorDid: actorDid,
      }).lean()

      if (!profile) {
        return c.json({ error: 'Profile not found' }, 404)
      }

      const profileHandle = await ctx.resolver.resolveDidToHandle(
        profile.authorDid,
      )

      // Get follower count
      const followersCount = await ctx.db.models.Follow.countDocuments({
        subject: actorDid,
      })

      // Get follows count
      const followsCount = await ctx.db.models.Follow.countDocuments({
        authorDid: actorDid,
      })

      // Get posts count
      const postsCount = await ctx.db.models.Post.countDocuments({
        authorDid: actorDid,
      })

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

        // Get known followers (followers of the profile that the viewer also follows)
        if (followersCount > 0) {
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

            // Get profiles for known followers
            const knownFollowerProfiles = await ctx.db.models.Profile.find({
              authorDid: { $in: knownFollowerDids },
            })
              .limit(3)
              .lean()

            const knownFollowersBasic = await Promise.all(
              knownFollowerProfiles.map(async (p) => {
                const handle = await ctx.resolver.resolveDidToHandle(
                  p.authorDid,
                )
                return {
                  did: p.authorDid,
                  handle,
                  displayName: p.displayName,
                  avatar: p.avatar
                    ? `https://cdn.sprk.so/avatar/${p.authorDid}`
                    : undefined,
                } as SoSprkActorDefs.ProfileViewBasic
              }),
            )

            viewer.knownFollowers = {
              count: knownFollowsQuery.length,
              followers: knownFollowersBasic,
            }
          }
        }
      }

      // Check for associated services
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

      // Get avatar and banner URLs
      const avatar = profile.avatar
        ? `https://cdn.sprk.so/avatar/${actorDid}/${profile.avatar.ref.$link}`
        : undefined
      const banner = profile.banner
        ? `https://cdn.sprk.so/banner/${actorDid}/${profile.banner.ref.$link}`
        : undefined

      // Convert joinedViaStarterPack to the correct type if it exists
      let joinedViaStarterPack:
        | SoSprkGraphDefs.StarterPackViewBasic
        | undefined = undefined
      if (profile.joinedViaStarterPack) {
        // Type assertion assuming the structure fits the requirements
        joinedViaStarterPack =
          profile.joinedViaStarterPack as unknown as SoSprkGraphDefs.StarterPackViewBasic
      }

      // Convert labels to the correct type if it exists
      let labels: Label[] | undefined = undefined
      if (profile.labels) {
        labels = Array.isArray(profile.labels)
          ? (profile.labels as Label[])
          : undefined
      }

      // Convert pinnedPost to the correct type if it exists
      let pinnedPost: ComAtprotoRepoStrongRef.Main | undefined = undefined
      if (profile.pinnedPost) {
        pinnedPost =
          profile.pinnedPost as unknown as ComAtprotoRepoStrongRef.Main
      }

      // Build the ProfileViewDetailed response
      const profileView: SoSprkActorDefs.ProfileViewDetailed = {
        did: actorDid,
        handle: profileHandle,
        displayName: profile.displayName,
        description: profile.description,
        avatar,
        banner,
        followersCount,
        followsCount,
        postsCount,
        associated: Object.keys(associated).length > 0 ? associated : undefined,
        joinedViaStarterPack,
        indexedAt: profile.indexedAt,
        createdAt: profile.createdAt,
        viewer: Object.keys(viewer).length > 0 ? viewer : undefined,
        labels,
        pinnedPost,
      }

      return c.json(profileView)
    },
  )

  return router
}
