import { Hono } from 'hono'

import { optionalAuthMiddleware } from '../../../../auth/middleware.js'
import { AppContext } from '../../../../index.js'
import type * as BskyActorDefs from '../../../../lexicon/types/app/bsky/actor/defs.js'
import { isValidHandle } from '@atproto/syntax'

export const createBskyGetFollowsRouter = (ctx: AppContext) => {
  const router = new Hono()

  router.get(
    '/xrpc/app.bsky.graph.getFollows',
    optionalAuthMiddleware,
    async (c) => {
      const actor = c.req.query('actor')
      const limit = parseInt(c.req.query('limit') ?? '50')
      const cursor = c.req.query('cursor')

      if (!actor) {
        return c.json({ error: 'Actor is required' }, 400)
      }

      if (limit < 1 || limit > 100) {
        return c.json({ error: 'Limit must be between 1 and 100' }, 400)
      }

      const actorDid = await resolveActorToDid(ctx, actor, c)
      if (actorDid instanceof Response) {
        return actorDid
      }

      const followsData = await getFollowsWithPagination(
        ctx,
        actorDid,
        cursor,
        limit,
      )
      const profileViews = await createProfileViews(ctx, followsData.follows)
      const subjectProfile = await createSubjectProfileView(ctx, actorDid)

      return c.json({
        subject: subjectProfile,
        follows: profileViews,
        cursor: followsData.nextCursor,
      })
    },
  )

  return router
}

// Returns either a string DID or a Response error object
async function resolveActorToDid(ctx: AppContext, actor: string, c: any) {
  if (actor.startsWith('did:')) {
    return actor
  }

  if (!isValidHandle(actor)) {
    return c.json({ error: 'Invalid actor identifier format' }, 400)
  }

  try {
    const didDoc = await ctx.resolver.resolveHandleToDidDoc(actor)
    if (!didDoc || !didDoc.did) {
      return c.json({ error: 'Handle not found or DID missing in doc' }, 404)
    }
    return didDoc.did
  } catch (err) {
    ctx.logger.error({ err, actor }, 'Failed to resolve handle to DID')
    return c.json({ error: 'Failed to resolve handle' }, 500)
  }
}

async function getFollowsWithPagination(
  ctx: AppContext,
  actorDid: string,
  cursor?: string,
  limit = 50,
) {
  const query: any = { authorDid: actorDid }
  if (cursor) {
    query._id = { $gt: cursor }
  }

  const follows = await ctx.db.models.BskyFollow.find(query)
    .sort({ _id: 1 })
    .limit(limit)
    .lean()

  const nextCursor =
    follows.length === limit
      ? String(follows[follows.length - 1]._id)
      : undefined

  return { follows, nextCursor }
}

async function createProfileViews(ctx: AppContext, follows: any[]) {
  return Promise.all(
    follows.map((follow) => createProfileViewFromFollow(ctx, follow)),
  )
}

async function createProfileViewFromFollow(ctx: AppContext, follow: any) {
  const profileDoc = await ctx.db.models.Profile.findOne({
    authorDid: follow.subject,
  })

  const profileView: BskyActorDefs.ProfileView = {
    $type: 'app.bsky.actor.defs#profileView',
    did: follow.subject,
    handle: 'unknown',
  }

  if (profileDoc) {
    profileView.handle = profileDoc.authorHandle
    profileView.displayName = profileDoc.displayName
    profileView.description = profileDoc.description
    profileView.avatar = profileDoc.avatar?.ref?.$link
      ? `https://media.sprk.so/avatar/tiny/${follow.subject}/${profileDoc.avatar.ref.$link}/webp`
      : undefined
    profileView.indexedAt = profileDoc.indexedAt
    return profileView
  }

  try {
    const didDoc = await ctx.resolver.resolveDidToDidDoc(follow.subject)
    profileView.handle = didDoc.handle || 'unknown'
  } catch (err) {
    ctx.logger.warn(
      { did: follow.subject, err },
      'Failed to resolve DID for followed user',
    )
  }

  return profileView
}

async function createSubjectProfileView(ctx: AppContext, actorDid: string) {
  const profileDoc = await ctx.db.models.Profile.findOne({
    authorDid: actorDid,
  })

  const profileView: BskyActorDefs.ProfileView = {
    $type: 'app.bsky.actor.defs#profileView',
    did: actorDid,
    handle: 'unknown',
  }

  if (profileDoc) {
    profileView.handle = profileDoc.authorHandle
    profileView.displayName = profileDoc.displayName
    profileView.description = profileDoc.description
    profileView.avatar = profileDoc.avatar?.ref?.$link
      ? `https://media.sprk.so/avatar/tiny/${actorDid}/${profileDoc.avatar.ref.$link}/webp`
      : undefined
    profileView.indexedAt = profileDoc.indexedAt
    return profileView
  }

  try {
    const didDoc = await ctx.resolver.resolveDidToDidDoc(actorDid)
    profileView.handle = didDoc.handle || 'unknown'
  } catch (err) {
    ctx.logger.warn({ did: actorDid, err }, 'Failed to resolve DID for subject')
  }

  return profileView
}
