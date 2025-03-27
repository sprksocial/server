import type * as SoSprkFeedDefs from '../lexicon/types/so/sprk/feed/defs.js'
import type { ProfileViewBasic } from '../lexicon/types/so/sprk/actor/defs.js'
import type { Label } from '../lexicon/types/com/atproto/label/defs.js'
import type * as SoSprkEmbedImages from '../lexicon/types/so/sprk/embed/images.js'
import type * as SoSprkEmbedVideo from '../lexicon/types/so/sprk/embed/video.js'
import { Database, PostDocument } from '../db.js'
import { BidirectionalResolver } from '../id-resolver.js'

// Transform DB post to PostView format
export async function transformPostToPostView(
  post: PostDocument,
  db: Database,
  resolver: BidirectionalResolver,
  userDid?: string,
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
        thumb: `https://cdn.bsky.app/img/feed_thumbnail/plain/${post.authorDid}/${img.image.ref.$link}@jpeg`,
        fullsize: `https://cdn.bsky.app/img/feed_fullsize/plain/${post.authorDid}/${img.image.ref.$link}@jpeg`,
        alt: img.alt,
        aspectRatio: img.aspectRatio,
      })),
    } satisfies SoSprkEmbedImages.View
  } else if (post.embed?.$type === 'so.sprk.embed.video') {
    const did = await resolver.resolveDidToDidDoc(post.authorDid)
    const pdsDomain = did.pds.replace('https://', '')
    embed = {
      $type: 'so.sprk.embed.video#view',
      cid: post.cid,
      playlist: `https://videocdn.sprk.so/${pdsDomain}/${post.authorDid}/${post.embed.video.ref.$link}`,
      thumbnail: `https://cdn.sprk.so/${post.authorDid}/${post.embed.video.ref.$link}/thumbnail`,
    } satisfies SoSprkEmbedVideo.View
  }

  // Convert labels if any
  const labels = post.labels
    ? Array.isArray(post.labels)
      ? (post.labels as Label[])
      : undefined
    : undefined

  // Build viewer state with information about the current user's interactions with the post
  const viewer: SoSprkFeedDefs.ViewerState = {}

  // Only check user interactions if a userDid is provided
  if (userDid) {
    // Check if the user has liked this post
    const like = await db.models.Like.findOne({
      subject: post.uri,
      authorDid: userDid,
    })
    if (like) {
      viewer.like = like.uri
    }

    // Check if the user has reposted this post
    const repost = await db.models.Repost.findOne({
      'subject.uri': post.uri,
      authorDid: userDid,
    })
    if (repost) {
      viewer.repost = repost.uri
    }

    // Check if the user has looked at this post
    const look = await db.models.Look.findOne({
      'subject.uri': post.uri,
      authorDid: userDid,
    })
    if (look) {
      viewer.look = look.uri
    }
  }

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
    viewer,
    replyCount,
    repostCount,
    likeCount,
    lookCount,
    indexedAt: post.indexedAt,
    labels,
  }
}