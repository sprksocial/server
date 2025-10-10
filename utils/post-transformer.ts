import { PostDocument } from "../data-plane/db/models.ts";
import type { Label } from "../lex/types/com/atproto/label/defs.ts";
import type * as SoSprkFeedDefs from "../lex/types/so/sprk/feed/defs.ts";
import type * as SoSprkFeedPost from "../lex/types/so/sprk/feed/post.ts";
import { AppContext } from "../main.ts";
import { transformAudiosToAudioViews } from "./audio-transformer.ts";
import { transformEmbed } from "./embed-transformer.ts";
import { createProfileViewBasic } from "./profile-helper.ts";

// Transform DB posts to PostView format
export async function transformPostsToPostViews(
  posts: PostDocument[],
  ctx: AppContext,
  userDid?: string,
): Promise<SoSprkFeedDefs.PostView[]> {
  if (posts.length === 0) {
    return [];
  }

  const postUris = posts.map((p) => p.uri);
  const authorDids = [...new Set(posts.map((p) => p.authorDid))];
  const soundUris = posts
    .map((p) => p.sound?.uri)
    .filter((u): u is string => typeof u === "string");

  const [
    likeCounts,
    replyCounts,
    repostCounts,
    authors,
    videoMappings,
    viewerLikes,
    viewerReposts,
  ] = await Promise.all([
    // Get like counts
    ctx.db.models.Like.aggregate([
      { $match: { subject: { $in: postUris } } },
      { $group: { _id: "$subject", count: { $sum: 1 } } },
    ]),
    // Get reply counts
    ctx.db.models.Post.aggregate([
      { $match: { "reply.parent.uri": { $in: postUris } } },
      { $group: { _id: "$reply.parent.uri", count: { $sum: 1 } } },
    ]),
    // Get repost counts
    ctx.db.models.Repost.aggregate([
      { $match: { "subject.uri": { $in: postUris } } },
      { $group: { _id: "$subject.uri", count: { $sum: 1 } } },
    ]),

    // Get authors
    Promise.all(
      authorDids.map((did) => {
        return createProfileViewBasic(
          did,
          ctx,
        );
      }),
    ),
    // Get video mappings
    ctx.db.models.VideoMapping.find({
      key: {
        $in: posts
          .filter((p) => p.embed?.$type === "so.sprk.embed.video")
          .map((p) => `${p.authorDid}-${p.embed?.video?.ref.$link}`),
      },
    }),
    // Get viewer likes
    userDid
      ? ctx.db.models.Like.find({
        subject: { $in: postUris },
        authorDid: userDid,
      })
        .lean()
      : Promise.resolve([]),
    // Get viewer reposts
    userDid
      ? ctx.db.models.Repost.find({
        "subject.uri": { $in: postUris },
        authorDid: userDid,
      }).lean()
      : Promise.resolve([]),
  ]);

  const likeCountsMap = new Map(
    likeCounts.map((item) => [item._id, item.count]),
  );
  const replyCountsMap = new Map(
    replyCounts.map((item) => [item._id, item.count]),
  );
  const repostCountsMap = new Map(
    repostCounts.map((item) => [item._id, item.count]),
  );

  const authorsMap = new Map(authors.map((author) => [author.did, author]));
  const videoMappingsMap = new Map(
    videoMappings.map((item) => [item.key, item]),
  );
  const viewerLikesMap = new Map(
    viewerLikes.map((like) => [like.subject, like.uri]),
  );
  const viewerRepostsMap = new Map(
    viewerReposts.map((repost: { subject: { uri: string }; uri: string }) => [
      repost.subject.uri,
      repost.uri,
    ]),
  );

  const audios = await ctx.db.models.Audio.find({ uri: { $in: soundUris } });
  const audioViews = await transformAudiosToAudioViews(audios, ctx);
  const audioViewsMap = new Map(audioViews.map((av) => [av.uri, av]));

  return posts.map((post) => {
    const videoMapping = post.embed?.$type === "so.sprk.embed.video"
      ? videoMappingsMap.get(
        `${post.authorDid}-${post.embed.video?.ref.$link}`,
      ) || null
      : null;

    const embed = transformEmbed(
      post.embed,
      post.authorDid,
      videoMapping,
    );

    const labels = post.labels
      ? Array.isArray(post.labels) ? (post.labels as Label[]) : undefined
      : undefined;

    const viewer: SoSprkFeedDefs.ViewerState = {};
    if (userDid) {
      viewer.like = viewerLikesMap.get(post.uri);
      viewer.repost = viewerRepostsMap.get(post.uri);
    }

    return {
      uri: post.uri,
      cid: post.cid,
      author: authorsMap.get(post.authorDid)!,
      record: {
        $type: "so.sprk.feed.post",
        text: post.text,
        embed: post.embed as SoSprkFeedPost.Record["embed"],
        facets: post.facets,
        langs: post.langs,
        tags: post.tags,
        createdAt: post.createdAt,
      } satisfies SoSprkFeedPost.Record,
      embed: embed,
      viewer,
      replyCount: replyCountsMap.get(post.uri) || 0,
      repostCount: repostCountsMap.get(post.uri) || 0,
      likeCount: likeCountsMap.get(post.uri) || 0,
      indexedAt: post.indexedAt,
      labels,
      sound: post.sound?.uri ? audioViewsMap.get(post.sound.uri) : undefined,
    };
  });
}

// Transform DB post to PostView format
export async function transformPostToPostView(
  post: PostDocument,
  ctx: AppContext,
  userDid?: string,
): Promise<SoSprkFeedDefs.PostView> {
  const postViews = await transformPostsToPostViews([post], ctx, userDid);
  return postViews[0];
}
