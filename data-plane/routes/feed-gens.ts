import { Database } from "../db/index.ts";
import { TimeCidKeyset } from "../db/pagination.ts";

export class FeedGenerators {
  private db: Database;
  private timeCidKeyset: TimeCidKeyset;

  constructor(db: Database) {
    this.db = db;
    this.timeCidKeyset = new TimeCidKeyset();
  }

  async getActorFeeds(actorDid: string, limit = 50, cursor?: string) {
    const feedsQuery = this.db.models.Generator.find({
      authorDid: actorDid,
    });

    const paginatedQuery = this.timeCidKeyset.paginate(feedsQuery, {
      limit,
      cursor,
      direction: "desc",
    });

    const feeds = await paginatedQuery.exec();

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
    const feedsQuery = this.db.models.Generator.find().sort({
      likeCount: -1,
      createdAt: -1,
    });

    const paginatedQuery = this.timeCidKeyset.paginate(feedsQuery, {
      limit,
      cursor,
      direction: "desc",
    });

    const feeds = await paginatedQuery.exec();

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

  async searchFeedGenerators(query: string, limit = 50, cursor?: string) {
    const trimmedQuery = query.trim();

    const feedsQuery = this.db.models.Generator.find(
      trimmedQuery
        ? { displayName: { $regex: trimmedQuery, $options: "i" } }
        : {},
    );

    const paginatedQuery = this.timeCidKeyset.paginate(feedsQuery, {
      limit,
      cursor,
      direction: "desc",
    });

    const feeds = await paginatedQuery.exec();

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
}
