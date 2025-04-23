import { Context, Next } from 'hono'
import { TakedownService } from '../services/takedown.js'
import { get } from 'lodash'

/**
 * Middleware that filters out taken-down content from responses
 * This is meant to be applied to routes that return content
 * that might have been taken down by admins
 */
export const takedownFilterMiddleware = async (c: Context, next: Next) => {
  // Skip filtering if user is an admin
  const isAdmin = c.get('isAdmin') as boolean | undefined
  if (isAdmin) {
    await next()
    return
  }

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

    const body = await c.res.json()

    const targetDid = body.did || body.user?.did || body.actor?.did || body.profile?.did || body.subject?.did
    if (targetDid) {
      const isRepoTakenDown = await takedownService.isRepoTakenDown(targetDid)
      if (isRepoTakenDown) {
        // For specific user/profile views, return minimal placeholder
        if (body.did && body.$type && body.$type.includes('profileView')) {
          const takenDownProfile = {
            $type: body.$type,
            did: body.did,
            handle: body.handle || 'unavailable',
            moderation: {
              takenDown: true,
            },
          }
          c.res = new Response(JSON.stringify(takenDownProfile), {
            status: c.res.status,
            headers: c.res.headers,
          })
          return
        } else {
          // For other single-user responses, null out or minimize the content
          c.res = new Response(JSON.stringify({
            error: 'Content unavailable - repository has been taken down',
            code: 404
          }), {
            status: 404,
            headers: c.res.headers,
          })
          return
        }
      }
    }

    // Continue with specific content type filtering
    if (body.posts && Array.isArray(body.posts)) {
      const filteredPosts = await filterTakenDownItems(
        body.posts,
        takedownService,
        'uri',
      )
      body.posts = filteredPosts
    } else if (body.feed && Array.isArray(body.feed)) {
      const filteredFeed = await filterTakenDownItems(
        body.feed,
        takedownService,
        'post.uri',
      )
      body.feed = filteredFeed
    } else if (body.thread && body.thread.post) {
      const isThreadTakenDown = await takedownService.isTakenDown(
        body.thread.post.uri,
      )
      
      // Also check if the thread author repo is taken down
      let isAuthorTakenDown = false
      if (body.thread.post.author?.did) {
        isAuthorTakenDown = await takedownService.isRepoTakenDown(
          body.thread.post.author.did
        )
      }
      
      if (isThreadTakenDown || isAuthorTakenDown) {
        body.thread = null
      } else if (body.thread.replies) {
        body.thread.replies = await filterReplies(
          body.thread.replies,
          takedownService,
        )
      }
    }

    // If there are user profiles in the response, filter out taken down repositories
    if (body.profiles && Array.isArray(body.profiles)) {
      const filteredProfiles = await filterTakenDownRepos(
        body.profiles,
        takedownService,
      )
      body.profiles = filteredProfiles
    } else if (body.profile) {
      if (body.profile.did) {
        const isRepoTakenDown = await takedownService.isRepoTakenDown(
          body.profile.did,
        )
        if (isRepoTakenDown) {
          body.profile = null
        }
      }
    } else if (body.did && body.$type && body.$type.includes('profileView')) {
      // For direct ProfileViewDetailed objects (so.sprk.actor.getProfile)
      const isRepoTakenDown = await takedownService.isRepoTakenDown(body.did)
      if (isRepoTakenDown) {
        // Return a minimal placeholder object for taken-down profiles
        const takenDownProfile = {
          $type: body.$type,
          did: body.did,
          handle: body.handle || 'unavailable',
          moderation: {
            takenDown: true,
          },
        }

        // Create a new response with the placeholder instead of trying to modify body
        c.res = new Response(JSON.stringify(takenDownProfile), {
          status: c.res.status,
          headers: c.res.headers,
        })

        // Skip the rest of the processing
        return
      }
    } else if (body.subject) {
      // For followers/follows response that has a subject profile
      if (body.subject.did) {
        const isRepoTakenDown = await takedownService.isRepoTakenDown(
          body.subject.did,
        )
        if (isRepoTakenDown) {
          // Keep minimal info about the profile but mark it as taken down
          body.subject = {
            $type: body.subject.$type,
            did: body.subject.did,
            handle: body.subject.handle || 'unavailable',
            moderation: {
              takenDown: true,
            },
          }
        }
      }

      // Also filter any followers/follows list
      if (body.followers && Array.isArray(body.followers)) {
        body.followers = await filterTakenDownRepos(
          body.followers,
          takedownService,
        )
      }

      if (body.follows && Array.isArray(body.follows)) {
        body.follows = await filterTakenDownRepos(body.follows, takedownService)
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
  items: Record<string, any>[],
  takedownService: TakedownService,
  uriPath: string,
) {
  if (!items || items.length === 0) {
    return items
  }

  const filteredItems: Record<string, any>[] = []

  for (const item of items) {
    let isTakenDown = false

    // Get URI for this specific content
    const uri = get(item, uriPath) as string | undefined
    if (uri) {
      isTakenDown = await takedownService.isTakenDown(uri)
    }

    // Check if author's repo is taken down
    let isAuthorTakenDown = false
    // Look for author DID in common locations
    const authorDid = get(item, 'author.did') || 
                      get(item, 'post.author.did') || 
                      get(item, 'user.did') || 
                      get(item, 'actor.did')
    
    if (authorDid) {
      isAuthorTakenDown = await takedownService.isRepoTakenDown(authorDid)
    }

    // Keep the item only if neither the content nor the author is taken down
    if (!isTakenDown && !isAuthorTakenDown) {
      // Also check for any embedded items like quotes or replies
      if (item.embed && item.embed.record && item.embed.record.author?.did) {
        const embedAuthorTakenDown = await takedownService.isRepoTakenDown(item.embed.record.author.did)
        if (embedAuthorTakenDown) {
          // Null out the embed if from a taken-down repo
          item.embed = {
            $type: item.embed.$type,
            takenDown: true
          }
        } else if (item.embed.record.uri) {
          // Check if the specific embedded content is taken down
          const embedContentTakenDown = await takedownService.isTakenDown(item.embed.record.uri)
          if (embedContentTakenDown) {
            item.embed = {
              $type: item.embed.$type,
              takenDown: true
            }
          }
        }
      }
      filteredItems.push(item)
    }
  }

  return filteredItems
}

// Helper function to filter out taken down repositories
async function filterTakenDownRepos(
  profiles: any[],
  takedownService: TakedownService,
): Promise<any[]> {
  if (!profiles || !Array.isArray(profiles)) return profiles

  const filteredProfiles: any[] = []

  for (const profile of profiles) {
    if (profile.did) {
      const isRepoTakenDown = await takedownService.isRepoTakenDown(profile.did)
      if (!isRepoTakenDown) {
        filteredProfiles.push(profile)
      } else {
        // For UI consistency, push a minimal placeholder for taken-down profiles
        // if they need to be represented in lists (follows, followers, etc.)
        filteredProfiles.push({
          $type: profile.$type,
          did: profile.did,
          handle: profile.handle || 'unavailable',
          moderation: {
            takenDown: true,
          },
        })
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
  takedownService: TakedownService,
): Promise<any[]> {
  if (!images || !Array.isArray(images)) return images

  const filteredImages: any[] = []

  for (const image of images) {
    // Check if the image is taken down based on blob CID
    if (image.cid && image.did) {
      const isBlobTakenDown = await takedownService.isBlobTakenDown(
        image.did,
        image.cid,
      )
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
  takedownService: TakedownService,
): Promise<any[]> {
  if (!replies || !Array.isArray(replies)) return replies

  const filteredReplies: any[] = []

  for (const reply of replies) {
    if (reply.post && reply.post.uri) {
      const isTakenDown = await takedownService.isTakenDown(reply.post.uri)

      // Check if author's repo is taken down
      let isAuthorTakenDown = false
      if (reply.post.author?.did) {
        isAuthorTakenDown = await takedownService.isRepoTakenDown(
          reply.post.author.did,
        )
      }

      if (!isTakenDown && !isAuthorTakenDown) {
        // If this reply has nested replies, filter those too
        if (reply.replies && Array.isArray(reply.replies)) {
          reply.replies = await filterReplies(reply.replies, takedownService)
        }

        // Filter out taken down images in the post
        if (
          reply.post.embed?.images &&
          Array.isArray(reply.post.embed.images)
        ) {
          reply.post.embed.images = await filterTakenDownBlobs(
            reply.post.embed.images,
            takedownService,
          )
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
