import { Hono } from 'hono'
import { authMiddleware, optionalAuthMiddleware } from '../../../../auth/middleware.js'
import { AppContext } from '../../../../index.js'

export const createGetSubjectStatusRouter = (ctx: AppContext) => {
  const router = new Hono()

  router.get('/xrpc/com.atproto.admin.getSubjectStatus', (c, next) => authMiddleware(c, next, true), async (c) => {
    const did = c.req.query('did')
    const uri = c.req.query('uri')
    const blob = c.req.query('blob')

    if (!did && !uri && !blob) {
      return c.json({ error: 'Missing required parameter' }, 400)
    }

    let subject
    let takedown
    if (did) {
      const actor = await ctx.db.models.Actor.findOne({ did })
      const repoTakedown = await ctx.db.models.RepoTakedown.findOne({
        subjectDid: did
      })
      if (!actor) {
        return c.json({ error: 'Actor not found' }, 404)
      }
      subject = {
        did: actor.did,
      }
      if (repoTakedown) {
        takedown = {
          applied: repoTakedown.applied,
          ref: repoTakedown.ref,
        }
      }
    } else if (uri) {
      const record =
        (await ctx.db.models.Profile.findOne({ uri })) ??
        (await ctx.db.models.Post.findOne({ uri })) ??
        (await ctx.db.models.Audio.findOne({ uri }))
      const recordTakedown = await ctx.db.models.Takedown.findOne({
        subjectUri: uri,
      })
      if (!record) {
        return c.json({ error: 'Record not found' }, 404)
      }
      subject = {
        uri: record.uri,
        cid: record.cid,
      }
      if (recordTakedown) {
        takedown = {
          applied: recordTakedown.applied,
          ref: recordTakedown.ref,
        }
      }
    } else if (blob) {
      const blobRecord =
        (await ctx.db.models.Profile.findOne({ blob })) ??
        (await ctx.db.models.Post.findOne({ blob })) ??
        (await ctx.db.models.Audio.findOne({ blob }))
      if (!blobRecord) {
        return c.json({ error: 'Blob record not found' }, 404)
      }
      subject = {
        did: blobRecord.authorDid,
        cid: blobRecord.cid,
        recordUri: blobRecord.uri,
      }
      const blobTakedown = await ctx.db.models.BlobTakedown.findOne({
        subjectDid: blobRecord.authorDid,
        subjectCid: blobRecord.cid,
      })
      if (blobTakedown) {
        takedown = {
          applied: blobTakedown.applied,
          ref: blobTakedown.ref,
        }
      }
    }

    return c.json({ subject, takedown })
  })

  return router
}
