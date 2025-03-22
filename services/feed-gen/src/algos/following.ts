import { Database } from '../db/connection';
import { AlgoInfo, feedParams } from './types'

export const shortname = 'following'

const handler = async (db: Database, params: feedParams) => {
  const { limit = 50, requesterDid, cursor } = params;

  // Build the query
  const query: any = {};

  // Apply cursor if provided
  if (cursor) {
    const timestamp = new Date(parseInt(cursor, 10));
    query.indexedAt = { $lt: timestamp };
  }

  const followers = (await db.models.Follow.find(
    { authorDid: requesterDid }
  )).map((follow) => follow.subject)

  // Get posts from MongoDB, sorted by most recent
  const posts = await db.models.Post.find(query)
    .sort({ indexedAt: -1 })
    .where('authorDid').in(followers)
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

export const info = {
  handler,
  needsAuth: true
} as AlgoInfo