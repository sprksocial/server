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

    // Get interaction counts for posts
    const [likes, reposts] = await Promise.all([
      // Count likes for each URI
      this.db.models.Like.aggregate([
        { $match: { "subject.uri": { $in: uris } } },
        { $group: { _id: "$subject.uri", count: { $sum: 1 } } },
      ]),
      // Count reposts for each URI
      this.db.models.Repost.aggregate([
        { $match: { "subject.uri": { $in: uris } } },
        { $group: { _id: "$subject.uri", count: { $sum: 1 } } },
      ]),
    ]);

    // Count replies by finding posts that have a reply.parent.uri matching our URIs
    const replies = await this.db.models.Post.aggregate([
      { $match: { "reply.parent.uri": { $in: uris } } },
      { $group: { _id: "$reply.parent.uri", count: { $sum: 1 } } },
    ]);

    // Count quotes by finding posts that have an embed.record.uri matching our URIs
    const quotes = await this.db.models.Post.aggregate([
      { $match: { "embed.record.uri": { $in: uris } } },
      { $group: { _id: "$embed.record.uri", count: { $sum: 1 } } },
    ]);

    // Create lookup maps
    const likesMap = new Map(
      likes.map((item: AggregationResult) => [item._id, item.count]),
    );
    const repliesMap = new Map(
      replies.map((item: AggregationResult) => [item._id, item.count]),
    );
    const repostsMap = new Map(
      reposts.map((item: AggregationResult) => [item._id, item.count]),
    );
    const quotesMap = new Map(
      quotes.map((item: AggregationResult) => [item._id, item.count]),
    );

    return {
      likes: uris.map((uri) => likesMap.get(uri) ?? 0),
      replies: uris.map((uri) => repliesMap.get(uri) ?? 0),
      reposts: uris.map((uri) => repostsMap.get(uri) ?? 0),
      quotes: uris.map((uri) => quotesMap.get(uri) ?? 0),
    };
  }

  async getCountsForUsers(dids: string[]) {
    if (dids.length === 0) {
      return {
        followers: [],
        following: [],
        posts: [],
        lists: [],
        feeds: [],
        starterPacks: [],
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
      this.db.models.BskyGenerator.aggregate([
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
      lists: dids.map(() => 0), // Lists not implemented in current models
      feeds: dids.map((did) => feedsMap.get(did) ?? 0),
      starterPacks: dids.map(() => 0), // Starter packs not implemented in current models
    };
  }

  getStarterPackCounts(refs: Array<{ uri: string }>) {
    const uris = refs.map((ref) => ref.uri);
    if (uris.length === 0) {
      return { joinedAllTime: [], joinedWeek: [] };
    }

    // Since we don't have starter pack functionality in current models,
    // return zeros for all requested URIs
    const zeros = uris.map(() => 0);

    return {
      joinedWeek: zeros,
      joinedAllTime: zeros,
    };
  }

  getListCounts(refs: Array<{ uri: string }>) {
    const uris = refs.map((ref) => ref.uri);
    if (uris.length === 0) {
      return { listItems: [] };
    }

    // Since we don't have list functionality in current models,
    // return zeros for all requested URIs
    const zeros = uris.map(() => 0);

    return {
      listItems: zeros,
    };
  }
}
