import { Database } from "../db/index.ts";
import { LikeCountCidKeyset, TimeCidKeyset } from "../db/pagination.ts";

export class FeedGens {
  private db: Database;
  private timeCidKeyset: TimeCidKeyset;
  private likeCountCidKeyset: LikeCountCidKeyset;

  constructor(db: Database) {
    this.db = db;
    this.timeCidKeyset = new TimeCidKeyset();
    this.likeCountCidKeyset = new LikeCountCidKeyset();
  }

  async getActorFeeds(actorDid: string, limit = 50, cursor?: string) {
    // Build query for feeds created by this actor
    const feedsQuery = this.db.models.Generator.find({
      authorDid: actorDid,
    });

    // Apply pagination using TimeCidKeyset
    const paginatedQuery = this.timeCidKeyset.paginate(feedsQuery, {
      limit,
      cursor,
      direction: "desc",
    });

    const feeds = await paginatedQuery.exec();

    // Generate cursor from the last item if we have a full page
    let nextCursor: string | undefined;
    if (feeds.length === limit && feeds.length > 0) {
      const lastFeed = feeds[feeds.length - 1];
      nextCursor = this.timeCidKeyset.pack({
        primary: lastFeed.createdAt,
        secondary: lastFeed.cid,
      });
    }

    return {
      uris: feeds.map((f) => f.uri),
      cursor: nextCursor,
    };
  }

  async getSuggestedFeeds(limit = 50, cursor?: string) {
    // Get feeds sorted by like count (most liked feeds first)
    const feedsQuery = this.db.models.Generator.find();

    // Apply pagination using LikeCountCidKeyset
    const paginatedQuery = this.likeCountCidKeyset.paginate(feedsQuery, {
      limit,
      cursor,
      direction: "desc",
    });

    const feeds = await paginatedQuery.exec();

    // Generate cursor from the last item if we have a full page
    let nextCursor: string | undefined;
    if (feeds.length === limit && feeds.length > 0) {
      const lastFeed = feeds[feeds.length - 1];
      nextCursor = this.likeCountCidKeyset.pack({
        primary: lastFeed.likeCount.toString(),
        secondary: lastFeed.cid,
      });
    }

    return {
      uris: feeds.map((f) => f.uri),
      cursor: nextCursor,
    };
  }

  async searchFeedGenerators(query: string, limit = 50, cursor?: string) {
    const trimmedQuery = query.trim();

    // Build query for feed generators matching the search query
    const feedsQuery = this.db.models.Generator.find(
      trimmedQuery
        ? { displayName: { $regex: trimmedQuery, $options: "i" } }
        : {},
    );

    // Apply pagination using TimeCidKeyset
    const paginatedQuery = this.timeCidKeyset.paginate(feedsQuery, {
      limit,
      cursor,
      direction: "desc",
    });

    const feeds = await paginatedQuery.exec();

    // Generate cursor from the last item if we have a full page
    let nextCursor: string | undefined;
    if (feeds.length === limit && feeds.length > 0) {
      const lastFeed = feeds[feeds.length - 1];
      nextCursor = this.timeCidKeyset.pack({
        primary: lastFeed.createdAt,
        secondary: lastFeed.cid,
      });
    }

    return {
      uris: feeds.map((f) => f.uri),
      cursor: nextCursor,
    };
  }

  getFeedGeneratorStatus() {
    throw new Error("unimplemented");
  }
}
