import { Hono } from 'hono'
import { AppContext } from '..'
import { Agent } from '@atproto/api'
import { HTTPException } from 'hono/http-exception'
import { CID } from 'multiformats/cid'

export const createFeedRouter = (ctx: AppContext) => {
  const router = new Hono()

  router.get('/actorFeed/:actorDid', async (c) => {
    const { actorDid } = c.req.param()

    const accessJwt = c.req.header('Authorization')?.split(' ')[1] || ''

    const pdsUrl = accessJwt
      ? JSON.parse(atob(accessJwt.split('.')[1])).aud.replace('did:web:', '')
      : ''

    if (!pdsUrl) {
      throw new HTTPException(400, {
        message: 'Missing PDS URL in access token',
      })
    }

    const agent = new Agent(new URL(`https://${pdsUrl}`))

    const listRes = await agent.com.atproto.repo.listRecords(
      {
        collection: 'so.sprk.feed.post',
        repo: actorDid,
        limit: 30,
      },
      {
        headers: {
          Authorization: `Bearer ${accessJwt}`,
        },
      },
    )

    if (!listRes.success) {
      throw new HTTPException(400, {
        message: 'Failed to list records from PDS',
      })
    }
    const actorDidDoc = await ctx.resolver.resolveDidToDidDoc(actorDid)

    const actor = await agent.com.atproto.repo.getRecord({
      repo: actorDid,
      collection: 'app.bsky.actor.profile',
      rkey: 'self',
    })

    if (!actor.success) {
      throw new HTTPException(400, {
        message: 'Failed to get profile',
      })
    }

    // Prepare to collect all post URIs to fetch like counts in a single query
    const postUris = listRes.data.records.map((record) => record.uri)

    // Create a map to store like counts for each post
    const likeCounts = new Map()

    // Get like counts for all posts in a single query for efficiency
    if (postUris.length > 0) {
      try {
        // Aggregate counts for each subject (post URI)
        const likeAggregation = await ctx.db.models.Like.aggregate([
          { $match: { subject: { $in: postUris } } },
          { $group: { _id: '$subject', count: { $sum: 1 } } },
        ])

        // Populate the map with the results
        likeAggregation.forEach((result) => {
          likeCounts.set(result._id, result.count)
        })
      } catch (error) {
        console.error('Error fetching like counts:', error)
        // Continue with zero counts if there's an error
      }
    }

    const feed = {
      feed: listRes.data.records.map((record) => {
        // Get the like count for this post, defaulting to 0 if not found
        if ((record.value as any).embed?.$type !== 'so.sprk.embed.video') {
          return undefined
        }
        const likeCount = likeCounts.get(record.uri) || 0
        const blobCid: CID = (record.value as any).embed?.video?.ref

        return {
          post: {
            uri: record.uri,
            cid: record.cid,
            author: {
              did: actorDid,
              handle: actorDidDoc.handle,
              displayName: '',
              avatar: 'placeholder-avatar-url',
              viewer: {
                muted: false,
                blockedBy: false,
              },
              labels: [],
              createdAt: new Date().toISOString(),
            },
            record: record.value,
            embed: {
              $type: 'so.sprk.embed.video#view',
              cid: record.cid,
              playlist: `https://videocdn.sprk.so/${pdsUrl}/${actorDid}/${blobCid.toString()}`,
              thumbnail: `https://cdn.sprk.so/${actorDid}/${blobCid.toString()}/thumbnail`,
            },
            replyCount: 0,
            repostCount: 0,
            likeCount,
            quoteCount: 0,
            indexedAt: new Date().toISOString(),
            viewer: {
              threadMuted: false,
              embeddingDisabled: false,
            },
            labels: [],
          },
        }
      }),
    }

    return c.json(feed)
  })

  return router
}
