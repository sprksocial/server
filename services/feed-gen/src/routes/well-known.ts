import { Hono } from 'hono'
import { env } from '../utils/env'

const wellKnownRouter = () => {
  const router = new Hono()

  router.get('/.well-known/did.json', (c) => {

    return c.json({
      '@context': ['https://www.w3.org/ns/did/v1'],
      id: `did:web:${env.FEEDGEN_DOMAIN}`,
      service: [
        {
          id: '#sprk_fg',
          type: 'SprkFeedGenerator',
          serviceEndpoint: `https://${env.FEEDGEN_DOMAIN}`,
        },
      ],
    })
  })

  return router
}

export default wellKnownRouter