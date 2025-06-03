import { Context, Next } from "hono";
import { TakedownService } from "./takedown.ts";
import lodash from "lodash";
import * as SoSprkFeedDefs from "../lexicon/types/so/sprk/feed/defs.ts";
const { get } = lodash;

/**
 * Middleware that filters out taken-down content from responses
 * This is meant to be applied to routes that return content
 * that might have been taken down by admins
 */
export const takedownFilterMiddleware = async (c: Context, next: Next) => {
  // Skip filtering if user is an admin
  const isAdmin = c.get("isAdmin") as boolean | undefined;
  if (isAdmin) {
    await next();
    return;
  }

  await next();

  const contentType = c.res.headers.get("Content-Type");
  if (!contentType || !contentType.includes("application/json")) {
    return;
  }

  try {
    // Get the takedown service from context
    const takedownService = c.env.takedownService as TakedownService;

    const body = await c.res.json();

    const targetDid = body.did ||
      body.user?.did ||
      body.actor?.did ||
      body.profile?.did ||
      body.subject?.did;
    if (targetDid) {
      const repoTakedown = await takedownService.getRepoTakedown(targetDid);
      if (repoTakedown?.applied) {
        // For specific user/profile views, return minimal placeholder
        if (body.did && body.$type && body.$type.includes("profileView")) {
          const takenDownProfile = {
            $type: body.$type,
            did: body.did,
            handle: body.handle || "unavailable",
            moderation: {
              takenDown: true,
            },
          };
          c.res = new Response(JSON.stringify(takenDownProfile), {
            status: c.res.status,
            headers: c.res.headers,
          });
          return;
        } else {
          // For other single-user responses, null out or minimize the content
          c.res = new Response(
            JSON.stringify({
              error: "Content unavailable - repository has been taken down",
              code: 404,
            }),
            {
              status: 404,
              headers: c.res.headers,
            },
          );
          return;
        }
      }
    }

    // Continue with specific content type filtering
    if (body.posts && Array.isArray(body.posts)) {
      const filteredPosts = await filterTakenDownItems(
        body.posts,
        takedownService,
        "uri",
      );
      body.posts = filteredPosts;
    } else if (body.feed && Array.isArray(body.feed)) {
      const filteredFeed = await filterTakenDownItems(
        body.feed,
        takedownService,
        "post.uri",
      );
      body.feed = filteredFeed;
    } else if (body.thread && body.thread.post) {
      const takedown = await takedownService.getTakedown(body.thread.post.uri);
      const isThreadTakenDown = takedown?.applied ?? false;

      // Also check if the thread author repo is taken down
      let isAuthorTakenDown = false;
      if (body.thread.post.author?.did) {
        const repoTakedown = await takedownService.getRepoTakedown(
          body.thread.post.author.did,
        );
        isAuthorTakenDown = repoTakedown?.applied ?? false;
      }

      if (isThreadTakenDown || isAuthorTakenDown) {
        body.thread = null;
      } else if (body.thread.replies) {
        body.thread.replies = await filterReplies(
          body.thread.replies,
          takedownService,
        );
      }
    }

    // If there are user profiles in the response, filter out taken down repositories
    if (body.profiles && Array.isArray(body.profiles)) {
      const filteredProfiles = await filterTakenDownRepos(
        body.profiles,
        takedownService,
      );
      body.profiles = filteredProfiles;
    } else if (body.profile) {
      if (body.profile.did) {
        const repoTakedown = await takedownService.getRepoTakedown(
          body.profile.did,
        );
        if (repoTakedown?.applied) {
          body.profile = null;
        }
      }
    } else if (body.did && body.$type && body.$type.includes("profileView")) {
      // For direct ProfileViewDetailed objects (so.sprk.actor.getProfile)
      const repoTakedown = await takedownService.getRepoTakedown(body.did);
      if (repoTakedown?.applied) {
        // Return a minimal placeholder object for taken-down profiles
        const takenDownProfile = {
          $type: body.$type,
          did: body.did,
          handle: body.handle || "unavailable",
          moderation: {
            takenDown: true,
          },
        };

        // Create a new response with the placeholder instead of trying to modify body
        c.res = new Response(JSON.stringify(takenDownProfile), {
          status: c.res.status,
          headers: c.res.headers,
        });

        // Skip the rest of the processing
        return;
      }
    } else if (body.subject) {
      // For followers/follows response that has a subject profile
      if (body.subject.did) {
        const repoTakedown = await takedownService.getRepoTakedown(
          body.subject.did,
        );
        if (repoTakedown?.applied) {
          // Keep minimal info about the profile but mark it as taken down
          body.subject = {
            $type: body.subject.$type,
            did: body.subject.did,
            handle: body.subject.handle || "unavailable",
            moderation: {
              takenDown: true,
            },
          };
        }
      }

      // Also filter any followers/follows list
      if (body.followers && Array.isArray(body.followers)) {
        body.followers = await filterTakenDownRepos(
          body.followers,
          takedownService,
        );
      }

      if (body.follows && Array.isArray(body.follows)) {
        body.follows = await filterTakenDownRepos(
          body.follows,
          takedownService,
        );
      }
    }

    // Set the filtered response
    c.res = new Response(JSON.stringify(body), {
      status: c.res.status,
      headers: c.res.headers,
    });
  } catch (error) {
    // In case of error, just continue with the original response
    console.error("Error in takedown filter middleware:", error);
  }
};

// Helper function to filter out taken down items
async function filterTakenDownItems(
  items: (SoSprkFeedDefs.PostView | SoSprkFeedDefs.FeedViewPost)[],
  takedownService: TakedownService,
  uriPath: string,
) {
  if (!items || items.length === 0) {
    return items;
  }

  const filteredItems: (SoSprkFeedDefs.PostView | SoSprkFeedDefs.FeedViewPost)[] = [];

  for (const item of items) {
    let isTakenDown = false;

    // Get URI for this specific content
    const uri = get(item, uriPath) as string | undefined;
    if (uri) {
      const takedown = await takedownService.getTakedown(uri);
      isTakenDown = takedown?.applied ?? false;
    }

    // Check if author's repo is taken down
    let isAuthorTakenDown = false;
    // Look for author DID in common locations
    const authorDid = get(item, "author.did") ||
      get(item, "post.author.did") ||
      get(item, "user.did") ||
      get(item, "actor.did");

    if (authorDid) {
      const repoTakedown = await takedownService.getRepoTakedown(authorDid);
      isAuthorTakenDown = repoTakedown?.applied ?? false;
    }

    // Keep the item only if neither the content nor the author is taken down
    if (!isTakenDown && !isAuthorTakenDown) {
      filteredItems.push(item);
    }
  }

  return filteredItems;
}

// Helper function to filter out taken down repositories
async function filterTakenDownRepos(
  profiles: { $type: string; did: string; handle?: string }[],
  takedownService: TakedownService,
): Promise<{ $type: string; did: string; handle?: string; moderation?: { takenDown: boolean } }[]> {
  if (!profiles || !Array.isArray(profiles)) return profiles;

  const filteredProfiles: { $type: string; did: string; handle?: string; moderation?: { takenDown: boolean } }[] = [];

  for (const profile of profiles) {
    if (profile.did) {
      const repoTakedown = await takedownService.getRepoTakedown(profile.did);
      if (!repoTakedown?.applied) {
        filteredProfiles.push(profile);
      } else {
        // For UI consistency, push a minimal placeholder for taken-down profiles
        // if they need to be represented in lists (follows, followers, etc.)
        filteredProfiles.push({
          $type: profile.$type,
          did: profile.did,
          handle: profile.handle || "unavailable",
          moderation: {
            takenDown: true,
          },
        });
      }
    } else {
      // If no DID, keep the profile
      filteredProfiles.push(profile);
    }
  }

  return filteredProfiles;
}

// Helper function to filter out taken down blobs/images
async function filterTakenDownBlobs(
  images: { cid?: string; did?: string }[],
  takedownService: TakedownService,
): Promise<{ cid?: string; did?: string }[]> {
  if (!images || !Array.isArray(images)) return images;

  const filteredImages: { cid?: string; did?: string }[] = [];

  for (const image of images) {
    // Check if the image is taken down based on blob CID
    if (image.cid && image.did) {
      const blobTakedown = await takedownService.getBlobTakedown(
        image.did,
        image.cid,
      );
      if (!blobTakedown?.applied) {
        filteredImages.push(image);
      }
    } else {
      // If no CID or DID, keep the image
      filteredImages.push(image);
    }
  }

  return filteredImages;
}

type ReplyType = {
  post?: { uri: string; author?: { did: string }; embed?: { images?: { cid?: string; did?: string }[] } };
  replies?: ReplyType[];
};

async function filterReplies(
  replies: ReplyType[],
  takedownService: TakedownService,
): Promise<ReplyType[]> {
  if (!replies || !Array.isArray(replies)) return replies;

  const filteredReplies: ReplyType[] = [];

  for (const reply of replies) {
    if (reply.post && reply.post.uri) {
      const takedown = await takedownService.getTakedown(reply.post.uri);
      const isTakenDown = takedown?.applied ?? false;

      // Check if author's repo is taken down
      let isAuthorTakenDown = false;
      if (reply.post.author?.did) {
        const repoTakedown = await takedownService.getRepoTakedown(
          reply.post.author.did,
        );
        isAuthorTakenDown = repoTakedown?.applied ?? false;
      }

      if (!isTakenDown && !isAuthorTakenDown) {
        // If this reply has nested replies, filter those too
        if (reply.replies && Array.isArray(reply.replies)) {
          reply.replies = await filterReplies(reply.replies, takedownService);
        }

        // Filter out taken down images in the post
        if (
          reply.post.embed?.images &&
          Array.isArray(reply.post.embed.images)
        ) {
          reply.post.embed.images = await filterTakenDownBlobs(
            reply.post.embed.images,
            takedownService,
          );
        }

        filteredReplies.push(reply);
      }
    } else {
      // If no post or URI, keep the reply
      filteredReplies.push(reply);
    }
  }

  return filteredReplies;
}
