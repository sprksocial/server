import { Database, EmbedImage, PostDocument } from "../services/data-plane/server/index.ts"
import type { Label } from "../lexicon/types/com/atproto/label/defs.ts"
import type { ProfileViewBasic } from "../lexicon/types/so/sprk/actor/defs.ts"
import type * as SoSprkEmbedImages from "../lexicon/types/so/sprk/embed/images.ts"
import type * as SoSprkEmbedVideo from "../lexicon/types/so/sprk/embed/video.ts"
import type * as SoSprkFeedDefs from "../lexicon/types/so/sprk/feed/defs.ts"

// Transform DB post to PostView format
export async function transformPostToPostView(
  post: PostDocument,
  db: Database,
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
    avatar: `https://media.sprk.so/avatar/tiny/${profile?.authorDid}/${profile?.avatar?.ref?.$link}/webp`,
  }

  let embed

  if (post.embed?.$type === 'so.sprk.embed.images' && post.embed.images) {
    embed = {
      $type: 'so.sprk.embed.images#view',
      images: post.embed.images.map((img: EmbedImage) => ({
        thumb: `https://media.sprk.so/img/medium/${post.authorDid}/${img.image.ref.$link}/webp`,
        fullsize: `https://media.sprk.so/img/full/${post.authorDid}/${img.image.ref.$link}/webp`,
        alt: img.alt,
        aspectRatio: img.aspectRatio,
      })),
    } satisfies SoSprkEmbedImages.View
  } else if (post.embed?.$type === 'so.sprk.embed.video' && post.embed.video) {
    embed = {
      $type: 'so.sprk.embed.video#view',
      cid: post.cid,
      alt: post.embed.alt,
      playlist: `https://media.sprk.so/video/${post.authorDid}/${post.embed.video.ref.$link}`,
      thumbnail: `https://thumb.sprk.so/${post.authorDid}/${post.embed.video.ref.$link}/thumbnail`,
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
