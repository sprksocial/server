import { Database } from "../db/index.ts";
import { TimeCidKeyset } from "../db/pagination.ts";
import { compositeTime } from "../util.ts";
import { ids } from "../../lex/lexicons.ts";

const STORIES_EXPIRY_HOURS = 24;

export interface StoryItem {
  uri: string;
  cid: string;
  authorDid: string;
  createdAt: string;
  indexedAt: string;
  sortAt: string;
  archived: boolean;
}

export class Stories {
  private db: Database;
  private timeCidKeyset: TimeCidKeyset;

  constructor(db: Database) {
    this.db = db;
    this.timeCidKeyset = new TimeCidKeyset();
  }

  /**
   * Get active (non-expired) stories by URIs
   */
  async getStories(uris: string[]): Promise<StoryItem[]> {
    if (!uris.length) return [];

    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(
      twentyFourHoursAgo.getHours() - STORIES_EXPIRY_HOURS,
    );
    const minDate = twentyFourHoursAgo.toISOString();

    const stories = await this.db.models.Story.find({
      uri: { $in: uris },
      indexedAt: { $gte: minDate },
    }).lean();

    return stories.map((story) => ({
      uri: story.uri,
      cid: story.cid,
      authorDid: story.authorDid,
      createdAt: story.createdAt,
      indexedAt: story.indexedAt,
      archived: false,
      sortAt: compositeTime(story.createdAt, story.indexedAt) ||
        story.createdAt,
    }));
  }

  /**
   * Get timeline stories from followed users (including the viewer's own stories)
   */
  async getTimeline(
    actorDid: string,
    followedDids: string[],
    limit = 50,
    cursor?: string,
  ): Promise<{ stories: StoryItem[]; cursor?: string }> {
    const timelineDids = [...followedDids, actorDid];

    if (timelineDids.length === 0) {
      return { stories: [] };
    }

    // Calculate 24-hour expiry threshold
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(
      twentyFourHoursAgo.getHours() - STORIES_EXPIRY_HOURS,
    );
    const minDate = twentyFourHoursAgo.toISOString();

    // Build query with expiry filter
    const storiesQuery = this.db.models.Story.find({
      authorDid: { $in: timelineDids },
      // Keep this nested to avoid merging with keyset cursor $or filter.
      $and: [
        {
          $or: [
            { authorDid: actorDid },
            { indexedAt: { $gte: minDate } },
          ],
        },
      ],
    });

    // Apply pagination
    const paginatedQuery = this.timeCidKeyset.paginate(storiesQuery, {
      limit: limit + 1, // Get one extra for cursor check
      cursor,
      direction: "desc",
    });

    const stories = await paginatedQuery.exec();

    // Check if we have more results
    const hasMore = stories.length > limit;
    const resultStories = hasMore ? stories.slice(0, limit) : stories;

    // Transform stories
    const transformedStories: StoryItem[] = resultStories.map((story) => ({
      uri: story.uri,
      cid: story.cid,
      authorDid: story.authorDid,
      createdAt: story.createdAt,
      indexedAt: story.indexedAt,
      archived: false,
      sortAt: compositeTime(story.createdAt, story.indexedAt) ||
        story.createdAt,
    }));

    // Generate cursor from last item if we have more results
    let nextCursor: string | undefined;
    if (hasMore && resultStories.length > 0) {
      nextCursor = this.timeCidKeyset.packFromResult(resultStories);
    }

    return {
      stories: transformedStories,
      cursor: nextCursor,
    };
  }

  /**
   * Get archived stories for an author
   */
  async getArchive(
    actorDid: string,
    limit = 50,
    cursor?: string,
    includeTakedowns = false,
  ): Promise<{ stories: StoryItem[]; cursor?: string }> {
    const baseQuery: {
      did: string;
      collectionName: string;
      $or?: Array<
        { takedownRef?: { $exists: boolean } } | { takedownRef: string }
      >;
    } = {
      did: actorDid,
      collectionName: ids.SoSprkStoryPost,
    };

    if (!includeTakedowns) {
      baseQuery.$or = [
        { takedownRef: { $exists: false } },
        { takedownRef: "" },
      ];
    }

    const storiesQuery = this.db.models.ArchivedRecord.find(baseQuery);

    const paginatedQuery = this.timeCidKeyset.paginate(storiesQuery, {
      limit: limit + 1,
      cursor,
      direction: "desc",
    });

    const stories = await paginatedQuery.exec();
    const hasMore = stories.length > limit;
    const resultStories = hasMore ? stories.slice(0, limit) : stories;

    const transformedStories: StoryItem[] = resultStories.map((story) => ({
      uri: story.uri,
      cid: story.cid,
      authorDid: story.did,
      createdAt: story.createdAt,
      indexedAt: story.indexedAt,
      archived: true,
      sortAt: compositeTime(story.createdAt, story.indexedAt) ||
        story.createdAt,
    }));

    let nextCursor: string | undefined;
    if (hasMore && resultStories.length > 0) {
      nextCursor = this.timeCidKeyset.packFromResult(resultStories);
    }

    return {
      stories: transformedStories,
      cursor: nextCursor,
    };
  }

  /**
   * Filter out expired stories (older than 24 hours)
   */
  filterExpiredStories(
    stories: StoryItem[],
    ownerDid?: string,
  ): StoryItem[] {
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(
      twentyFourHoursAgo.getHours() - STORIES_EXPIRY_HOURS,
    );

    return stories.filter((story) => {
      if (ownerDid && story.authorDid === ownerDid) return true;
      const storyDate = new Date(story.indexedAt);
      return storyDate >= twentyFourHoursAgo;
    });
  }

  /**
   * Get blocked author DIDs for a viewer
   */
  async getBlockedAuthors(
    viewerDid: string,
    authorDids: string[],
  ): Promise<Set<string>> {
    if (authorDids.length === 0) {
      return new Set();
    }

    // Single query to get all block relationships
    const [viewerBlocking, viewerBlocked] = await Promise.all([
      this.db.models.Block.find({
        authorDid: viewerDid,
        subject: { $in: authorDids },
      }).select("subject").lean(),
      this.db.models.Block.find({
        authorDid: { $in: authorDids },
        subject: viewerDid,
      }).select("authorDid").lean(),
    ]);

    const blockedAuthorDids = new Set([
      ...viewerBlocking.map((b) => b.subject),
      ...viewerBlocked.map((b) => b.authorDid),
    ]);

    return blockedAuthorDids;
  }
}
