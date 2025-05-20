import { Hono } from 'hono'
import { AppContext } from '../../../../index.js'
import { authMiddleware } from '../../../../auth/middleware.js'
import * as SoSprkActorPutPreferences from '../../../../lexicon/types/so/sprk/actor/putPreferences.js'

export const createPutPreferencesRouter = (ctx: AppContext) => {
  const router = new Hono()

  router.post(
    '/xrpc/so.sprk.actor.putPreferences',
    authMiddleware,
    async (c) => {
      const userDid = c.get('did') as string
      const body = await c.req.json() as SoSprkActorPutPreferences.InputSchema

      if (body.followMode && !['bsky', 'sprk'].includes(body.followMode)) {
        return c.json(
          { error: 'Invalid followMode parameter. Must be "bsky" or "sprk"' },
          400,
        )
      }

      try {
        const now = new Date().toISOString()
        let userPref = await ctx.db.models.UserPreference.findOne({ userDid })

        if (!userPref) {
          userPref = await ctx.db.models.UserPreference.create({
            userDid,
            createdAt: now,
            updatedAt: now,
            followMode: body.followMode || 'sprk', // Default if not provided
          })
        } else {
          if (body.followMode) {
            userPref.followMode = body.followMode
          }
          userPref.updatedAt = now
          await userPref.save()
        }

        // Respond with all current preferences, including the updated followMode
        return c.json({ followMode: userPref.followMode }, 200)

      } catch (error) {
        ctx.logger.error({ error, userDid }, 'Failed to put preferences')
        return c.json({ error: 'Failed to put preferences' }, 500)
      }
    },
  )

  return router
}