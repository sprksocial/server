import { Hono } from 'hono'
import { AppContext } from '../index'
import { isValidHandle } from '@atproto/syntax'
import { HTTPException } from 'hono/http-exception'
import { AtpAgent } from '@atproto/api'

export type Session = {
  did: string
  accessJwt: string
  refreshJwt?: string
}

// Helper function to extract session from Authorization header
export const getSessionFromHeader = async (authHeader?: string): Promise<Session | null> => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }

  const accessJwt = authHeader.substring(7) // Remove 'Bearer ' prefix

  try {
    // Extract DID from the JWT without verifying signature
    // AT Protocol JWTs have the DID encoded in them
    const [, payload] = accessJwt.split('.')
    if (!payload) return null

    const decoded = JSON.parse(Buffer.from(payload, 'base64').toString())
    if (!decoded.sub) return null

    return {
      did: decoded.sub,
      accessJwt
    }
  } catch (err) {
    return null
  }
}

export const createAuthRouter = (ctx: AppContext) => {
  const router = new Hono()

  router.post('/register', async (c) => {
    const body = await c.req.json().catch(() => ({}))
    const { handle, password, email, invite } = body as {
      handle: string
      password: string
      email: string
      invite?: string
    }

    if (!handle || !password || !email) {
      return c.json({ error: 'Handle and password are required' }, 400)
    }

    if (!isValidHandle(handle)) {
      return c.json({ error: 'Invalid handle' }, 400)
    }

    const agent = new AtpAgent({
      service: 'https://pds.sprk.so',
    })

    const { success, data } = await agent.com.atproto.server.createAccount({
      handle,
      password,
      email,
      inviteCode: invite,
    })

    if (!success || !data) {
      throw new Error('Registration failed')
    }

    return c.json({ success: true, did: data.did, token: data.accessJwt })
  })

  router.post('/login', async (c) => {
    const body = await c.req.json().catch(() => ({}))
    const { handle, password } = body as {
      handle: string
      password: string
    }

    if (!handle || !password) {
      return c.json({ error: 'Handle and password are required' }, 400)
    }

    if (!isValidHandle(handle)) {
      return c.json({ error: 'Invalid handle' }, 400)
    }
    try {
      const handleData = await ctx.resolver.resolveHandleToDidDoc(handle)

      const agent = new AtpAgent({
        service: handleData.pds,
      })
      const { data } = await agent.com.atproto.server.createSession({
        identifier: handle,
        password,
      })

      if (!data) {
        throw new Error('Login failed')
      }

      return c.json({
        success: true,
        did: data.did,
        accessJwt: data.accessJwt,
        refreshJwt: data.refreshJwt
      })
    } catch (err: any) {
      ctx.logger.error({ err }, 'Login failed')
      return c.json(
        {
          error: 'Login failed',
          message: err?.message || 'Invalid credentials or service unavailable',
        },
        401,
      )
    }
  })

  router.get('/oauth/login', async (c) => {
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

      const redirectUrl = new URL('/', c.req.url)

      redirectUrl.searchParams.set('did', session.did)

      return c.redirect(redirectUrl.toString())
    } catch (err) {
      ctx.logger.error({ err }, 'oauth callback failed')
      return c.redirect('/?error')
    }
  })

  router.get('/session', async (c) => {
    // Extract token from authorization header
    const authHeader = c.req.header('Authorization')
    const session = await getSessionFromHeader(authHeader)

    if (!session || !session.did) {
      return c.json(null)
    }

    // Return the full session info including did and token
    return c.json(session)
  })

  return router
}
