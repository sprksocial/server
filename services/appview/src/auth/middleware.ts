import { Context, Next } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { getSessionFromHeader, Session } from './login'

// Extend the Context type to include the session
declare module 'hono' {
  interface ContextVariableMap {
    session: Session
    did: string // Add did for more convenient access
    accessJwt: string // Add token for more convenient access
  }
}

// Authentication middleware
export const authMiddleware = async (c: Context, next: Next) => {
  const authHeader = c.req.header('Authorization')
  const session = await getSessionFromHeader(authHeader)

  if (!session || !session.did) {
    throw new HTTPException(401, {
      message: 'Unauthorized: Invalid or missing AT Protocol JWT token',
    })
  }

  // Set both session and did in the context for route handlers to access
  c.set('session', session)
  c.set('did', session.did)
  c.set('accessJwt', session.accessJwt)

  await next()
}