import { Hono } from 'hono'
import { AppContext } from '../index.js'
import { isValidHandle } from '@atproto/syntax'
import { getIronSession } from 'iron-session'
import { env } from '../env.js'
import assert from 'node:assert'
import { HTTPException } from 'hono/http-exception'

type Session = { did: string }

const ironSessionOptions = {
  cookieName: 'sid',
  password: env.COOKIE_SECRET,
}

export const createAuthRouter = (ctx: AppContext) => {
  const router = new Hono()

  router.get('/login', async (c) => {
    const handle = c.req.query('handle') || ''

    if (!isValidHandle(handle)) {
      return c.json({ error: 'Invalid handle' }, 400)
    }

    try {
      const url = await ctx.oauthClient.authorize(handle, {
        scope: 'atproto transition:generic',
      })

      return c.redirect(url.toString())
    } catch (err: any) {
      if (err?.cause?.message?.includes('does not resolve to a DID')) {
        throw new HTTPException(400, {
          message: 'Handle does not resolve to a valid DID',
        })
      }
      ctx.logger.error({ err }, 'Failed to generate authorization URL')
      throw new HTTPException(500, {
        message: 'Failed to generate authorization URL',
      })
    }
  })

  router.get('/oauth/callback', async (c) => {
    const url = new URL(c.req.url)
    const params = url.searchParams

    try {
      const { session } = await ctx.oauthClient.callback(params)
      const req = c.req.raw
      const res = c.res

      const clientSession = await getIronSession<Session>(
        req,
        res,
        ironSessionOptions,
      )

      try {
        assert(!clientSession.did, 'session already exists')
      } catch (err) {
        // Session already exists, we'll just update it
        ctx.logger.info('Updating existing session')
      }

      clientSession.did = session.did
      await clientSession.save()

      return c.redirect('/')
    } catch (err) {
      ctx.logger.error({ err }, 'oauth callback failed')
      return c.redirect('/?error')
    }
  })

  router.get('/session', async (c) => {
    const req = c.req.raw
    const res = c.res

    const clientSession = await getIronSession<Session>(
      req,
      res,
      ironSessionOptions,
    )

    const did = clientSession.did

    if (!did) {
      return c.json(null)
    }

    return c.json({ did })
  })

  return router
}
