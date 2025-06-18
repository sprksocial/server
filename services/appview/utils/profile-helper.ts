import { Database } from "../data-plane/server/index.ts";
import type { ProfileViewBasic } from "../lexicon/types/so/sprk/actor/defs.ts";
import type * as ComAtprotoRepoStrongRef from "../lexicon/types/com/atproto/repo/strongRef.ts";
import type { StoryDocument } from "../data-plane/server/index.ts";

// Helper function to create ProfileViewBasic with stories
export async function createProfileViewBasic(
  authorDid: string,
  authorHandle: string,
  db: Database,
  includeStories: boolean = true,
): Promise<ProfileViewBasic> {
  // Get author profile data
  const profile = await db.models.Profile.findOne({
    authorDid: authorDid,
  }).lean();

  let stories: ComAtprotoRepoStrongRef.Main[] = [];

  // Only fetch stories if requested
  if (includeStories) {
    // Fetch recent stories for this author (within 24 hours)
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

    try {
      const recentStories = await db.models.Story.find({
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

  return {
    did: authorDid,
    handle: authorHandle,
    displayName: profile?.displayName ?? authorHandle,
    avatar: profile?.avatar?.ref?.$link
      ? `https://media.sprk.so/avatar/tiny/${authorDid}/${profile.avatar.ref.$link}/webp`
      : undefined,
    stories: stories.length > 0 ? stories : undefined,
  };
}
