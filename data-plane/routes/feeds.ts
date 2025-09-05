import { decodeBase64, encodeBase64 } from "jsr:@std/encoding/base64";
import { Types } from "mongoose";
import { Database } from "../db/index.ts";

// TypeScript types
type FeedType =
  | "POSTS_WITH_MEDIA"
  | "POSTS_WITH_VIDEO"
  | "POSTS_NO_REPLIES"
  | "POSTS_AND_AUTHOR_THREADS";

// Types for MongoDB queries
interface FeedQuery {
  authorDid?: string | { $in: string[] };
  "embed.images"?: { $exists: boolean };
  "embed.video"?: { $exists: boolean };
  "reply.parent"?: { $exists: boolean } | null;
  "reply.root.uri"?: { $regex: RegExp };
  createdAt?: { $lt: string };
  _id?: { $lt: string };
  $or?: Array<
    {
      createdAt?: { $lt: string };
      _id?: { $lt: string };
      "reply.parent"?: null;
      "reply.root.uri"?: { $regex: RegExp };
    } | {
      createdAt: string;
      _id: { $lt: string };
      "reply.parent"?: null;
      "reply.root.uri"?: { $regex: RegExp };
    }
  >;
  $and?: Array<{
    $or: Array<{
      createdAt?: { $lt: string };
      _id?: { $lt: string };
      "reply.parent"?: null;
      "reply.root.uri"?: { $regex: RegExp };
    }>;
  }>;
}

// Helper function to parse cursor
function parseCursor(cursor?: string): { createdAt?: string; id?: string } {
  if (!cursor) return {};
  try {
    const decoded = new TextDecoder().decode(decodeBase64(cursor));
    return JSON.parse(decoded);
  } catch {
    return {};
  }
}

// Helper function to create cursor
function createCursor(createdAt: string, id: string): string {
  const cursorData = { createdAt, id };
  const encoded = new TextEncoder().encode(JSON.stringify(cursorData));
  return encodeBase64(encoded);
}

// Helper function to format feed items
function feedItemFromRow(
  item: { uri: string; repostUri?: string },
): { uri: string; repost?: string } {
  return {
    uri: item.uri,
    repost: item.repostUri && item.repostUri !== item.uri
      ? item.repostUri
      : undefined,
  };
}

export class Feeds {
  private db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  async getAuthor(
    actorDid: string,
    limit = 50,
    cursor?: string,
    feedType?: FeedType,
  ) {
    const { createdAt, id } = parseCursor(cursor);

    // Base query for posts by this author
    let query: FeedQuery = { authorDid: actorDid };

    // Add feed type filters
    if (feedType === "POSTS_WITH_MEDIA") {
      query["embed.images"] = { $exists: true };
    } else if (feedType === "POSTS_WITH_VIDEO") {
      query["embed.video"] = { $exists: true };
    } else if (feedType === "POSTS_NO_REPLIES") {
      query["reply.parent"] = null;
    } else if (feedType === "POSTS_AND_AUTHOR_THREADS") {
      // Posts that are either not replies, or replies to this author's posts
      query = {
        authorDid: actorDid,
        $or: [
          { "reply.parent": null },
          { "reply.root.uri": { $regex: new RegExp(`^at://${actorDid}/`) } },
        ],
      } as FeedQuery;
    }

    // Add cursor conditions for pagination
    if (createdAt && id) {
      if (query.$or) {
        // If we already have $or conditions, we need to restructure
        const existingOr = query.$or;
        query = {
          ...query,
          $and: [
            { $or: existingOr },
            {
              $or: [
                { createdAt: { $lt: createdAt } },
                { createdAt: createdAt, _id: { $lt: id } },
              ],
            },
          ],
        } as FeedQuery;
        delete query.$or;
      } else {
        query.$or = [
          { createdAt: { $lt: createdAt } },
          { createdAt: createdAt, _id: { $lt: id } },
        ];
      }
    }

    // Get posts
    const posts = await this.db.models.Post.find(query)
      .select("uri authorDid createdAt")
      .sort({ createdAt: -1, _id: -1 })
      .limit(limit);

    // Get reposts by this author
    const reposts = await this.db.models.Repost.find({
      authorDid: actorDid,
      ...(createdAt && id
        ? {
          $or: [
            { createdAt: { $lt: createdAt } },
            { createdAt: createdAt, _id: { $lt: id } },
          ],
        }
        : {}),
    })
      .select("uri subject.uri authorDid createdAt")
      .sort({ createdAt: -1, _id: -1 })
      .limit(limit);

    // Combine and sort all items
    const allItems = [
      ...posts.map((p) => ({ ...p.toObject(), type: "post" })),
      ...reposts.map((r) => ({
        ...r.toObject(),
        type: "repost",
        repostUri: r.uri,
        uri: r.subject.uri,
      })),
    ]
      .sort((a, b) => {
        if (a.createdAt > b.createdAt) return -1;
        if (a.createdAt < b.createdAt) return 1;
        return (a._id as Types.ObjectId) > (b._id as Types.ObjectId) ? -1 : 1;
      })
      .slice(0, limit);

    let nextCursor: string | undefined;
    if (allItems.length === limit) {
      const lastItem = allItems[allItems.length - 1];
      nextCursor = createCursor(
        lastItem.createdAt,
        (lastItem._id as Types.ObjectId).toString(),
      );
    }

    return {
      items: allItems.map(feedItemFromRow),
      cursor: nextCursor,
    };
  }

  async getTimeline(actorDid: string, limit = 50, cursor?: string) {
    const { createdAt, id } = parseCursor(cursor);

    // Get people this actor follows
    const follows = await this.db.models.Follow.find({ authorDid: actorDid })
      .select("subject");
    const followedDids = follows.map((f) => f.subject);

    // Build query for timeline posts
    const query: FeedQuery = {
      authorDid: { $in: [...followedDids, actorDid] },
    };

    // Add cursor conditions for pagination
    if (createdAt && id) {
      query.$or = [
        { createdAt: { $lt: createdAt } },
        { createdAt: createdAt, _id: { $lt: id } },
      ];
    }

    // Get posts from followed users and self
    const posts = await this.db.models.Post.find(query)
      .select("uri authorDid createdAt")
      .sort({ createdAt: -1, _id: -1 })
      .limit(Math.floor(limit * 0.8)); // Reserve some space for reposts

    // Get reposts from followed users and self
    const reposts = await this.db.models.Repost.find(query)
      .select("uri subject.uri authorDid createdAt")
      .sort({ createdAt: -1, _id: -1 })
      .limit(Math.floor(limit * 0.2));

    // Combine and sort all items
    const allItems = [
      ...posts.map((p) => ({ ...p.toObject(), type: "post" })),
      ...reposts.map((r) => ({
        ...r.toObject(),
        type: "repost",
        repostUri: r.uri,
        uri: r.subject.uri,
      })),
    ]
      .sort((a, b) => {
        if (a.createdAt > b.createdAt) return -1;
        if (a.createdAt < b.createdAt) return 1;
        return (a._id as Types.ObjectId) > (b._id as Types.ObjectId) ? -1 : 1;
      })
      .slice(0, limit);

    let nextCursor: string | undefined;
    if (allItems.length === limit) {
      const lastItem = allItems[allItems.length - 1];
      nextCursor = createCursor(
        lastItem.createdAt,
        (lastItem._id as Types.ObjectId).toString(),
      );
    }

    return {
      items: allItems.map(feedItemFromRow),
      cursor: nextCursor,
    };
  }
}
