import { Database } from "../db/index.ts";

// Types for thread processing
interface PostWithReply {
  uri: string;
  createdAt: string;
  authorDid?: string;
  reply?: {
    parent?: {
      uri: string;
    };
  };
}

// Parameter validation
function validateThreadParams(above: number, below: number) {
  if (!Number.isInteger(above) || above < 0 || above > 100) {
    throw new Error("Invalid above: must be an integer between 0 and 100");
  }

  if (!Number.isInteger(below) || below < 0 || below > 100) {
    throw new Error("Invalid below: must be an integer between 0 and 100");
  }
}

// Helper function to get ancestors (parent posts going up the thread)
async function getAncestors(
  db: Database,
  postUri: string,
  maxDepth: number,
): Promise<string[]> {
  const ancestors: string[] = [];
  let currentUri = postUri;
  let depth = 0;

  while (depth < maxDepth) {
    const post = await db.models.Post.findOne({ uri: currentUri })
      .select("reply.parent.uri");

    if (!post || !post.reply?.parent?.uri) {
      break;
    }

    const parentUri = post.reply.parent.uri;
    ancestors.unshift(parentUri); // Add to beginning to maintain order
    currentUri = parentUri;
    depth++;
  }

  return ancestors;
}

// Helper function to get descendants (child posts going down the thread)
async function getDescendants(
  db: Database,
  postUri: string,
  maxDepth: number,
): Promise<string[]> {
  const descendants: string[] = [];
  const visited = new Set<string>();

  // Use BFS to traverse descendants
  const queue: Array<{ uri: string; depth: number }> = [{
    uri: postUri,
    depth: 0,
  }];

  while (queue.length > 0) {
    const { uri: currentUri, depth } = queue.shift()!;

    if (depth >= maxDepth || visited.has(currentUri)) {
      continue;
    }

    visited.add(currentUri);

    // Find all replies to this post
    const replies = await db.models.Post.find({
      "reply.parent.uri": currentUri,
    })
      .select("uri createdAt")
      .sort({ createdAt: -1 }); // Most recent first

    for (const reply of replies) {
      if (!visited.has(reply.uri)) {
        descendants.push(reply.uri);

        // Add to queue for further traversal if we haven't reached max depth
        if (depth + 1 < maxDepth) {
          queue.push({ uri: reply.uri, depth: depth + 1 });
        }
      }
    }
  }

  return descendants;
}

export class Threads {
  private db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  async getThread(postUri: string, above: number = 10, below: number = 50) {
    validateThreadParams(above, below);

    try {
      // Get ancestors (parents going up) and descendants (replies going down) in parallel
      const [ancestors, descendants] = await Promise.all([
        getAncestors(this.db, postUri, above),
        getDescendants(this.db, postUri, below),
      ]);

      // Verify the original post exists
      const originalPost = await this.db.models.Post.findOne({ uri: postUri })
        .select("uri");

      if (!originalPost) {
        throw new Error("Post not found");
      }

      // Combine all URIs: ancestors + self + descendants
      const uris = [
        ...ancestors,
        postUri, // The original post
        ...descendants,
      ];

      // Remove duplicates while preserving order
      const uniqueUris = Array.from(new Set(uris));

      return {
        uris: uniqueUris,
        meta: {
          ancestorCount: ancestors.length,
          descendantCount: descendants.length,
          totalCount: uniqueUris.length,
        },
      };
    } catch (error) {
      console.error("Error fetching thread:", error);
      throw new Error("Failed to fetch thread");
    }
  }

  async getThreadStructure(
    postUri: string,
    above: number = 10,
    below: number = 50,
  ) {
    validateThreadParams(above, below);

    try {
      // Get the original post
      const originalPost = await this.db.models.Post.findOne({ uri: postUri })
        .select("uri createdAt authorDid reply");

      if (!originalPost) {
        throw new Error("Post not found");
      }

      // Get ancestors with metadata
      const ancestors: Array<{ uri: string; depth: number }> = [];
      let currentUri = postUri;
      let depth = 0;

      while (depth < above) {
        const post = await this.db.models.Post.findOne({ uri: currentUri })
          .select("reply.parent.uri");

        if (!post || !post.reply?.parent?.uri) {
          break;
        }

        const parentUri = post.reply.parent.uri;
        ancestors.unshift({ uri: parentUri, depth: depth + 1 });
        currentUri = parentUri;
        depth++;
      }

      // Get descendants with metadata using BFS
      const descendants: Array<
        { uri: string; depth: number; parent: string }
      > = [];
      const queue: Array<{ uri: string; depth: number; parent: string }> = [
        { uri: postUri, depth: 0, parent: postUri },
      ];
      const visited = new Set<string>([postUri]);

      while (queue.length > 0) {
        const { uri: currentUri, depth: currentDepth } = queue.shift()!;

        if (currentDepth >= below) {
          continue;
        }

        const replies = await this.db.models.Post.find({
          "reply.parent.uri": currentUri,
        })
          .select("uri createdAt")
          .sort({ createdAt: -1 });

        for (const reply of replies) {
          if (!visited.has(reply.uri)) {
            visited.add(reply.uri);
            const childDepth = currentDepth + 1;

            descendants.push({
              uri: reply.uri,
              depth: childDepth,
              parent: currentUri,
            });

            if (childDepth < below) {
              queue.push({
                uri: reply.uri,
                depth: childDepth,
                parent: reply.uri,
              });
            }
          }
        }
      }

      return {
        root: {
          uri: postUri,
          isRoot: !originalPost.reply?.parent?.uri,
        },
        ancestors: ancestors.reverse(), // Top ancestor first
        descendants,
        meta: {
          ancestorCount: ancestors.length,
          descendantCount: descendants.length,
          maxAncestorDepth: ancestors.length > 0
            ? Math.max(...ancestors.map((a) => a.depth))
            : 0,
          maxDescendantDepth: descendants.length > 0
            ? Math.max(...descendants.map((d) => d.depth))
            : 0,
        },
      };
    } catch (error) {
      console.error("Error fetching thread structure:", error);
      throw new Error("Failed to fetch thread structure");
    }
  }
}
