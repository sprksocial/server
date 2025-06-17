import { Database, PostDocument } from "../services/data-plane/server/index.ts";
import type { Label } from "../lexicon/types/com/atproto/label/defs.ts";
import type * as SoSprkFeedDefs from "../lexicon/types/so/sprk/feed/defs.ts";
import type * as SoSprkFeedPost from "../lexicon/types/so/sprk/feed/post.ts";
import { transformEmbed } from "./embed-transformer.ts";
import { createProfileViewBasic } from "./profile-helper.ts";

// Transform DB post to PostView format
export async function transformPostToPostView(
  post: PostDocument,
  db: Database,
  userDid?: string,
): Promise<SoSprkFeedDefs.PostView> {
  // Get counts in parallel
  const [likeCount, replyCount, repostCount, lookCount, author] = await Promise
    .all([
      // Get like count
      db.models.Like.countDocuments({ subject: post.uri }),

      // Get reply count
      db.models.Post.countDocuments({
        "reply.parent.uri": post.uri,
      }),

      // Get repost count
      db.models.Repost.countDocuments({
        "subject.uri": post.uri,
      }),

      // Get look count
      db.models.Look.countDocuments({
        "subject.uri": post.uri,
      }),

      // Create the author object with stories
      createProfileViewBasic(post.authorDid, post.authorHandle, db),
    ]);

  const embed = transformEmbed(post.embed, post.authorDid, post.cid);

  // Convert labels if any
  const labels = post.labels
    ? Array.isArray(post.labels) ? (post.labels as Label[]) : undefined
    : undefined;

  // Build viewer state with information about the current user's interactions with the post
  const viewer: SoSprkFeedDefs.ViewerState = {};

  // Only check user interactions if a userDid is provided
  if (userDid) {
    // Check if the user has liked this post
    const like = await db.models.Like.findOne({
      subject: post.uri,
      authorDid: userDid,
    });
    if (like) {
      viewer.like = like.uri;
    }

    // Check if the user has reposted this post
    const repost = await db.models.Repost.findOne({
      "subject.uri": post.uri,
      authorDid: userDid,
    });
    if (repost) {
      viewer.repost = repost.uri;
    }

    // Check if the user has looked at this post
    const look = await db.models.Look.findOne({
      "subject.uri": post.uri,
      authorDid: userDid,
    });
    if (look) {
      viewer.look = look.uri;
    }
  }

  return {
    uri: post.uri,
    cid: post.cid,
    author,
    record: {
      $type: "so.sprk.feed.post",
      text: post.text,
      embed: post.embed as SoSprkFeedPost.MainRecord["embed"],
      facets: post.facets,
      langs: post.langs,
      tags: post.tags,
      createdAt: post.createdAt,
    } satisfies SoSprkFeedPost.MainRecord,
    embed: embed,
    viewer,
    replyCount,
    repostCount,
    likeCount,
    lookCount,
    indexedAt: post.indexedAt,
    labels,
  };
}
