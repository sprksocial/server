import { Database } from "../db/index.ts";

// Types for MongoDB aggregation results
interface AggregationResult {
  _id: string;
  count: number;
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
}
