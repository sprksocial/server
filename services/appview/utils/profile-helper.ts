import type {
  ProfileAssociated,
  ProfileView,
  ProfileViewBasic,
  ProfileViewDetailed,
  ViewerState,
} from "../lexicon/types/so/sprk/actor/defs.ts";
import type * as ComAtprotoRepoStrongRef from "../lexicon/types/com/atproto/repo/strongRef.ts";
import type { StoryDocument } from "../data-plane/server/index.ts";
import type { Label } from "../lexicon/types/com/atproto/label/defs.ts";
import { ensureValidDid, isValidHandle } from "@atproto/syntax";
import { AppContext } from "../main.ts";
import { XRPCError } from "@sprk/xrpc-server";

// Helper function to create ProfileViewBasic with stories
export async function createProfileViewBasic(
  authorDid: string,
  ctx: AppContext,
  includeStories: boolean = true,
): Promise<ProfileViewBasic> {
  // Get author profile data
  const profile = await ctx.db.models.Profile.findOne({
    authorDid: authorDid,
  }).lean();
  const actor = await ctx.db.models.Actor.findOne({
    did: authorDid,
  }).lean();
  const authorHandle = actor?.handle ?? "unknown.invalid";

  let stories: ComAtprotoRepoStrongRef.Main[] = [];

  // Only fetch stories if requested
  if (includeStories) {
    // Fetch recent stories for this author (within 24 hours)
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

    try {
      const recentStories = await ctx.db.models.Story.find({
        authorDid: authorDid,
        indexedAt: { $gte: twentyFourHoursAgo.toISOString() },
      })
        .sort({ indexedAt: -1 })
        .limit(15)
        .lean();

      // Convert recent stories to strongRefs
      stories = recentStories.map((story: StoryDocument) => ({
        uri: story.uri,
        cid: story.cid,
      }));
    } catch (error) {
      // If story fetching fails, just continue without stories
      console.warn(`Failed to fetch stories for ${authorDid}:`, error);
    }
  }

  // Safely handle avatar URL construction
  let avatarUrl: string | undefined = undefined;
  try {
    if (
      profile?.avatar && typeof profile.avatar === "object" &&
      profile.avatar.ref && profile.avatar.ref.$link
    ) {
      avatarUrl =
        `https://media.sprk.so/avatar/tiny/${authorDid}/${profile.avatar.ref.$link}/webp`;
    }
  } catch (error) {
    console.warn(`Failed to construct avatar URL for ${authorDid}:`, error);
  }

  return {
    did: authorDid,
    handle: authorHandle || "unknown",
    displayName: profile?.displayName ?? authorHandle ?? "Unknown User",
    avatar: avatarUrl,
    stories: stories.length > 0 ? stories : undefined,
  };
}

export async function getProfileView(
  ctx: AppContext,
  actorDid: string,
  viewerDid?: string,
): Promise<ProfileView> {
  const { db, resolver } = ctx;

  const profile = await db.models.Profile.findOne({ authorDid: actorDid });
  const actor = await db.models.Actor.findOne({ did: actorDid });

  const handle = actor?.handle ??
    (await resolver.resolveDidToHandle(actorDid)) ?? "unknown.invalid";

  const baseView: ProfileView = {
    $type: "so.sprk.actor.defs#profileView",
    did: actorDid,
    handle: handle,
  };

  if (viewerDid) {
    const [following, followedBy] = await Promise.all([
      db.models.Follow.findOne({
        authorDid: viewerDid,
        subject: actorDid,
      }).select("uri").lean(),
      db.models.Follow.findOne({
        authorDid: actorDid,
        subject: viewerDid,
      }).select("uri").lean(),
    ]);

    baseView.viewer = {
      $type: "so.sprk.actor.defs#viewerState",
      following: following?.uri,
      followedBy: followedBy?.uri,
    };
  }

  if (profile) {
    const avatarUrl = profile.avatar?.ref?.$link
      ? `https://media.sprk.so/avatar/tiny/${profile.authorDid}/${profile.avatar.ref.$link}/webp`
      : undefined;

    return {
      ...baseView,
      displayName: profile.displayName,
      description: profile.description,
      avatar: avatarUrl,
      indexedAt: profile.indexedAt,
      createdAt: profile.createdAt,
    };
  }

  return baseView;
}

/**
 * Get a single profile by actor identifier (handle or DID)
 */
export async function getProfile(
  ctx: AppContext,
  actorParam: string,
  viewerDid?: string,
): Promise<ProfileViewDetailed> {
  const profiles = await getProfiles(ctx, [actorParam], viewerDid);

  if (profiles.length === 0) {
    throw new XRPCError(404, "Profile not found", "NotFound");
  }

  return profiles[0];
}

/**
 * Get multiple profiles in parallel by actor identifiers (handles or DIDs)
 */
export async function getProfiles(
  ctx: AppContext,
  actorParams: string[],
  viewerDid?: string,
): Promise<ProfileViewDetailed[]> {
  if (!actorParams || actorParams.length === 0) {
    return [];
  }

  const now = new Date().toISOString();

  // Get viewer preferences once for all profiles if viewer is authenticated
  let viewerFollowMode = "sprk";

  if (viewerDid) {
    const viewerPref = await ctx.db.models.UserPreference.findOne({
      userDid: viewerDid,
    });
    viewerFollowMode = viewerPref?.followMode || "sprk";
  }

  // Helper function to get a single profile data
  const getProfileData = async (
    actorParam: string,
  ): Promise<ProfileViewDetailed | null> => {
    try {
      // Resolve actor identifier to DID
      let actorDidDoc;
      if (isValidHandle(actorParam)) {
        actorDidDoc = await ctx.resolver.resolveHandleToDidDoc(actorParam);
      } else {
        try {
          ensureValidDid(actorParam);
          actorDidDoc = await ctx.resolver.resolveDidToDidDoc(actorParam);
        } catch (_err) {
          return null; // Invalid actor, skip
        }
      }

      const actorDid = actorDidDoc.did;

      // Index the actor
      console.log(`Indexing actor ${actorDid}`);
      await ctx.sub.indexingSvc.indexHandle(actorDid, now);

      // Fetch actor and profile documents in parallel
      const [actorDoc, profile] = await Promise.all([
        ctx.db.models.Actor.findOne({ did: actorDid }),
        ctx.db.models.Profile.findOne({ authorDid: actorDid }),
      ]);

      // If actor doesn't exist, try to index and refetch
      let finalActorDoc = actorDoc;
      let finalProfile = profile;

      if (!actorDoc) {
        try {
          ctx.logger.info(
            { did: actorDid },
            "No actor found, attempting to index",
          );
          await ctx.sub.indexingSvc.indexHandle(actorDid, now, true);

          // Refetch both actor and profile after indexing
          const [refetchedActor, refetchedProfile] = await Promise.all([
            ctx.db.models.Actor.findOne({ did: actorDid }),
            ctx.db.models.Profile.findOne({ authorDid: actorDid }),
          ]);

          finalActorDoc = refetchedActor;
          finalProfile = refetchedProfile;
        } catch (error) {
          ctx.logger.error({ error, did: actorDid }, "Failed to index handle");
          return null;
        }
      }

      if (!finalActorDoc) {
        return null; // Actor not found, skip
      }

      // Handle case where actor exists but profile doesn't
      if (!finalProfile) {
        ctx.logger.info(
          { did: actorDid },
          "Actor found but no profile record, creating basic profile view",
        );

        // Get handle
        const handle = finalActorDoc.handle ||
          (await ctx.resolver.resolveDidToHandle(actorDid));

        // Convert to detailed format with minimal data
        return {
          did: actorDid,
          handle: handle,
        };
      }

      // Get actor's handle and preferences
      const handle = finalActorDoc.handle ||
        (await ctx.resolver.resolveDidToHandle(actorDid));

      const actorPref = await ctx.db.models.UserPreference.findOne({
        userDid: actorDid,
      });
      const actorFollowMode = actorPref?.followMode || "sprk";

      // Twenty-four hours ago for recent stories
      const twentyFourHoursAgo = new Date();
      twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

      const [
        recentStories,
        followersCount,
        followsCount,
        postsCount,
        feedgensCount,
        follow,
        followedBy,
        block,
        blockedBy,
      ] = await Promise.all([
        // Fetch recent stories (within 24 hours)
        ctx.db.models.Story.find({
          authorDid: actorDid,
          indexedAt: { $gte: twentyFourHoursAgo.toISOString() },
        })
          .sort({ indexedAt: -1 })
          .limit(15)
          .lean()
          .catch((error: Error) => {
            ctx.logger.warn(
              { error, actorDid },
              "Failed to fetch stories for profile",
            );
            return [];
          }),

        // Count followers based on actor's follow mode preference
        ctx.db.models.Follow.countDocuments({
          subject: actorDid,
          type: actorFollowMode,
        }),

        // Count follows based on actor's follow mode preference
        ctx.db.models.Follow.countDocuments({
          authorDid: actorDid,
          type: actorFollowMode,
        }),

        // Count posts
        ctx.db.models.Post.countDocuments({
          authorDid: actorDid,
          reply: null,
        }),

        // Check for feed generators
        (async () => {
          try {
            if (ctx.db.models.Generator) {
              return await ctx.db.models.Generator.countDocuments({
                authorDid: actorDid,
              });
            }
            return 0;
          } catch (_error) {
            return 0;
          }
        })(),

        // Viewer state queries (only if viewer is authenticated)
        viewerDid
          ? ctx.db.models.Follow.findOne({
            subject: actorDid,
            authorDid: viewerDid,
            type: viewerFollowMode,
          })
          : Promise.resolve(null),

        viewerDid
          ? ctx.db.models.Follow.findOne({
            subject: viewerDid,
            authorDid: actorDid,
            type: actorFollowMode,
          })
          : Promise.resolve(null),

        viewerDid
          ? ctx.db.models.Block.findOne({
            subject: actorDid,
            authorDid: viewerDid,
          })
          : Promise.resolve(null),

        viewerDid
          ? ctx.db.models.Block.findOne({
            subject: viewerDid,
            authorDid: actorDid,
          })
          : Promise.resolve(null),
      ]);

      // Build viewer state
      const viewer: ViewerState = {};
      if (viewerDid) {
        if (follow) viewer.following = follow.uri;
        if (followedBy) viewer.followedBy = followedBy.uri;
        if (block) viewer.blocking = block.uri;
        if (blockedBy) viewer.blockedBy = true;
      }

      // Build associated services
      const associated: ProfileAssociated = {};
      if (typeof feedgensCount === "number" && feedgensCount > 0) {
        associated.feedgens = feedgensCount;
      }

      // Get avatar and banner URLs safely
      let avatar: string | undefined = undefined;
      let banner: string | undefined = undefined;

      try {
        if (
          finalProfile.avatar && typeof finalProfile.avatar === "object" &&
          finalProfile.avatar.ref && finalProfile.avatar.ref.$link
        ) {
          avatar =
            `https://media.sprk.so/avatar/tiny/${actorDid}/${finalProfile.avatar.ref.$link}/webp`;
        }
      } catch (error) {
        console.warn(`Failed to construct avatar URL for ${actorDid}:`, error);
      }

      try {
        if (
          finalProfile.banner && typeof finalProfile.banner === "object" &&
          finalProfile.banner.ref && finalProfile.banner.ref.$link
        ) {
          banner =
            `https://media.sprk.so/img/tiny/${actorDid}/${finalProfile.banner.ref.$link}/webp`;
        }
      } catch (error) {
        console.warn(`Failed to construct banner URL for ${actorDid}:`, error);
      }

      // Convert labels to the correct type if it exists
      let labels: Label[] | undefined = undefined;
      if (finalProfile.labels) {
        labels = Array.isArray(finalProfile.labels)
          ? (finalProfile.labels as Label[])
          : undefined;
      }

      // Convert pinnedPost to the correct type if it exists
      let pinnedPost: ComAtprotoRepoStrongRef.Main | undefined = undefined;
      if (finalProfile.pinnedPost) {
        pinnedPost = finalProfile
          .pinnedPost as unknown as ComAtprotoRepoStrongRef.Main;
      }

      // Convert recent stories to strongRefs
      const stories: ComAtprotoRepoStrongRef.Main[] =
        Array.isArray(recentStories)
          ? recentStories.map((story: StoryDocument) => ({
            uri: story.uri,
            cid: story.cid,
          }))
          : [];

      // Build the ProfileViewDetailed response
      const profileView: ProfileViewDetailed = {
        did: actorDid,
        handle: handle,
        displayName: finalProfile.displayName,
        description: finalProfile.description,
        avatar,
        banner,
        followersCount: typeof followersCount === "number" ? followersCount : 0,
        followsCount: typeof followsCount === "number" ? followsCount : 0,
        postsCount: typeof postsCount === "number" ? postsCount : 0,
        associated: Object.keys(associated).length > 0 ? associated : undefined,
        indexedAt: finalProfile.indexedAt,
        createdAt: finalProfile.createdAt,
        viewer: Object.keys(viewer).length > 0 ? viewer : undefined,
        labels,
        pinnedPost,
        stories: stories.length > 0 ? stories : undefined,
      };

      return profileView;
    } catch (error) {
      ctx.logger.error({ error, actorParam }, "Failed to get profile");
      return null;
    }
  };

  // Process all profiles in parallel
  const profilePromises = actorParams.map((actorParam) =>
    getProfileData(actorParam)
  );
  const profileResults = await Promise.all(profilePromises);

  // Filter out null results (failed or not found profiles)
  const profiles = profileResults.filter((
    profile,
  ): profile is ProfileViewDetailed => profile !== null);

  return profiles;
}
