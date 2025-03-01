import { Router } from 'express'
import { sql } from 'kysely'
import { AppContext } from './context'

export const createRouter = (ctx: AppContext): Router => {
  const router = Router()

  router.get('/', function (req, res) {
    res.type('text/plain')
    res.send(`

   _____                  _       _____            _       _
  / ____|                | |     / ____|          (_)     | |
 | (___  _ __   __ _ _ __| | __ | (___   ___   ___ _  __ _| |
  \\___ \\| '_ \\ / _\` | '__| |/ /  \\___ \\ / _ \\ / __| |/ _\` | |
  ____) | |_) | (_| | |  |   <   ____) | (_) | (__| | (_| | |
 |_____/| .__/ \\__,_|_|  |_|\_\   |_____/ \\___/ \\___|_|\\__,_|_|
        | |
        |_|


      This is Spark Social Personal Data Server (PDS).
      `)
  })

  router.get('/robots.txt', function (req, res) {
    res.type('text/plain')
    res.send(
      '# Hello!\n\n# Crawling the public API is allowed\nUser-agent: *\nAllow: /',
    )
  })

  router.get('/xrpc/_health', async function (req, res) {
    const { version } = ctx.cfg.service
    try {
      await sql`select 1`.execute(ctx.accountManager.db.db)
    } catch (err) {
      req.log.error(err, 'failed health check')
      res.status(503).send({ version, error: 'Service Unavailable' })
      return
    }
    res.send({ version })
  })

  return router
}
