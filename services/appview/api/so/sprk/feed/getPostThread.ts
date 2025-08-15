import { Server } from "../../../../lexicon/index.ts";
import { AppContext } from "../../../../main.ts";
import { OutputSchema } from "../../../../lexicon/types/so/sprk/feed/getPostThread.ts";
import type * as SoSprkFeedDefs from "../../../../lexicon/types/so/sprk/feed/defs.ts";
import { transformPostsToPostViews } from "../../../../utils/post-transformer.ts";
import { PostDocument } from "../../../../data-plane/server/models.ts";
import { type $Typed } from "../../../../lexicon/util.ts";

// Constants
const MAX_DEPTH = 10;
const MAX_PARENT_HEIGHT = 100;
const DEFAULT_DEPTH = 6;
const DEFAULT_PARENT_HEIGHT = 80;
const MAX_URI_LENGTH = 3000;

// Helper function to validate URI
function validateUri(uri: string): boolean {
  return typeof uri === "string" &&
    uri.length > 0 &&
    uri.length <= MAX_URI_LENGTH &&
    uri.startsWith("at://");
}

// Ultra-optimized function to get entire thread structure in minimal queries
async function getCompleteThreadStructure(
  ctx: AppContext,
  rootUri: string,
  maxDepth: number,
  maxParentHeight: number,
) {
  const allUris = new Set<string>([rootUri]);
  const posts = new Map<string, PostDocument>();
  const parentToChildren = new Map<string, string[]>();
  const childToParent = new Map<string, string>();

  // Step 1: Get the root post first
  const rootPosts = await ctx.db.models.Post.find({ uri: rootUri }).lean();
  if (rootPosts.length === 0) {
    return {
      posts,
      parentToChildren,
      childToParent,
      allUris: new Set<string>(),
    };
  }

  const rootPost = rootPosts[0];
  posts.set(rootUri, rootPost);

  // Step 2: Build ancestor chain with single query if root is a reply
  const ancestorUris: string[] = [];
  if (rootPost.reply?.parent?.uri) {
    // Use aggregation to get entire ancestor chain in one query
    const ancestorChain = await ctx.db.models.Post.aggregate([
      { $match: { uri: rootPost.reply.parent.uri } },
      {
        $graphLookup: {
          from: "posts",
          startWith: "$reply.parent.uri",
          connectFromField: "reply.parent.uri",
          connectToField: "uri",
          as: "ancestors",
          maxDepth: maxParentHeight - 1,
        },
      },
      {
        $project: {
          chain: {
            $concatArrays: [
              [{
                uri: "$uri",
                reply: "$reply",
                authorDid: "$authorDid",
                cid: "$cid",
                createdAt: "$createdAt",
                text: "$text",
                embed: "$embed",
                facets: "$facets",
                langs: "$langs",
                labels: "$labels",
                tags: "$tags",
                indexedAt: "$indexedAt",
              }],
              "$ancestors",
            ],
          },
        },
      },
    ]);

    if (ancestorChain.length > 0) {
      const chain = ancestorChain[0].chain as PostDocument[];
      for (const ancestor of chain) {
        allUris.add(ancestor.uri);
        posts.set(ancestor.uri, ancestor);
        ancestorUris.push(ancestor.uri);

        if (ancestor.reply?.parent?.uri) {
          childToParent.set(ancestor.uri, ancestor.reply.parent.uri);
        }
      }
    }
  }

  // Step 3: Get entire descendant tree with single aggregation query
  const descendants = await ctx.db.models.Post.aggregate([
    { $match: { "reply.parent.uri": rootUri } },
    {
      $graphLookup: {
        from: "posts",
        startWith: "$uri",
        connectFromField: "uri",
        connectToField: "reply.parent.uri",
        as: "descendants",
        maxDepth: maxDepth - 1,
      },
    },
    {
      $project: {
        allPosts: {
          $concatArrays: [
            [{
              uri: "$uri",
              reply: "$reply",
              authorDid: "$authorDid",
              cid: "$cid",
              createdAt: "$createdAt",
              text: "$text",
              embed: "$embed",
              facets: "$facets",
              langs: "$langs",
              labels: "$labels",
              tags: "$tags",
              indexedAt: "$indexedAt",
            }],
            "$descendants",
          ],
        },
      },
    },
  ]);

  // Process all descendants
  for (const doc of descendants) {
    const allPosts = doc.allPosts as PostDocument[];
    for (const post of allPosts) {
      allUris.add(post.uri);
      posts.set(post.uri, post);

      if (post.reply?.parent?.uri) {
        const parentUri = post.reply.parent.uri;
        childToParent.set(post.uri, parentUri);

        if (!parentToChildren.has(parentUri)) {
          parentToChildren.set(parentUri, []);
        }
        parentToChildren.get(parentUri)!.push(post.uri);
      }
    }
  }

  // Sort children by creation time for consistent ordering
  for (const [_parentUri, children] of parentToChildren.entries()) {
    children.sort((a, b) => {
      const postA = posts.get(a);
      const postB = posts.get(b);
      if (!postA || !postB) return 0;
      return new Date(postA.createdAt).getTime() -
        new Date(postB.createdAt).getTime();
    });
  }

  return { posts, parentToChildren, childToParent, allUris };
}

// Batch check all block relationships in single query
async function batchCheckBlockedPosts(
  ctx: AppContext,
  authorDids: string[],
  userDid?: string,
): Promise<Set<string>> {
  if (!userDid || authorDids.length === 0) {
    return new Set();
  }

  // Single query to get all block relationships
  const [userBlocking, userBlocked] = await Promise.all([
    ctx.db.models.Block.find({
      authorDid: userDid,
      subject: { $in: authorDids },
    }).select("subject").lean(),
    ctx.db.models.Block.find({
      authorDid: { $in: authorDids },
      subject: userDid,
    }).select("authorDid").lean(),
  ]);

  const blockedAuthorDids = new Set([
    ...userBlocking.map((b) => b.subject),
    ...userBlocked.map((b) => b.authorDid),
  ]);

  return blockedAuthorDids;
}

// Build thread structure from cached data
function buildThreadFromCache(
  uri: string,
  posts: Map<string, PostDocument>,
  postViews: Map<string, SoSprkFeedDefs.PostView>,
  parentToChildren: Map<string, string[]>,
  blockedAuthorDids: Set<string>,
  processedUris = new Set<string>(),
):
  | $Typed<SoSprkFeedDefs.ThreadViewPost>
  | $Typed<SoSprkFeedDefs.NotFoundPost>
  | $Typed<SoSprkFeedDefs.BlockedPost> {
  if (processedUris.has(uri)) {
    return {
      $type: "so.sprk.feed.defs#notFoundPost",
      uri,
      notFound: true,
    } as $Typed<SoSprkFeedDefs.NotFoundPost>;
  }

  processedUris.add(uri);

  const post = posts.get(uri);
  const postView = postViews.get(uri);

  if (!post || !postView) {
    return {
      $type: "so.sprk.feed.defs#notFoundPost",
      uri,
      notFound: true,
    } as $Typed<SoSprkFeedDefs.NotFoundPost>;
  }

  if (blockedAuthorDids.has(post.authorDid)) {
    return {
      $type: "so.sprk.feed.defs#blockedPost",
      uri,
      blocked: true,
      author: {
        $type: "so.sprk.feed.defs#blockedAuthor",
        did: post.authorDid,
      },
    } as $Typed<SoSprkFeedDefs.BlockedPost>;
  }

  const childUris = parentToChildren.get(uri) || [];
  const replies = childUris
    .map((childUri) =>
      buildThreadFromCache(
        childUri,
        posts,
        postViews,
        parentToChildren,
        blockedAuthorDids,
        processedUris,
      )
    )
    .filter((reply) => reply !== null);

  return {
    $type: "so.sprk.feed.defs#threadViewPost",
    post: postView,
    replies: replies as Array<
      | $Typed<SoSprkFeedDefs.ThreadViewPost>
      | $Typed<SoSprkFeedDefs.NotFoundPost>
      | $Typed<SoSprkFeedDefs.BlockedPost>
      | { $type: string }
    >,
    threadContext: {},
  } as $Typed<SoSprkFeedDefs.ThreadViewPost>;
}

export default function (server: Server, ctx: AppContext) {
  server.so.sprk.feed.getPostThread({
    auth: ctx.authVerifier.standardOptional,
    handler: async ({ params, auth }) => {
      try {
        const {
          uri,
          depth = DEFAULT_DEPTH,
          parentHeight = DEFAULT_PARENT_HEIGHT,
        } = params;
        const userDid = auth.credentials.type === "standard"
          ? auth.credentials.iss
          : undefined;

        // Validate input parameters
        if (!uri) {
          return {
            status: 400,
            message: "URI parameter is required",
          };
        }

        if (!validateUri(uri)) {
          return {
            status: 400,
            message: "Invalid URI format",
          };
        }

        const validatedDepth = Math.min(Math.max(depth, 0), MAX_DEPTH);
        const validatedParentHeight = Math.min(
          Math.max(parentHeight, 0),
          MAX_PARENT_HEIGHT,
        );

        // Get complete thread structure with minimal database queries
        const { posts, parentToChildren } = await getCompleteThreadStructure(
          ctx,
          uri,
          validatedDepth,
          validatedParentHeight,
        );

        if (posts.size === 0) {
          return {
            encoding: "application/json",
            body: {
              thread: {
                $type: "so.sprk.feed.defs#notFoundPost",
                uri,
                notFound: true,
              },
            } as OutputSchema,
          };
        }

        // Get all author DIDs for block checking
        const authorDids = Array.from(
          new Set(
            Array.from(posts.values()).map((post) => post.authorDid),
          ),
        );

        // Batch check all block relationships
        const blockedAuthorDids = await batchCheckBlockedPosts(
          ctx,
          authorDids,
          userDid,
        );

        // Check if main post is blocked
        const mainPost = posts.get(uri);
        if (!mainPost) {
          return {
            encoding: "application/json",
            body: {
              thread: {
                $type: "so.sprk.feed.defs#notFoundPost",
                uri,
                notFound: true,
              },
            } as OutputSchema,
          };
        }

        if (blockedAuthorDids.has(mainPost.authorDid)) {
          return {
            encoding: "application/json",
            body: {
              thread: {
                $type: "so.sprk.feed.defs#blockedPost",
                uri,
                blocked: true,
                author: {
                  $type: "so.sprk.feed.defs#blockedAuthor",
                  did: mainPost.authorDid,
                },
              },
            } as OutputSchema,
          };
        }

        // Filter out blocked posts and transform remaining posts in batch
        const accessiblePosts = Array.from(posts.values()).filter(
          (post) => !blockedAuthorDids.has(post.authorDid),
        );

        // Batch transform all accessible posts to PostViews
        const postViews = accessiblePosts.length > 0
          ? await transformPostsToPostViews(accessiblePosts, ctx, userDid)
          : [];

        // Create postViews map for quick lookup
        const postViewsMap = new Map(
          postViews.map((view) => [view.uri, view]),
        );

        // Build thread structure from cached data
        const thread = buildThreadFromCache(
          uri,
          posts,
          postViewsMap,
          parentToChildren,
          blockedAuthorDids,
        );

        // Handle parent chain efficiently
        if (mainPost.reply?.parent?.uri) {
          let currentThread = thread;
          let parentUri: string | undefined = mainPost.reply.parent.uri;

          // Build parent chain iteratively
          while (parentUri && posts.has(parentUri)) {
            const parentPost: PostDocument = posts.get(parentUri)!;
            const parentView = postViewsMap.get(parentUri);

            if (!parentView || blockedAuthorDids.has(parentPost.authorDid)) {
              // Create blocked parent
              const blockedParent = {
                $type: "so.sprk.feed.defs#blockedPost",
                uri: parentUri,
                blocked: true,
                author: {
                  $type: "so.sprk.feed.defs#blockedAuthor",
                  did: parentPost.authorDid,
                },
              } as $Typed<SoSprkFeedDefs.BlockedPost>;

              if (currentThread.$type === "so.sprk.feed.defs#threadViewPost") {
                (currentThread as $Typed<SoSprkFeedDefs.ThreadViewPost>)
                  .parent = blockedParent;
              }
              break;
            }

            // Create parent thread
            const parentThread = {
              $type: "so.sprk.feed.defs#threadViewPost",
              post: parentView,
              replies: [currentThread],
              threadContext: {},
            } as $Typed<SoSprkFeedDefs.ThreadViewPost>;

            if (currentThread.$type === "so.sprk.feed.defs#threadViewPost") {
              (currentThread as $Typed<SoSprkFeedDefs.ThreadViewPost>).parent =
                parentThread;
            }

            currentThread = parentThread;
            parentUri = parentPost.reply?.parent?.uri;
          }
        }

        const response: OutputSchema = {
          thread,
        };

        return {
          encoding: "application/json",
          body: response,
        };
      } catch (error) {
        console.error("Error in getPostThread:", error);

        // Handle specific error cases
        if (error instanceof Error) {
          const message = error.message;

          if (message.includes("not found") || message.includes("Not found")) {
            return {
              status: 404,
              error: "NotFound" as const,
              message: "Post not found",
            };
          }

          if (message.includes("connection") || message.includes("timeout")) {
            return {
              status: 503,
              message: "Database temporarily unavailable",
            };
          }

          if (message.includes("validation") || message.includes("invalid")) {
            return {
              status: 400,
              message: "Invalid request parameters",
            };
          }

          if (message.includes("limit") || message.includes("quota")) {
            return {
              status: 429,
              message: "Rate limit exceeded",
            };
          }
        }

        return {
          status: 500,
          message: "Internal server error",
        };
      }
    },
  });
}
