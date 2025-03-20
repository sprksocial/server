import { Database } from '../db/connection';

export const shortname = 'simple-desc'

export const handler = async (db: Database, params: any) => {
  const { limit = 50, cursor } = params;

  // Build the query
  const query: any = {};

  // Apply cursor if provided
  if (cursor) {
    const timestamp = new Date(parseInt(cursor, 10));
    query.indexedAt = { $lt: timestamp };
  }

  // Get posts from MongoDB, sorted by most recent
  const posts = await db.models.Post.find(query)
    .sort({ indexedAt: -1 })
    .limit(limit)

  // Map to feed format
  const feed = posts.map((post) => ({
    post: post.uri
  }));

  // Set cursor for pagination
  let nextCursor: string | undefined;
  const lastPost = posts.at(-1);
  if (lastPost) {
    nextCursor = new Date(lastPost.indexedAt).getTime().toString(10);
  }

  return {
    cursor: nextCursor,
    feed,
  };
}