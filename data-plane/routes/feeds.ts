import { Database } from "../db/index.ts";
import { TimeCidKeyset } from "../db/pagination.ts";
import { compositeTime } from "./records.ts";

// Helper function to format feed items
function feedItemFromRow(
  item: { uri: string; cid: string; repostUri?: string },
): { uri: string; cid: string; repost?: string; repostCid?: string } {
  return {
    uri: item.uri,
    cid: item.cid,
    repost: item.repostUri && item.repostUri !== item.uri
      ? item.repostUri
      : undefined,
    repostCid: item.repostUri && item.repostUri !== item.uri
      ? item.cid
      : undefined,
  };
}

interface FeedItem {
  uri: string;
  cid: string;
  authorDid: string;
  createdAt: string;
  type: "post" | "repost";
  repostUri?: string;
  sortedAt?: string;
}

export class Feeds {
  private db: Database;
  private timeCidKeyset: TimeCidKeyset;

  constructor(db: Database) {
    this.db = db;
    this.timeCidKeyset = new TimeCidKeyset();
  }

  async getAuthorFeed(
    actorDid: string,
    limit = 50,
    cursor?: string,
  ) {
    // Get posts by this author (exclude replies)
    const postsQuery = this.db.models.Post.find({
      authorDid: actorDid,
      reply: null,
    });

    // Apply pagination to posts query
    const paginatedPostsQuery = this.timeCidKeyset.paginate(postsQuery, {
      limit,
      cursor,
      direction: "desc",
    });

    const posts = await paginatedPostsQuery.exec();

    // Transform posts
    const transformedPosts: FeedItem[] = posts.map((p) => ({
      uri: p.uri,
      cid: p.cid,
      authorDid: p.authorDid,
      createdAt: p.createdAt,
      type: "post" as const,
      sortedAt: compositeTime(p.createdAt, p.cid),
    }));

    return {
      items: transformedPosts.map(feedItemFromRow),
      cursor: this.timeCidKeyset.packFromResult(transformedPosts),
    };
  }

  async getTimeline(actorDid: string, limit = 50, cursor?: string) {
    // Get people this actor follows
    const follows = await this.db.models.Follow.find({ authorDid: actorDid })
      .select("subject");

    const followedDids = follows.map((f) => f.subject);
    const timelineDids = [...followedDids, actorDid];

    const postsLimit = Math.floor(limit * 0.8);
    const repostsLimit = limit - postsLimit;

    // Get timeline posts (exclude replies)
    const postsQuery = this.db.models.Post.find({
      authorDid: { $in: timelineDids },
      reply: null,
    })
      .select("uri cid authorDid createdAt");

    // Apply pagination to posts query
    const paginatedPostsQuery = this.timeCidKeyset.paginate(postsQuery, {
      limit: postsLimit,
      cursor,
      direction: "desc",
    });

    const posts = await paginatedPostsQuery.exec();

    // Get timeline reposts
    const repostsQuery = this.db.models.Repost.find({
      authorDid: { $in: timelineDids },
    })
      .select("uri subject authorDid createdAt cid");

    // Apply pagination to reposts query
    const paginatedRepostsQuery = this.timeCidKeyset.paginate(repostsQuery, {
      limit: repostsLimit,
      cursor,
      direction: "desc",
    });

    const reposts = await paginatedRepostsQuery.exec();

    // Transform and combine results
    const transformedPosts: FeedItem[] = posts.map((p) => ({
      uri: p.uri,
      cid: p.cid,
      authorDid: p.authorDid,
      createdAt: p.createdAt,
      type: "post" as const,
      sortAt: p.createdAt,
    }));

    const transformedReposts: FeedItem[] = reposts.map((r) => ({
      uri: r.subject?.uri || r.uri,
      cid: r.cid,
      authorDid: r.authorDid,
      createdAt: r.createdAt,
      type: "repost" as const,
      repostUri: r.uri,
      sortAt: r.createdAt,
    }));

    // Combine and sort all items
    const allItems = [...transformedPosts, ...transformedReposts]
      .sort((a, b) => {
        // Sort by createdAt descending, then by cid descending
        if (a.createdAt !== b.createdAt) {
          return a.createdAt > b.createdAt ? -1 : 1;
        }
        return a.cid > b.cid ? -1 : 1;
      })
      .slice(0, limit);

    // Generate cursor from the last item if we have a full page
    let nextCursor: string | undefined;
    if (allItems.length === limit && allItems.length > 0) {
      const lastItem = allItems[allItems.length - 1];
      nextCursor = this.timeCidKeyset.pack({
        primary: lastItem.createdAt,
        secondary: lastItem.cid,
      });
    }

    return {
      items: allItems.map(feedItemFromRow),
      cursor: nextCursor,
    };
  }
}
