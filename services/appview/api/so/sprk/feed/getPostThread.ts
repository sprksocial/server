import { Server } from "../../../../lexicon/index.ts";
import { OutputSchema as GetPostThreadView } from "../../../../lexicon/types/so/sprk/feed/getPostThread.ts";
import type * as SoSprkFeedDefs from "../../../../lexicon/types/so/sprk/feed/defs.ts";
import { AppContext } from "../../../../main.ts";
import { transformPostToPostView } from "../../../../utils/post-transformer.ts";

export default function (server: Server, ctx: AppContext) {
  server.so.sprk.feed.getPostThread({
    auth: ctx.authVerifier.standardOptional,
    handler: async ({ params, auth }) => {
      // Recursive function to build a thread view for a post and its replies
      async function buildThreadView(
        post: { uri: string; reply?: { parent: { uri: string } } },
        userDid?: string,
        depth = 0,
      ): Promise<SoSprkFeedDefs.ThreadViewPost> {
        // Get the full post document
        const fullPost = await ctx.db.models.Post.findOne({ uri: post.uri })
          .lean();
        if (!fullPost) {
          throw new Error(`Post not found: ${post.uri}`);
        }

        // Convert the post to a post view
        const postView = await transformPostToPostView(
          fullPost,
          ctx,
          userDid,
        );

        // If we've reached the maximum depth, don't fetch replies
        if (depth <= 0) {
          return {
            $type: "so.sprk.feed.defs#threadViewPost",
            post: postView,
            replies: [],
            threadContext: {},
          } as SoSprkFeedDefs.ThreadViewPost;
        }

        // Get replies to this post
        const replies = await ctx.db.models.Post.find({
          "reply.parent.uri": post.uri,
        }).sort({ createdAt: 1 }).lean();

        // Convert replies to thread views recursively
        const replyThreads = await Promise.all(
          replies.map(async (reply: { uri: string }) => {
            return await buildThreadView(reply, userDid, depth - 1);
          }),
        );

        // Check for user specific thread context
        const threadContext: SoSprkFeedDefs.ThreadContext = {};

        return {
          $type: "so.sprk.feed.defs#threadViewPost",
          post: postView,
          replies: replyThreads,
          threadContext,
        } as SoSprkFeedDefs.ThreadViewPost;
      }

      const { uri } = params;
      const depth = typeof params.depth === "number" ? params.depth : 6;
      const parentHeight = typeof params.parentHeight === "number"
        ? params.parentHeight
        : 80;
      const userDid = auth.credentials.type === "standard"
        ? auth.credentials.iss
        : undefined;

      if (!uri) {
        throw new Error("URI is required");
      }

      try {
        // Get the requested post
        const mainPost = await ctx.db.models.Post.findOne({ uri }).lean();

        if (!mainPost) {
          return {
            encoding: "application/json",
            body: {
              thread: {
                $type: "so.sprk.feed.defs#notFoundPost",
                uri,
                notFound: true,
              },
            } as GetPostThreadView,
          };
        }

        // Convert the main post to a PostView
        const mainPostView = await transformPostToPostView(
          mainPost,
          ctx,
          userDid,
        );

        // Get parent posts if this is a reply
        const parentPosts: SoSprkFeedDefs.PostView[] = [];

        if (mainPost.reply) {
          // Navigate up to the root collecting parent posts
          let currentParentUri = mainPost.reply.parent.uri;
          let parentsCollected = 0;

          while (currentParentUri && parentsCollected < parentHeight) {
            const parentPost = await ctx.db.models.Post.findOne({
              uri: currentParentUri,
            }).lean();

            if (!parentPost) {
              break;
            }

            const parentPostView = await transformPostToPostView(
              parentPost,
              ctx,
              userDid,
            );
            parentPosts.unshift(parentPostView); // Add at the beginning so root is first

            // If we reached the root, stop
            if (!parentPost.reply) {
              break;
            }

            // Move to the next parent
            currentParentUri = parentPost.reply.parent.uri;
            parentsCollected++;
          }
        }

        // Get replies to the main post (direct children)
        const replies = await ctx.db.models.Post.find({
          "reply.parent.uri": mainPost.uri,
        }).sort({ createdAt: 1 }).lean();

        // Convert replies to thread views recursively
        const replyThreads = await Promise.all(
          replies.map(async (reply: { uri: string }) => {
            return await buildThreadView(reply, userDid, depth - 1);
          }),
        );

        // Check for user specific thread context
        const threadContext: SoSprkFeedDefs.ThreadContext = {};

        // Build the main thread view
        const thread = {
          $type: "so.sprk.feed.defs#threadViewPost",
          post: mainPostView,
          replies: replyThreads,
          threadContext,
        } as SoSprkFeedDefs.ThreadViewPost;

        // Add parent if it exists
        if (parentPosts.length > 0) {
          // Create a nested parent structure
          let currentParent: {
            $type: string;
            post: SoSprkFeedDefs.PostView;
            parent?: unknown;
            replies: SoSprkFeedDefs.ThreadViewPost[];
            threadContext: SoSprkFeedDefs.ThreadContext;
          } | undefined = undefined;

          // Build parent thread structure from oldest to newest
          for (const parentPost of parentPosts) {
            currentParent = {
              $type: "so.sprk.feed.defs#threadViewPost",
              post: parentPost,
              parent: currentParent,
              replies: [],
              threadContext: {},
            };
          }

          // Set the direct parent of the main post
          thread.parent = currentParent;
        }

        return {
          encoding: "application/json",
          body: { thread } as GetPostThreadView,
        };
      } catch (error) {
        throw error;
      }
    },
  });
}
