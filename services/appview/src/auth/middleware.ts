import { Context, Next } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { verifyJwt } from '@atproto/xrpc-server'
import { DidResolver } from '@atproto/identity'
import { env } from '../env.js'
import { TakedownService } from '../services/takedown.js'

// Extend the Context type to include auth information
declare module 'hono' {
  interface ContextVariableMap {
    did: string
    accessJwt: string
    serviceDid: string
    didResolver: DidResolver
    isAdmin: boolean
    takedownService: TakedownService
  }
}

// Authentication middleware
export const authMiddleware = async (c: Context, next: Next) => {
  const authHeader = c.req.header('Authorization')

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new HTTPException(401, {
      message: 'Unauthorized: Invalid or missing Authorization header',
    })
  }

  const jwt = authHeader.replace('Bearer ', '').trim()

  try {
    // The service DID and resolver should be passed from app context
    const serviceDid = c.get('serviceDid')
    const didResolver = c.get('didResolver') as DidResolver

    const parsed = await verifyJwt(jwt, serviceDid, null, async (did: string) => {
      return didResolver.resolveAtprotoKey(did)
    })

    // Set auth information in the context for route handlers to access
    c.set('did', parsed.iss)
    c.set('accessJwt', jwt)

    await next()
  } catch (err) {
    throw new HTTPException(401, {
      message: 'Unauthorized: Invalid JWT token',
    })
  }
}

// Optional authentication middleware - doesn't throw on missing/invalid auth
export const optionalAuthMiddleware = async (c: Context, next: Next) => {
  const authHeader = c.req.header('Authorization')

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const jwt = authHeader.replace('Bearer ', '').trim()

    try {
      const serviceDid = c.get('serviceDid')
      const didResolver = c.get('didResolver') as DidResolver

      const parsed = await verifyJwt(jwt, serviceDid, null, async (did: string) => {
        return didResolver.resolveAtprotoKey(did)
      })

      // Set auth information if JWT is valid
      c.set('did', parsed.iss)
      c.set('accessJwt', jwt)
    } catch (err) {
      // On auth failure, just continue without setting auth context
    }
  }

  await next()
}

// Admin authentication middleware
export const adminAuthMiddleware = async (c: Context, next: Next) => {
  const authHeader = c.req.header('Authorization')
  const adminPassword = c.req.header('X-Admin-Password')

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new HTTPException(401, {
      message: 'Unauthorized: Invalid or missing Authorization header',
    })
  }

  const jwt = authHeader.replace('Bearer ', '').trim()

  try {
    // The service DID and resolver should be passed from app context
    const serviceDid = c.get('serviceDid')
    const didResolver = c.get('didResolver') as DidResolver

    const parsed = await verifyJwt(jwt, serviceDid, null, async (did: string) => {
      return didResolver.resolveAtprotoKey(did)
    })

    // Set auth information in the context for route handlers to access
    c.set('did', parsed.iss)
    c.set('accessJwt', jwt)

    // Check if admin password is valid
    if (!adminPassword || !env.ADMIN_PASSWORDS.includes(adminPassword)) {
      throw new HTTPException(403, {
        message: 'Forbidden: Invalid admin credentials',
      })
    }

    c.set('isAdmin', true)
    
    await next()
  } catch (err) {
    if (err instanceof HTTPException) {
      throw err
    }
    throw new HTTPException(401, {
      message: 'Unauthorized: Invalid JWT token',
    })
  }
}