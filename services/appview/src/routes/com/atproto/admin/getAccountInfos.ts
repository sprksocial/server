import { Hono } from 'hono'
import { authMiddleware } from '../../../../auth/middleware.js'
import { AppContext } from '../../../../index.js'
import { mapDefined } from '@atproto/common'
import { INVALID_HANDLE } from '@atproto/syntax'

export const createGetAccountInfosRouter = (ctx: AppContext) => {
  const router = new Hono()

  router.get(
    '/xrpc/com.atproto.admin.getAccountInfos',
    (c, next) => authMiddleware(c, next, true),
    async (c) => {
      const dids = c.req.queries('dids[]')
      if (!dids || dids.length === 0) {
        return c.json({ error: 'Missing or empty dids parameter' }, 400)
      }

      const timestamp = new Date().toISOString()

      const infos = await Promise.all(
        mapDefined(dids, async (did) => {
          await ctx.indexingService.indexHandle(did, timestamp)
          const actor = await ctx.db.models.Actor.findOne({ did })
          if (!actor) return

          const profile = await ctx.db.models.Profile.findOne({
            did: actor.did,
          })

          return {
            did: actor.did,
            handle: actor.handle ?? INVALID_HANDLE,
            relatedRecords: [profile],
            indexedAt: actor.indexedAt,
          }
        }),
      )

      return c.json(infos)
    },
  )

  return router
}
