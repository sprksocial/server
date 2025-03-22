import { HonoRequest } from 'hono'
import { verifyJwt, AuthRequiredError, parseReqNsid } from '@atproto/xrpc-server'
import { DidResolver } from '@atproto/identity'

export async function validateAuth(
  req: HonoRequest,
  serviceDid: string,
  didResolver: DidResolver,
): Promise<string> {
  const authorization = req.header('Authorization') ?? ''
  if (!authorization.startsWith('Bearer ')) {
    throw new AuthRequiredError()
  }
  const jwt = authorization.replace('Bearer ', '').trim()
  const nsid = parseReqNsid({
    originalUrl: req.path
  })
  const parsed = await verifyJwt(jwt, serviceDid, nsid, async (did: string) => {
    return didResolver.resolveAtprotoKey(did)
  })
  return parsed.iss
}