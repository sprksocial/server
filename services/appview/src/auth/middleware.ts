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

/**
 * Authentication middleware for ATP agents
 * 
 * @param c - Hono context
 * @param next - Next middleware function
 * @param adminRequired - Whether admin privileges are required (checks agent DID against ADMIN_DIDS)
 */
export const authMiddleware = async (c: Context, next: Next, adminRequired = false) => {
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

    // Check for admin status if required
    if (adminRequired) {
      const isAdmin = env.ADMIN_DIDS.includes(parsed.iss)
      if (!isAdmin) {
        throw new HTTPException(403, {
          message: 'Forbidden: Admin privileges required',
        })
      }
      c.set('isAdmin', true)
    }

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

/**
 * Optional authentication middleware - doesn't throw on missing/invalid auth
 * Still sets isAdmin flag if the user has admin privileges
 */
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
      
      // Check if user has admin privileges (but don't require it)
      if (env.ADMIN_DIDS.includes(parsed.iss)) {
        c.set('isAdmin', true)
      }
    } catch (err) {
      // On auth failure, just continue without setting auth context
    }
  }

  await next()
}