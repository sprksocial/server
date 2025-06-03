import { Hono } from "hono";

import { OutputSchema as GetPostsView } from "../../../../lexicon/types/so/sprk/feed/getPosts.ts";
import { AppContext, AppEnv } from "../../../../main.ts";
import { transformPostToPostView } from "../../../../utils/post-transformer.ts";
import { Database } from "../../../../services/data-plane/server/index.ts";
import type * as SoSprkFeedDefs from "../../../../lexicon/types/so/sprk/feed/defs.ts";
import { optionalAuthMiddleware } from "../../../../services/auth/middleware.ts";

// Function to fetch posts by URIs
async function getPosts(
  uris: string | string[],
  db: Database,
  userDid?: string,
): Promise<SoSprkFeedDefs.PostView[]> {
  if (!uris) {
    return [];
  }

  const uriArray = Array.isArray(uris) ? uris : [uris];

  if (uriArray.length === 0) {
    return [];
  }

  const dbPosts = await db.models.Post.find({ uri: { $in: uriArray } }).lean();

  // Transform each post to PostView format
  const postViews = await Promise.all(
    dbPosts.map((post) => transformPostToPostView(post, db, userDid)),
  );

  return postViews;
}

export const createGetPostsRouter = (ctx: AppContext) => {
  const router = new Hono<AppEnv>();

  router.get(
    "/xrpc/so.sprk.feed.getPosts",
    optionalAuthMiddleware,
    async (c) => {
      const uris = c.req.queries("uris");
      const userDid = c.get("did") as string | undefined;

      if (!uris || uris.length === 0) {
        return c.json({ posts: [] } as GetPostsView);
      }

      const posts = await getPosts(uris, ctx.db, userDid);

      return c.json({ posts } as GetPostsView);
    },
  );
  return router;
};
