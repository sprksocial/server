import { Server } from "../../../../lexicon/index.ts";
import { AppContext } from "../../../../main.ts";
import { OutputSchema as GetPostsView } from "../../../../lexicon/types/so/sprk/feed/getPosts.ts";
import { transformPostToPostView } from "../../../../utils/post-transformer.ts";

export default function (server: Server, ctx: AppContext) {
  server.so.sprk.feed.getPosts({
    auth: ctx.authVerifier.standardOptional,
    handler: async ({ params, auth }) => {
      const { uris } = params;
      const userDid = auth.credentials.type === "standard"
        ? auth.credentials.iss
        : undefined;

      if (!uris || uris.length === 0) {
        return {
          encoding: "application/json",
          body: { posts: [] } as GetPostsView,
        };
      }

      const uriArray = Array.isArray(uris) ? uris : [uris];
      const dbPosts = await ctx.db.models.Post.find({ uri: { $in: uriArray } })
        .lean();

      // Transform each post to PostView format
      const postViews = await Promise.all(
        dbPosts.map((post) => transformPostToPostView(post, ctx.db, userDid)),
      );

      return {
        encoding: "application/json",
        body: { posts: postViews } as GetPostsView,
      };
    },
  });
}
