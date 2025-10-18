import { Database } from "../db/index.ts";
import { Code, DataPlaneError } from "../util.ts";

// Parameter validation
function validateThreadParams(above: number, below: number) {
  if (!Number.isInteger(above) || above < 0 || above > 100) {
    throw new Error("Invalid above: must be an integer between 0 and 100");
  }

  if (!Number.isInteger(below) || below < 0 || below > 100) {
    throw new Error("Invalid below: must be an integer between 0 and 100");
  }
}

// Helper function to get descendants (child replies going down the thread)
async function getDescendants(
  db: Database,
  parentUri: string,
  maxDepth: number,
): Promise<string[]> {
  const descendants: string[] = [];
  const visited = new Set<string>();

  // Use BFS to traverse descendants
  const queue: Array<{ uri: string; depth: number }> = [{
    uri: parentUri,
    depth: 0,
  }];

  while (queue.length > 0) {
    const { uri: currentUri, depth } = queue.shift()!;

    if (depth >= maxDepth || visited.has(currentUri)) {
      continue;
    }

    visited.add(currentUri);

    // Find all replies to this post/reply
    const replies = await db.models.Reply.find({
      "reply.parent.uri": currentUri,
    })
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
      // Verify the original post exists and is a root post (posts can't have ancestors)
      const originalPost = await this.db.models.Post.findOne({ uri: postUri });

      if (!originalPost) {
        throw new DataPlaneError(Code.NotFound);
      }

      // Posts are always root - they don't have ancestors by design
      // So we only get descendants (replies)
      const descendants = await getDescendants(this.db, postUri, below);

      // The thread is just the root post + all its descendant replies
      const uris = [
        postUri, // The original post (always root)
        ...descendants,
      ];

      // Remove duplicates while preserving order
      const uniqueUris = Array.from(new Set(uris));

      return {
        uris: uniqueUris,
        meta: {
          ancestorCount: 0, // Posts never have ancestors
          descendantCount: descendants.length,
          totalCount: uniqueUris.length,
        },
      };
    } catch (error) {
      console.error("Error fetching thread:", error);
      throw new DataPlaneError(Code.InternalError);
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
      const originalPost = await this.db.models.Post.findOne({ uri: postUri });

      if (!originalPost) {
        throw new DataPlaneError(Code.NotFound);
      }

      // Posts don't have ancestors - they are always roots
      const ancestors: Array<{ uri: string; depth: number }> = [];

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

        // Find replies to this post/reply
        const replies = await this.db.models.Reply.find({
          "reply.parent.uri": currentUri,
        })
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
          isRoot: true, // Posts are always roots
        },
        ancestors, // Always empty for posts
        descendants,
        meta: {
          ancestorCount: 0, // Posts never have ancestors
          descendantCount: descendants.length,
          maxAncestorDepth: 0, // Posts never have ancestors
          maxDescendantDepth: descendants.length > 0
            ? Math.max(...descendants.map((d) => d.depth))
            : 0,
        },
      };
    } catch (error) {
      console.error("Error fetching thread structure:", error);
      throw new DataPlaneError(Code.InternalError);
    }
  }

  // New method: Get thread starting from a reply (if needed for UI purposes)
  // This would find the root post and then build the full thread
  async getThreadFromReply(replyUri: string, below: number = 50) {
    validateThreadParams(0, below); // No ancestors needed

    try {
      // Find the reply
      const reply = await this.db.models.Reply.findOne({ uri: replyUri });

      if (!reply) {
        throw new DataPlaneError(Code.NotFound);
      }

      // Walk up to find the root post
      let currentUri = replyUri;
      let rootUri: string | null = null;

      // Keep going up until we find a post (not a reply)
      while (rootUri === null) {
        const currentReply = await this.db.models.Reply.findOne({
          uri: currentUri,
        });

        if (!currentReply || !currentReply.reply?.parent?.uri) {
          // This shouldn't happen if data integrity is maintained
          throw new DataPlaneError(Code.NotFound);
        }

        const parentUri = currentReply.reply.parent.uri;

        // Check if parent is a post (root) or another reply
        const parentPost = await this.db.models.Post.findOne({
          uri: parentUri,
        });

        if (parentPost) {
          rootUri = parentUri;
        } else {
          // Parent is another reply, keep going up
          currentUri = parentUri;
        }
      }

      // Now get the full thread starting from the root post
      return this.getThread(rootUri, 0, below);
    } catch (error) {
      console.error("Error fetching thread from reply:", error);
      throw new Error("Failed to fetch thread from reply");
    }
  }
}
