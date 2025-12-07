import { Database } from "../db/index.ts";
import { IndexedAtDidKeyset, TimeCidKeyset } from "../db/pagination.ts";
import { parsePostSearchQuery } from "../util.ts";
import { compositeTime } from "../util.ts";

// Remove leading @ in case a handle is input that way
const cleanQuery = (query: string) => query.trim().replace(/^@/g, "");

export class Search {
  private db: Database;
  private indexedAtDidKeyset: IndexedAtDidKeyset;
  private timeCidKeyset: TimeCidKeyset;

  constructor(db: Database) {
    this.db = db;
    this.indexedAtDidKeyset = new IndexedAtDidKeyset();
    this.timeCidKeyset = new TimeCidKeyset();
  }

  async actors(term: string, limit = 50, cursor?: string) {
    const cleanedTerm = cleanQuery(term);
    const regex = new RegExp(cleanedTerm, "i");

    // First, find Actor DIDs that match the handle
    const matchingActors = await this.db.models.Actor.find({
      handle: { $regex: regex },
    }).select("did").lean();
    const actorDids = matchingActors.map((actor) => actor.did);

    // Build a single Profile query that searches displayName or handle (via authorDid)
    const queryConditions: Array<Record<string, unknown>> = [
      { displayName: { $regex: regex } },
    ];

    if (actorDids.length > 0) {
      queryConditions.push({ authorDid: { $in: actorDids } });
    }

    const profilesQuery = this.db.models.Profile.find({
      $or: queryConditions,
    }).populate("actor");

    const paginatedQuery = this.indexedAtDidKeyset.paginate(
      profilesQuery,
      {
        limit: limit + 1, // Fetch one extra to check if more results exist
        cursor,
        direction: "desc",
      },
    );

    const profiles = await paginatedQuery.exec();

    // Check if there are more results
    const hasMore = profiles.length > limit;
    const results = hasMore ? profiles.slice(0, limit) : profiles;

    // Generate cursor from the last item if we have more results
    let nextCursor: string | undefined;
    if (hasMore && results.length > 0) {
      const lastProfile = results[results.length - 1];
      nextCursor = this.indexedAtDidKeyset.pack({
        primary: lastProfile.indexedAt,
        secondary: lastProfile.authorDid,
      });
    }

    return {
      dids: results.map((profile: { authorDid: string; indexedAt: string }) =>
        profile.authorDid
      ),
      cursor: nextCursor,
    };
  }

  async posts(term: string, limit = 50, cursor?: string) {
    const { q, author } = parsePostSearchQuery(term);

    let authorDid = author;
    if (author && !author?.startsWith("did:")) {
      const actor = await this.db.models.Actor.findOne({
        handle: author,
      });
      authorDid = actor?.did;
    }

    // Build query for posts matching the search term
    const query: Record<string, unknown> = {};

    if (q) {
      // Search in multiple fields for better relevance
      query.$or = [
        { "caption.text": { $regex: q, $options: "i" } },
        { "media.images.alt": { $regex: q, $options: "i" } },
        { "media.video.alt": { $regex: q, $options: "i" } },
        { tags: { $regex: q, $options: "i" } },
      ];
    }

    if (authorDid) {
      query.authorDid = authorDid;
    }

    const postsQuery = this.db.models.Post.find(query);

    // Apply pagination using createdAt + cid (which matches DB schema and indexes)
    const paginatedQuery = this.timeCidKeyset.paginate(postsQuery, {
      limit,
      cursor,
      direction: "desc",
    });

    const posts = await paginatedQuery.exec();

    // Transform posts to include sortAt for cursor generation
    const transformedPosts = posts.map((p) => ({
      uri: p.uri,
      cid: p.cid,
      sortAt: compositeTime(p.createdAt, p.indexedAt) || p.createdAt,
    }));

    // Generate cursor from the last item if we have a full page
    let nextCursor: string | undefined;
    if (transformedPosts.length === limit && transformedPosts.length > 0) {
      const lastPost = transformedPosts[transformedPosts.length - 1];
      nextCursor = this.timeCidKeyset.pack({
        primary: lastPost.sortAt,
        secondary: lastPost.cid,
      });
    }

    return {
      uris: transformedPosts.map((p) => p.uri),
      cursor: nextCursor,
    };
  }
}
