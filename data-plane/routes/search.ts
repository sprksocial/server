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
    if (!cleanedTerm) {
      return {
        dids: [],
        cursor: undefined,
      };
    }

    const handlePrefix = cleanedTerm.toLowerCase();
    const handleRangeEnd = `${handlePrefix}\uffff`;

    const [matchingActors, matchingProfiles] = await Promise.all([
      this.db.models.Actor.find({
        handle: {
          $gte: handlePrefix,
          $lt: handleRangeEnd,
        },
      }).select("did -_id").lean(),
      this.db.models.Profile.find({
        $text: { $search: cleanedTerm },
      }).select("authorDid -_id").lean(),
    ]);

    const matchingActorDids = matchingActors.map((actor) => actor.did);
    const matchingProfileDids = matchingProfiles.map((profile) =>
      profile.authorDid
    );
    const dids = Array.from(
      new Set([...matchingActorDids, ...matchingProfileDids]),
    );

    if (dids.length === 0) {
      return {
        dids: [],
        cursor: undefined,
      };
    }

    const profilesQuery = this.db.models.Profile.find({
      authorDid: { $in: dids },
    }).select("authorDid indexedAt -_id");

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

  async actorsTypeahead(term: string, limit = 10, viewerDid?: string | null) {
    const cleanedTerm = cleanQuery(term);
    if (!cleanedTerm) {
      return {
        dids: [],
      };
    }

    const safeLimit = Math.max(1, Math.min(limit, 100));
    const candidateLimit = safeLimit * 3;
    const handlePrefix = cleanedTerm.toLowerCase();
    const handleRangeEnd = `${handlePrefix}\uffff`;

    const matchingActors = await this.db.models.Actor.find({
      handle: {
        $gte: handlePrefix,
        $lt: handleRangeEnd,
      },
    })
      .select("did -_id")
      .sort({ handle: 1 })
      .limit(candidateLimit)
      .lean();

    const handleDids = matchingActors.map((actor) => actor.did);
    const profileQuery = handleDids.length > 0
      ? {
        $or: [
          { authorDid: { $in: handleDids } },
          { $text: { $search: cleanedTerm } },
        ],
      }
      : { $text: { $search: cleanedTerm } };
    const matchingProfiles = await this.db.models.Profile.find(profileQuery)
      .select("authorDid followersCount -_id")
      .limit(candidateLimit * 2)
      .lean();

    const followerCountMap = new Map<string, number>(
      matchingProfiles.map((p) => [p.authorDid, p.followersCount ?? 0]),
    );

    const handleDidSet = new Set(handleDids);
    const handleProfileDidSet = new Set(
      matchingProfiles.map((p) => p.authorDid),
    );
    const handleProfileDids = handleDids.filter((did) =>
      handleProfileDidSet.has(did)
    );
    const includedDids = new Set(handleProfileDids);
    const textProfileDids = matchingProfiles
      .map((profile) => profile.authorDid)
      .filter((did) => !includedDids.has(did) && !handleDidSet.has(did));

    // Sort each group by follower count descending
    const byFollowers = (a: string, b: string) =>
      (followerCountMap.get(b) ?? 0) - (followerCountMap.get(a) ?? 0);
    handleProfileDids.sort(byFollowers);
    textProfileDids.sort(byFollowers);

    let candidates = [...handleProfileDids, ...textProfileDids].slice(
      0,
      safeLimit * 2,
    );

    // Boost accounts the viewer already follows to the front
    if (viewerDid && candidates.length > 0) {
      const viewerFollows = await this.db.models.Follow.find({
        authorDid: viewerDid,
        subject: { $in: candidates },
      }).select("subject -_id").lean();
      const followedSet = new Set(viewerFollows.map((f) => f.subject));
      candidates = [
        ...candidates.filter((did) => followedSet.has(did)),
        ...candidates.filter((did) => !followedSet.has(did)),
      ];
    }

    return {
      dids: candidates.slice(0, safeLimit),
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
