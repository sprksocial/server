import { Database } from "../db/index.ts";

// Types for MongoDB aggregation results
interface AggregationResult {
  _id: string;
  count: number;
}

export interface KnownInteraction {
  type: "like" | "repost" | "reply";
  uri: string;
  cid: string;
  authorDid: string;
  indexedAt: string;
  text?: string;
}

export class Interactions {
  private db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  async getInteractionCounts(refs: Array<{ uri: string }>) {
    const uris = refs.map((ref) => ref.uri);
    if (uris.length === 0) {
      return { likes: [], replies: [], reposts: [], quotes: [] };
    }

    // Get pre-computed counts from Post, Reply, and Generator documents
    const [posts, replies, generators] = await Promise.all([
      this.db.models.Post.find(
        { uri: { $in: uris } },
        { uri: 1, likeCount: 1, replyCount: 1, repostCount: 1 },
      ),
      this.db.models.Reply.find(
        { uri: { $in: uris } },
        { uri: 1, likeCount: 1, replyCount: 1 },
      ),
      this.db.models.Generator.find(
        { uri: { $in: uris } },
        { uri: 1, likeCount: 1 },
      ),
    ]);

    // Create lookup maps from pre-computed counts
    const likesMap = new Map<string, number>();
    const repliesMap = new Map<string, number>();
    const repostsMap = new Map<string, number>();

    for (const post of posts) {
      likesMap.set(post.uri, post.likeCount ?? 0);
      repliesMap.set(post.uri, post.replyCount ?? 0);
      repostsMap.set(post.uri, post.repostCount ?? 0);
    }

    for (const reply of replies) {
      likesMap.set(reply.uri, reply.likeCount ?? 0);
      repliesMap.set(reply.uri, reply.replyCount ?? 0);
    }

    for (const generator of generators) {
      likesMap.set(generator.uri, generator.likeCount ?? 0);
    }

    return {
      likes: uris.map((uri) => likesMap.get(uri) ?? 0),
      replies: uris.map((uri) => repliesMap.get(uri) ?? 0),
      reposts: uris.map((uri) => repostsMap.get(uri) ?? 0),
    };
  }

  async getCountsForUsers(dids: string[]) {
    if (dids.length === 0) {
      return {
        followers: [],
        following: [],
        posts: [],
        feeds: [],
      };
    }

    const [followers, following, posts, feeds] = await Promise.all([
      // Count followers for each DID
      this.db.models.Follow.aggregate([
        { $match: { subject: { $in: dids } } },
        { $group: { _id: "$subject", count: { $sum: 1 } } },
      ]),
      // Count following for each DID
      this.db.models.Follow.aggregate([
        { $match: { authorDid: { $in: dids } } },
        { $group: { _id: "$authorDid", count: { $sum: 1 } } },
      ]),
      // Count posts for each DID
      this.db.models.Post.aggregate([
        { $match: { authorDid: { $in: dids } } },
        { $group: { _id: "$authorDid", count: { $sum: 1 } } },
      ]),
      // Count generators for each DID
      this.db.models.Generator.aggregate([
        { $match: { authorDid: { $in: dids } } },
        { $group: { _id: "$authorDid", count: { $sum: 1 } } },
      ]),
    ]);

    // Create lookup maps
    const followersMap = new Map(
      followers.map((item: AggregationResult) => [item._id, item.count]),
    );
    const followingMap = new Map(
      following.map((item: AggregationResult) => [item._id, item.count]),
    );
    const postsMap = new Map(
      posts.map((item: AggregationResult) => [item._id, item.count]),
    );
    const feedsMap = new Map(
      feeds.map((item: AggregationResult) => [item._id, item.count]),
    );

    return {
      followers: dids.map((did) => followersMap.get(did) ?? 0),
      following: dids.map((did) => followingMap.get(did) ?? 0),
      posts: dids.map((did) => postsMap.get(did) ?? 0),
      feeds: dids.map((did) => feedsMap.get(did) ?? 0),
    };
  }

  async getSoundUsageCounts(uris: string[]) {
    if (uris.length === 0) {
      return { uses: [] };
    }

    // Count how many posts reference each sound URI
    const usageAgg = await this.db.models.Post.aggregate([
      { $match: { "sound.uri": { $in: uris } } },
      { $group: { _id: "$sound.uri", count: { $sum: 1 } } },
    ]);

    const usageMap = new Map(
      usageAgg.map((item: AggregationResult) => [item._id, item.count]),
    );

    return {
      uses: uris.map((uri) => usageMap.get(uri) ?? 0),
    };
  }

  /**
   * Get interactions (likes, reposts, replies) on subject URIs by users the viewer follows.
   * Returns interactions sorted by indexedAt descending (most recent first).
   */
  async getKnownInteractions(
    viewerDid: string,
    subjectUris: string[],
  ): Promise<{ results: Map<string, KnownInteraction[]> }> {
    if (subjectUris.length === 0) {
      return { results: new Map() };
    }

    // Get all DIDs the viewer follows
    const viewerFollows = await this.db.models.Follow.find({
      authorDid: viewerDid,
    });
    const followedDids = viewerFollows.map((f) => f.subject);

    if (followedDids.length === 0) {
      return { results: new Map() };
    }

    // Query likes, reposts, and replies by followed users on the subject URIs
    const [likes, reposts, replies] = await Promise.all([
      this.db.models.Like.find({
        subject: { $in: subjectUris },
        authorDid: { $in: followedDids },
      }).sort({ indexedAt: -1 }),
      this.db.models.Repost.find({
        subject: { $in: subjectUris },
        authorDid: { $in: followedDids },
      }).sort({ indexedAt: -1 }),
      this.db.models.Reply.find({
        "reply.parent.uri": { $in: subjectUris },
        authorDid: { $in: followedDids },
      }).sort({ indexedAt: -1 }),
    ]);

    // Build result map keyed by subject URI
    const results = new Map<string, KnownInteraction[]>();

    // Initialize empty arrays for each subject URI
    for (const uri of subjectUris) {
      results.set(uri, []);
    }

    // Add likes
    for (const like of likes) {
      const interactions = results.get(like.subject);
      if (interactions) {
        interactions.push({
          type: "like",
          uri: like.uri,
          cid: like.cid,
          authorDid: like.authorDid,
          indexedAt: String(like.indexedAt),
        });
      }
    }

    // Add reposts
    for (const repost of reposts) {
      const interactions = results.get(repost.subject);
      if (interactions) {
        interactions.push({
          type: "repost",
          uri: repost.uri,
          cid: repost.cid,
          authorDid: repost.authorDid,
          indexedAt: String(repost.indexedAt),
        });
      }
    }

    // Add replies
    for (const reply of replies) {
      const parentUri = reply.reply?.parent.uri;
      if (!parentUri) continue;
      const interactions = results.get(parentUri);
      if (interactions) {
        interactions.push({
          type: "reply",
          uri: reply.uri,
          cid: reply.cid,
          authorDid: reply.authorDid,
          indexedAt: String(reply.indexedAt),
          text: reply.text,
        });
      }
    }

    // Dedupe: keep one interaction per actor with priority: repost > reply > like
    // Sort order: repost → like → reply
    const keepPriority: Record<KnownInteraction["type"], number> = {
      repost: 0,
      reply: 1,
      like: 2,
    };

    for (const [uri, interactions] of results) {
      // Group by author, keep highest priority interaction per author
      const byAuthor = new Map<string, KnownInteraction>();
      for (const interaction of interactions) {
        const existing = byAuthor.get(interaction.authorDid);
        if (
          !existing ||
          keepPriority[interaction.type] < keepPriority[existing.type]
        ) {
          byAuthor.set(interaction.authorDid, interaction);
        }
      }

      // Bucket into 3 arrays by type (avoids sorting)
      const repostBucket: KnownInteraction[] = [];
      const likeBucket: KnownInteraction[] = [];
      const replyBucket: KnownInteraction[] = [];

      for (const interaction of byAuthor.values()) {
        if (interaction.type === "repost") repostBucket.push(interaction);
        else if (interaction.type === "like") likeBucket.push(interaction);
        else replyBucket.push(interaction);
      }

      // Concatenate in desired order: repost → like → reply
      results.set(uri, [...repostBucket, ...likeBucket, ...replyBucket]);
    }

    return { results };
  }
}
