import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { HTTPException } from 'hono/http-exception'
import { TakedownService } from '../../services/takedown.js'
import { authMiddleware } from '../../auth/middleware.js'
import { Database } from '../../db.js'
import { AtUri } from '@atproto/syntax'

type TakedownContext = {
  takedownService: TakedownService
  db: Database
}

export const createTakedownRouter = (ctx: TakedownContext) => {
  const takedownRoutes = new Hono()
  const takedownService = ctx.takedownService

  // Apply admin auth middleware to all admin routes
  takedownRoutes.use('/admin/*', (c, next) => authMiddleware(c, next, true))

  takedownRoutes.post('/admin/takedowns', zValidator('json', z.object({
    targetUri: z.string(),
    targetCid: z.string(),
    reason: z.string(),
  })), async (c) => {
    const { targetUri, targetCid, reason } = c.req.valid('json')
    const adminDid = c.get('did')
    
    try {
      await takedownService.takedownContent({
        targetUri,
        targetCid,
        reason,
        adminDid,
      })
      
      return c.json({ success: true }, 201)
    } catch (error) {
      throw new HTTPException(500, { message: 'Failed to create takedown' })
    }
  })

  // Remove a takedown (record/post)
  takedownRoutes.delete('/admin/takedowns/:uri', async (c) => {
    const uri = c.req.param('uri')
    
    try {
      const removed = await takedownService.removeTakedown(uri)
      
      if (!removed) {
        return c.json({ success: false, message: 'Takedown not found' }, 404)
      }
      
      return c.json({ success: true })
    } catch (error) {
      throw new HTTPException(500, { message: 'Failed to remove takedown' })
    }
  })

  // Create a repo takedown
  takedownRoutes.post('/admin/takedowns/repo', zValidator('json', z.object({
    did: z.string(),
    reason: z.string(),
    ref: z.string().optional(),
  })), async (c) => {
    const { did, reason, ref } = c.req.valid('json')
    const adminDid = c.get('did')
    
    try {
      await takedownService.takedownRepo({
        did,
        reason,
        adminDid,
        ref,
      })
      
      return c.json({ success: true }, 201)
    } catch (error) {
      throw new HTTPException(500, { message: 'Failed to create repo takedown' })
    }
  })

  // Remove a repo takedown
  takedownRoutes.delete('/admin/takedowns/repo/:did', async (c) => {
    const did = c.req.param('did')
    
    try {
      const removed = await takedownService.removeRepoTakedown(did)
      
      if (!removed) {
        return c.json({ success: false, message: 'Repo takedown not found' }, 404)
      }
      
      return c.json({ success: true })
    } catch (error) {
      throw new HTTPException(500, { message: 'Failed to remove repo takedown' })
    }
  })

  // Create a blob takedown
  takedownRoutes.post('/admin/takedowns/blob', zValidator('json', z.object({
    did: z.string(),
    cid: z.string(),
    reason: z.string(),
    ref: z.string().optional(),
  })), async (c) => {
    const { did, cid, reason, ref } = c.req.valid('json')
    const adminDid = c.get('did')
    
    try {
      await takedownService.takedownBlob({
        did,
        cid,
        reason,
        adminDid,
        ref,
      })
      
      return c.json({ success: true }, 201)
    } catch (error) {
      throw new HTTPException(500, { message: 'Failed to create blob takedown' })
    }
  })

  // Remove a blob takedown
  takedownRoutes.delete('/admin/takedowns/blob/:did/:cid', async (c) => {
    const did = c.req.param('did')
    const cid = c.req.param('cid')
    
    try {
      const removed = await takedownService.removeBlobTakedown(did, cid)
      
      if (!removed) {
        return c.json({ success: false, message: 'Blob takedown not found' }, 404)
      }
      
      return c.json({ success: true })
    } catch (error) {
      throw new HTTPException(500, { message: 'Failed to remove blob takedown' })
    }
  })

  // List takedowns
  takedownRoutes.get('/admin/takedowns', zValidator('query', z.object({
    limit: z.string().optional().transform(val => val ? parseInt(val) : 50),
    cursor: z.string().optional(),
  })), async (c) => {
    const { limit, cursor } = c.req.valid('query')
    
    try {
      const result = await takedownService.listTakedowns(limit, cursor)
      return c.json(result)
    } catch (error) {
      throw new HTTPException(500, { message: 'Failed to list takedowns' })
    }
  })

  // List repo takedowns
  takedownRoutes.get('/admin/takedowns/repo', zValidator('query', z.object({
    limit: z.string().optional().transform(val => val ? parseInt(val) : 50),
    cursor: z.string().optional(),
  })), async (c) => {
    const { limit, cursor } = c.req.valid('query')
    
    try {
      const result = await takedownService.listRepoTakedowns(limit, cursor)
      return c.json(result)
    } catch (error) {
      throw new HTTPException(500, { message: 'Failed to list repo takedowns' })
    }
  })

  // List blob takedowns
  takedownRoutes.get('/admin/takedowns/blob', zValidator('query', z.object({
    limit: z.string().optional().transform(val => val ? parseInt(val) : 50),
    cursor: z.string().optional(),
  })), async (c) => {
    const { limit, cursor } = c.req.valid('query')
    
    try {
      const result = await takedownService.listBlobTakedowns(limit, cursor)
      return c.json(result)
    } catch (error) {
      throw new HTTPException(500, { message: 'Failed to list blob takedowns' })
    }
  })

  // Check if content is taken down
  takedownRoutes.get('/admin/takedowns/check/:uri', async (c) => {
    const uri = c.req.param('uri')
    
    try {
      const isTakenDown = await takedownService.isTakenDown(uri)
      return c.json({ isTakenDown })
    } catch (error) {
      throw new HTTPException(500, { message: 'Failed to check takedown status' })
    }
  })

  // Check if repo is taken down
  takedownRoutes.get('/admin/takedowns/check/repo/:did', async (c) => {
    const did = c.req.param('did')
    
    try {
      const isTakenDown = await takedownService.isRepoTakenDown(did)
      return c.json({ isTakenDown })
    } catch (error) {
      throw new HTTPException(500, { message: 'Failed to check repo takedown status' })
    }
  })

  // Check if blob is taken down
  takedownRoutes.get('/admin/takedowns/check/blob/:did/:cid', async (c) => {
    const did = c.req.param('did')
    const cid = c.req.param('cid')
    
    try {
      const isTakenDown = await takedownService.isBlobTakenDown(did, cid)
      return c.json({ isTakenDown })
    } catch (error) {
      throw new HTTPException(500, { message: 'Failed to check blob takedown status' })
    }
  })

  // Get a specific taken down record with its content
  takedownRoutes.get('/admin/takedowns/content/:uri', async (c) => {
    const uri = c.req.param('uri')
    
    try {
      // First check if this content is taken down
      const takedown = await takedownService.getTakedown(uri)
      if (!takedown) {
        return c.json({ error: 'Content is not taken down' }, 404)
      }

      // Parse the URI to extract components
      const atUri = new AtUri(uri)
      const collection = atUri.collection
      const did = atUri.hostname
      let record = null

      // Get record based on collection
      if (collection.includes('post')) {
        record = await ctx.db.models.Post.findOne({ uri }).lean()
      } else if (collection.includes('repost')) {
        record = await ctx.db.models.Repost.findOne({ uri }).lean()
      } else if (collection.includes('like')) {
        record = await ctx.db.models.Like.findOne({ uri }).lean()
      } else if (collection.includes('follow')) {
        record = await ctx.db.models.Follow.findOne({ uri }).lean()
      } else if (collection.includes('block')) {
        record = await ctx.db.models.Block.findOne({ uri }).lean()
      } else if (collection.includes('profile')) {
        // For profiles we need to extract the DID
        record = await ctx.db.models.Profile.findOne({ authorDid: did }).lean()
      }

      if (!record) {
        return c.json({ error: 'Record content not found in database' }, 404)
      }

      return c.json({
        takedown,
        record
      })
    } catch (error) {
      throw new HTTPException(500, { message: 'Failed to fetch taken down content' })
    }
  })

  return takedownRoutes
} 