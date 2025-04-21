import { Context, Next } from 'hono'
import { TakedownService } from '../services/takedown.js'

/**
 * Middleware that filters out taken-down content from responses
 * This is meant to be applied to routes that return content
 * that might have been taken down by admins
 */
export const takedownFilterMiddleware = async (c: Context, next: Next) => {
  // Call the next middleware/route handler first
  await next()
  
  // Skip filtering if not a JSON response
  const contentType = c.res.headers.get('Content-Type')
  if (!contentType || !contentType.includes('application/json')) {
    return
  }
  
  try {
    // Get the takedown service from context
    const takedownService = c.get('takedownService') as TakedownService
    
    // Get the response body
    const body = await c.res.json()
    
    // Process different response formats
    if (body.posts && Array.isArray(body.posts)) {
      // For post feeds
      const filteredPosts = await filterTakenDownItems(body.posts, takedownService, 'uri')
      body.posts = filteredPosts
    } else if (body.feed && Array.isArray(body.feed)) {
      // For general feeds
      const filteredFeed = await filterTakenDownItems(body.feed, takedownService, 'post.uri')
      body.feed = filteredFeed
    } else if (body.thread && body.thread.post) {
      // For thread views
      const isThreadTakenDown = await takedownService.isTakenDown(body.thread.post.uri)
      if (isThreadTakenDown) {
        // If the main post is taken down, return empty thread
        body.thread = null
      } else if (body.thread.replies) {
        // Filter replies if they exist
        body.thread.replies = await filterReplies(body.thread.replies, takedownService)
      }
    }

    // If there are user profiles in the response, filter out taken down repositories
    if (body.profiles && Array.isArray(body.profiles)) {
      const filteredProfiles = await filterTakenDownRepos(body.profiles, takedownService)
      body.profiles = filteredProfiles
    } else if (body.profile) {
      // For single profile view
      if (body.profile.did) {
        const isRepoTakenDown = await takedownService.isRepoTakenDown(body.profile.did)
        if (isRepoTakenDown) {
          body.profile = null
        }
      }
    }
    
    // Set the filtered response
    c.res = new Response(JSON.stringify(body), {
      status: c.res.status,
      headers: c.res.headers,
    })
  } catch (error) {
    // In case of error, just continue with the original response
    console.error('Error in takedown filter middleware:', error)
  }
}

// Helper function to filter out taken down items
async function filterTakenDownItems(
  items: any[],
  takedownService: TakedownService,
  uriPath: string
): Promise<any[]> {
  if (!items || !Array.isArray(items)) return items
  
  const filteredItems: any[] = []
  
  for (const item of items) {
    // Get the URI based on the specified path (handles nested objects)
    const uri = uriPath.split('.').reduce((obj, key) => obj && obj[key], item)
    
    if (uri) {
      const isTakenDown = await takedownService.isTakenDown(uri)
      
      // Check if author's repo is taken down
      let isAuthorTakenDown = false
      if (item.author?.did || (item.post?.author?.did)) {
        const authorDid = item.author?.did || item.post?.author?.did
        isAuthorTakenDown = await takedownService.isRepoTakenDown(authorDid)
      }
      
      // Keep the item only if neither the content nor the author is taken down
      if (!isTakenDown && !isAuthorTakenDown) {
        // Filter out taken down images if the item has embeds
        if (item.embed?.images && Array.isArray(item.embed.images)) {
          item.embed.images = await filterTakenDownBlobs(item.embed.images, takedownService)
        }
        
        filteredItems.push(item)
      }
    } else {
      // If URI is not found, keep the item
      filteredItems.push(item)
    }
  }
  
  return filteredItems
}

// Helper function to filter out taken down repositories
async function filterTakenDownRepos(
  profiles: any[],
  takedownService: TakedownService
): Promise<any[]> {
  if (!profiles || !Array.isArray(profiles)) return profiles
  
  const filteredProfiles: any[] = []
  
  for (const profile of profiles) {
    if (profile.did) {
      const isRepoTakenDown = await takedownService.isRepoTakenDown(profile.did)
      if (!isRepoTakenDown) {
        filteredProfiles.push(profile)
      }
    } else {
      // If no DID, keep the profile
      filteredProfiles.push(profile)
    }
  }
  
  return filteredProfiles
}

// Helper function to filter out taken down blobs/images
async function filterTakenDownBlobs(
  images: any[],
  takedownService: TakedownService
): Promise<any[]> {
  if (!images || !Array.isArray(images)) return images
  
  const filteredImages: any[] = []
  
  for (const image of images) {
    // Check if the image is taken down based on blob CID
    if (image.cid && image.did) {
      const isBlobTakenDown = await takedownService.isBlobTakenDown(image.did, image.cid)
      if (!isBlobTakenDown) {
        filteredImages.push(image)
      }
    } else {
      // If no CID or DID, keep the image
      filteredImages.push(image)
    }
  }
  
  return filteredImages
}

// Helper function to recursively filter replies in a thread
async function filterReplies(
  replies: any[],
  takedownService: TakedownService
): Promise<any[]> {
  if (!replies || !Array.isArray(replies)) return replies
  
  const filteredReplies: any[] = []
  
  for (const reply of replies) {
    if (reply.post && reply.post.uri) {
      const isTakenDown = await takedownService.isTakenDown(reply.post.uri)
      
      // Check if author's repo is taken down
      let isAuthorTakenDown = false
      if (reply.post.author?.did) {
        isAuthorTakenDown = await takedownService.isRepoTakenDown(reply.post.author.did)
      }
      
      if (!isTakenDown && !isAuthorTakenDown) {
        // If this reply has nested replies, filter those too
        if (reply.replies && Array.isArray(reply.replies)) {
          reply.replies = await filterReplies(reply.replies, takedownService)
        }
        
        // Filter out taken down images in the post
        if (reply.post.embed?.images && Array.isArray(reply.post.embed.images)) {
          reply.post.embed.images = await filterTakenDownBlobs(reply.post.embed.images, takedownService)
        }
        
        filteredReplies.push(reply)
      }
    } else {
      // If no post or URI, keep the reply
      filteredReplies.push(reply)
    }
  }
  
  return filteredReplies
} 