import { Database } from "../db/index.ts";
import { IndexedAtDidKeyset, TimeCidKeyset } from "../db/pagination.ts";
import { parsePostSearchQuery } from "../util.ts";
import { compositeTime } from "./records.ts";

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

  // @TODO actor search endpoints still fall back to search service
  async searchActors(term: string, limit = 50, cursor?: string) {
    const cleanedTerm = cleanQuery(term);
    const regex = new RegExp(cleanedTerm, "i");

    const actorsQuery = this.db.models.Actor.find({
      handle: { $regex: regex },
    });

    const paginatedQuery = this.indexedAtDidKeyset.paginate(actorsQuery, {
      limit,
      cursor,
      direction: "desc",
    });

    const actors = await paginatedQuery.exec();

    // Generate cursor from the last item if we have a full page
    let nextCursor: string | undefined;
    if (actors.length === limit && actors.length > 0) {
      const lastActor = actors[actors.length - 1];
      nextCursor = this.indexedAtDidKeyset.pack({
        primary: lastActor.indexedAt,
        secondary: lastActor.did,
      });
    }

    return {
      dids: actors.map((actor) => actor.did),
      cursor: nextCursor,
    };
  }

  // @TODO post search endpoint still falls back to search service
  async searchPosts(term: string, limit = 50, cursor?: string) {
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
      // Search in caption.text using regex
      query["caption.text"] = { $regex: q, $options: "i" };
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
