import { Database } from "../db/index.ts";
import { TimeCidKeyset } from "../db/pagination.ts";

// Helper function to format feed items
function feedItemFromRow(
  item: { uri: string; cid: string },
): { uri: string; cid: string } {
  return {
    uri: item.uri,
    cid: item.cid,
  };
}

interface FeedItem {
  uri: string;
  cid: string;
  authorDid: string;
  createdAt: string;
  indexedAt: string;
}

export class Feeds {
  private db: Database;
  private timeCidKeyset: TimeCidKeyset;

  constructor(db: Database) {
    this.db = db;
    this.timeCidKeyset = new TimeCidKeyset();
  }

  async getFeedGenerators(uris: string[]) {
    if (!uris.length) return { generators: [] };

    const generators = await this.db.models.Generator.find({
      uri: { $in: uris },
    }).populate("actor");

    return {
      generators: generators.map((generator) => ({
        uri: generator.uri,
        cid: generator.cid,
        authorDid: generator.authorDid,
        displayName: generator.displayName,
        description: generator.description,
        descriptionFacets: generator.descriptionFacets,
        avatar: generator.avatar,
        acceptsInteractions: generator.acceptsInteractions,
        likeCount: generator.likeCount || 0,
        createdAt: generator.createdAt,
        indexedAt: generator.indexedAt,
        actor: generator.actor,
      })),
    };
  }

  async getAuthorFeed(
    actorDid: string,
    limit = 50,
    cursor?: string,
  ) {
    // Get posts by this author - Post collection doesn't have replies (they're in Reply collection)
    const postsQuery = this.db.models.Post.find({
      authorDid: actorDid,
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
      indexedAt: p.indexedAt,
    }));

    return {
      items: transformedPosts.map(feedItemFromRow),
      cursor: this.timeCidKeyset.packFromResult(transformedPosts),
    };
  }

  async getTimeline(actorDid: string, limit = 50, cursor?: string) {
    // Get people this actor follows
    const follows = await this.db.models.Follow.find({ authorDid: actorDid });

    const followedDids = follows.map((f) => f.subject);
    const timelineDids = [...followedDids, actorDid];

    // Get timeline posts
    const postsQuery = this.db.models.Post.find({
      authorDid: { $in: timelineDids },
    });

    // Apply pagination using createdAt + cid (which matches DB schema and indexes)
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
      indexedAt: p.indexedAt,
    }));

    return {
      items: transformedPosts.map(feedItemFromRow),
      cursor: this.timeCidKeyset.packFromResult(transformedPosts),
    };
  }
}
