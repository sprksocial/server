import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { HTTPException } from 'hono/http-exception'
import { TakedownService } from '../../services/takedown.js'
import { adminAuthMiddleware } from '../../auth/middleware.js'

const takedownRoutes = new Hono()

// Apply admin auth middleware to all routes
takedownRoutes.use('*', adminAuthMiddleware)

// Create a takedown
takedownRoutes.post('/', zValidator('json', z.object({
  targetUri: z.string(),
  targetCid: z.string(),
  reason: z.string(),
})), async (c) => {
  const { targetUri, targetCid, reason } = c.req.valid('json')
  const adminDid = c.get('did')
  
  const takedownService = c.get('takedownService') as TakedownService
  
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
takedownRoutes.delete('/:uri', async (c) => {
  const uri = c.req.param('uri')
  const takedownService = c.get('takedownService') as TakedownService
  
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
takedownRoutes.post('/repo', zValidator('json', z.object({
  did: z.string(),
  reason: z.string(),
  ref: z.string().optional(),
})), async (c) => {
  const { did, reason, ref } = c.req.valid('json')
  const adminDid = c.get('did')
  
  const takedownService = c.get('takedownService') as TakedownService
  
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
takedownRoutes.delete('/repo/:did', async (c) => {
  const did = c.req.param('did')
  const takedownService = c.get('takedownService') as TakedownService
  
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
takedownRoutes.post('/blob', zValidator('json', z.object({
  did: z.string(),
  cid: z.string(),
  reason: z.string(),
  ref: z.string().optional(),
})), async (c) => {
  const { did, cid, reason, ref } = c.req.valid('json')
  const adminDid = c.get('did')
  
  const takedownService = c.get('takedownService') as TakedownService
  
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
takedownRoutes.delete('/blob/:did/:cid', async (c) => {
  const did = c.req.param('did')
  const cid = c.req.param('cid')
  const takedownService = c.get('takedownService') as TakedownService
  
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
takedownRoutes.get('/', zValidator('query', z.object({
  limit: z.string().optional().transform(val => val ? parseInt(val) : 50),
  cursor: z.string().optional(),
})), async (c) => {
  const { limit, cursor } = c.req.valid('query')
  const takedownService = c.get('takedownService') as TakedownService
  
  try {
    const result = await takedownService.listTakedowns(limit, cursor)
    return c.json(result)
  } catch (error) {
    throw new HTTPException(500, { message: 'Failed to list takedowns' })
  }
})

// List repo takedowns
takedownRoutes.get('/repo', zValidator('query', z.object({
  limit: z.string().optional().transform(val => val ? parseInt(val) : 50),
  cursor: z.string().optional(),
})), async (c) => {
  const { limit, cursor } = c.req.valid('query')
  const takedownService = c.get('takedownService') as TakedownService
  
  try {
    const result = await takedownService.listRepoTakedowns(limit, cursor)
    return c.json(result)
  } catch (error) {
    throw new HTTPException(500, { message: 'Failed to list repo takedowns' })
  }
})

// List blob takedowns
takedownRoutes.get('/blob', zValidator('query', z.object({
  limit: z.string().optional().transform(val => val ? parseInt(val) : 50),
  cursor: z.string().optional(),
})), async (c) => {
  const { limit, cursor } = c.req.valid('query')
  const takedownService = c.get('takedownService') as TakedownService
  
  try {
    const result = await takedownService.listBlobTakedowns(limit, cursor)
    return c.json(result)
  } catch (error) {
    throw new HTTPException(500, { message: 'Failed to list blob takedowns' })
  }
})

// Check if content is taken down
takedownRoutes.get('/check/:uri', async (c) => {
  const uri = c.req.param('uri')
  const takedownService = c.get('takedownService') as TakedownService
  
  try {
    const isTakenDown = await takedownService.isTakenDown(uri)
    return c.json({ isTakenDown })
  } catch (error) {
    throw new HTTPException(500, { message: 'Failed to check takedown status' })
  }
})

// Check if repo is taken down
takedownRoutes.get('/check/repo/:did', async (c) => {
  const did = c.req.param('did')
  const takedownService = c.get('takedownService') as TakedownService
  
  try {
    const isTakenDown = await takedownService.isRepoTakenDown(did)
    return c.json({ isTakenDown })
  } catch (error) {
    throw new HTTPException(500, { message: 'Failed to check repo takedown status' })
  }
})

// Check if blob is taken down
takedownRoutes.get('/check/blob/:did/:cid', async (c) => {
  const did = c.req.param('did')
  const cid = c.req.param('cid')
  const takedownService = c.get('takedownService') as TakedownService
  
  try {
    const isTakenDown = await takedownService.isBlobTakenDown(did, cid)
    return c.json({ isTakenDown })
  } catch (error) {
    throw new HTTPException(500, { message: 'Failed to check blob takedown status' })
  }
})

// XRPC endpoint for Ozone integration: com.atproto.admin.updateSubjectStatus
takedownRoutes.post('/xrpc/com.atproto.admin.updateSubjectStatus', zValidator('json', z.object({
  subject: z.object({
    $type: z.string(),
    did: z.string().optional(),
    uri: z.string().optional(),
    cid: z.string().optional(),
  }),
  takedown: z.object({
    applied: z.boolean(),
    ref: z.string().optional(),
  }),
})), async (c) => {
  const { subject, takedown } = c.req.valid('json')
  const adminDid = c.get('did')
  
  const takedownService = c.get('takedownService') as TakedownService
  
  try {
    // Handle different subject types
    if (subject.$type === 'com.atproto.admin.defs#repoRef') {
      // Repository (user account) takedown
      if (!subject.did) {
        throw new HTTPException(400, { message: 'DID is required for repo takedowns' })
      }
      
      if (takedown.applied) {
        // Apply takedown
        await takedownService.takedownRepo({
          did: subject.did,
          reason: 'Moderation via Ozone',
          adminDid,
          ref: takedown.ref,
        })
      } else {
        // Remove takedown
        await takedownService.removeRepoTakedown(subject.did)
      }
    } else if (subject.$type === 'com.atproto.repo.strongRef') {
      // Record (post) takedown
      if (!subject.uri || !subject.cid) {
        throw new HTTPException(400, { message: 'URI and CID are required for record takedowns' })
      }
      
      if (takedown.applied) {
        // Apply takedown
        await takedownService.takedownContent({
          targetUri: subject.uri,
          targetCid: subject.cid,
          reason: 'Moderation via Ozone',
          adminDid,
        })
      } else {
        // Remove takedown
        await takedownService.removeTakedown(subject.uri)
      }
    } else if (subject.$type === 'com.atproto.admin.defs#repoBlobRef') {
      // Blob (image/attachment) takedown
      if (!subject.did || !subject.cid) {
        throw new HTTPException(400, { message: 'DID and CID are required for blob takedowns' })
      }
      
      if (takedown.applied) {
        // Apply takedown
        await takedownService.takedownBlob({
          did: subject.did,
          cid: subject.cid,
          reason: 'Moderation via Ozone',
          adminDid,
          ref: takedown.ref,
        })
      } else {
        // Remove takedown
        await takedownService.removeBlobTakedown(subject.did, subject.cid)
      }
    } else {
      throw new HTTPException(400, { message: `Unsupported subject type: ${subject.$type}` })
    }
    
    // Return the response format expected by Ozone
    return c.json({
      subject,
      takedown: takedown.applied ? {
        applied: takedown.applied,
        ref: takedown.ref
      } : undefined
    })
  } catch (error) {
    if (error instanceof HTTPException) {
      throw error
    }
    throw new HTTPException(500, { message: 'Failed to update subject status' })
  }
})

export default takedownRoutes 