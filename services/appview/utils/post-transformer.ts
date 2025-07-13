import { PostDocument } from "../data-plane/server/models.ts";
import type { Label } from "../lexicon/types/com/atproto/label/defs.ts";
import type * as SoSprkFeedDefs from "../lexicon/types/so/sprk/feed/defs.ts";
import type * as SoSprkFeedPost from "../lexicon/types/so/sprk/feed/post.ts";
import { AppContext } from "../main.ts";
import { transformEmbed } from "./embed-transformer.ts";
import { createProfileViewBasic } from "./profile-helper.ts";

// Transform DB post to PostView format
export async function transformPostToPostView(
  post: PostDocument,
  ctx: AppContext,
  userDid?: string,
): Promise<SoSprkFeedDefs.PostView> {
  // Get counts in parallel
  const authorActor = await ctx.db.models.Actor.findOne({
    did: post.authorDid,
  });

  if (!authorActor) {
    throw new Error(`Author actor not found for DID: ${post.authorDid}`);
  }

  const [likeCount, replyCount, repostCount, lookCount, author] = await Promise
    .all([
      // Get like count
      ctx.db.models.Like.countDocuments({ subject: post.uri }).catch(() => 0),

      // Get reply count
      ctx.db.models.Post.countDocuments({
        "reply.parent.uri": post.uri,
      }).catch(() => 0),

      // Get repost count
      ctx.db.models.Repost.countDocuments({
        "subject.uri": post.uri,
      }).catch(() => 0),

      // Get look count
      ctx.db.models.Look.countDocuments({
        "subject.uri": post.uri,
      }).catch(() => 0),

      // Create the author object with stories
      createProfileViewBasic(
        post.authorDid,
        ctx,
      ).catch(() => {
        return {
          did: post.authorDid,
          handle: "unknown",
          displayName: "Unknown User",
        };
      }),
    ]);

  const embed = post.embed
    ? transformEmbed(post.embed, post.authorDid, post.cid)
    : undefined;

  // Convert labels if any
  const labels = post.labels
    ? Array.isArray(post.labels) ? (post.labels as Label[]) : undefined
    : undefined;

  // Build viewer state with information about the current user's interactions with the post
  const viewer: SoSprkFeedDefs.ViewerState = {};

  // Only check user interactions if a userDid is provided
  if (userDid) {
    try {
      // Check if the user has liked this post
      const like = await ctx.db.models.Like.findOne({
        subject: post.uri,
        authorDid: userDid,
      });
      if (like) {
        viewer.like = like.uri;
      }

      // Check if the user has reposted this post
      const repost = await ctx.db.models.Repost.findOne({
        "subject.uri": post.uri,
        authorDid: userDid,
      });
      if (repost) {
        viewer.repost = repost.uri;
      }

      // Check if the user has looked at this post
      const look = await ctx.db.models.Look.findOne({
        "subject.uri": post.uri,
        authorDid: userDid,
      });
      if (look) {
        viewer.look = look.uri;
      }
    } catch (error) {
      console.error("Error checking user interactions", error);
    }
  }

  const result = {
    uri: post.uri,
    cid: post.cid,
    author,
    record: {
      $type: "so.sprk.feed.post",
      text: post.text || "",
      embed: post.embed as SoSprkFeedPost.MainRecord["embed"],
      facets: post.facets || [],
      langs: post.langs || [],
      tags: post.tags || [],
      createdAt: post.createdAt,
    } satisfies SoSprkFeedPost.MainRecord,
    embed: embed,
    viewer: viewer && Object.keys(viewer).length > 0 ? viewer : undefined,
    replyCount: replyCount || 0,
    repostCount: repostCount || 0,
    likeCount: likeCount || 0,
    lookCount: lookCount || 0,
    indexedAt: post.indexedAt,
    labels,
  };

  return result;
}
