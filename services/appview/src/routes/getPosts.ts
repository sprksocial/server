import { Hono } from 'hono'

import { OutputSchema as GetPostsView } from '../lexicon/types/so/sprk/feed/getPosts.js'
import type * as SoSprkFeedDefs from '../lexicon/types/so/sprk/feed/defs.js'
import type { ProfileViewBasic } from '../lexicon/types/so/sprk/actor/defs.js'
import type { Label } from '../lexicon/types/com/atproto/label/defs.js'
import type * as SoSprkEmbedImages from '../lexicon/types/so/sprk/embed/images.js'
import type * as SoSprkEmbedVideo from '../lexicon/types/so/sprk/embed/video.js'
import { Database, PostDocument } from '../db.js'

// Transform DB post to PostView format
async function transformPostToPostView(
  post: PostDocument,
  db: Database,
): Promise<SoSprkFeedDefs.PostView> {
  // Get like count
  const likeCount = await db.models.Like.countDocuments({ subject: post.uri })

  // Get reply count
  const replyCount = await db.models.Post.countDocuments({
    'reply.parent.uri': post.uri,
  })

  // Get repost count
  const repostCount = await db.models.Repost.countDocuments({
    'subject.uri': post.uri,
  })

  // Get quote count - posts that embed this post
  // const quoteCount = await db.models.Post.countDocuments({
  //   'embed.uri': post.uri
  // })

  const lookCount = await db.models.Look.countDocuments({
    'subject.uri': post.uri,
  })

  // Get author profile data
  const profile = await db.models.Profile.findOne({
    authorDid: post.authorDid,
  }).lean()

  // Create the author object
  const author: ProfileViewBasic = {
    did: post.authorDid,
    handle: post.authorHandle,
    displayName: profile?.displayName ?? post.authorHandle,
    avatar: `https://cdn.sprk.so/avatar/${post.authorDid}`,
  }

  let embed

  if (post.embed?.$type === 'so.sprk.embed.images') {
    embed = {
      $type: 'so.sprk.embed.images#view',
      images: post.embed.images.map((img: any) => ({
        thumb: `https://cdn.sprk.so/image/${post.authorDid}/${img.image.ref.$link}`,
        fullsize: `https://cdn.sprk.so/image/${post.authorDid}/${img.image.ref.$link}`,
        alt: img.alt,
        aspectRatio: img.aspectRatio,
      })),
    } satisfies SoSprkEmbedImages.View
  } else if (post.embed?.$type === 'so.sprk.embed.video') {
    embed = {
      $type: 'so.sprk.embed.video#view',
      cid: post.embed.cid,
      playlist: post.embed.playlist,
      thumbnail: post.embed.thumbnail,
    } satisfies SoSprkEmbedVideo.View
  }

  // Convert labels if any
  const labels = post.labels
    ? Array.isArray(post.labels)
      ? (post.labels as Label[])
      : undefined
    : undefined

  return {
    uri: post.uri,
    cid: post.cid,
    author,
    record: {
      text: post.text,
      facets: post.facets,
      langs: post.langs,
      tags: post.tags,
    },
    embed: embed,
    replyCount,
    repostCount,
    likeCount,
    lookCount,
    indexedAt: post.indexedAt,
    labels,
  }
}

// Function to fetch posts by URIs
async function getPosts(
  uris: string | string[],
  db: Database,
): Promise<SoSprkFeedDefs.PostView[]> {
  if (!uris) {
    return []
  }

  const uriArray = Array.isArray(uris) ? uris : [uris]

  if (uriArray.length === 0) {
    return []
  }

  const dbPosts = await db.models.Post.find({ uri: { $in: uriArray } }).lean()

  // Transform each post to PostView format
  const postViews = await Promise.all(
    dbPosts.map((post) => transformPostToPostView(post, db)),
  )

  return postViews
}

export const createGetPostsRouter = (db: Database) => {
  const router = new Hono()

  router.get('/xrpc/so.sprk.feed.getPosts', async (c) => {
    const uris = c.req.queries('uris')

    if (!uris || uris.length === 0) {
      return c.json({ posts: [] } as GetPostsView)
    }

    const posts = await getPosts(uris, db)

    return c.json({ posts } as GetPostsView)
  })
  return router
}
