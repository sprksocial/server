import type * as SoSprkFeedDefs from '../../../../lexicon/types/so/sprk/feed/defs.ts'
import { OutputSchema as GetStoriesView } from '../../../../lexicon/types/so/sprk/feed/getStories.ts'
import { Server } from '../../../../lexicon/index.ts'
import { AppContext } from '../../../../main.ts'
import { Database } from '../../../../services/data-plane/server/index.ts'
import { transformStoryToStoryView } from '../../../../utils/story-transformer.ts'

// Function to fetch stories by URIs
async function getStories(
  uris: string | string[],
  db: Database,
): Promise<SoSprkFeedDefs.StoryView[]> {
  if (!uris) {
    return [];
  }

  const uriArray = Array.isArray(uris) ? uris : [uris];

  if (uriArray.length === 0) {
    return [];
  }

  const dbStories = await db.models.Story.find({
    uri: { $in: uriArray },
  }).lean();

  // Transform each story to StoryView format
  const storyViews = await Promise.all(
    dbStories.map((story) => transformStoryToStoryView(story, db)),
  );

  return storyViews;
}

export default function (server: Server, ctx: AppContext) {
  server.so.sprk.feed.getStories({
    auth: ctx.authVerifier.standardOptional,
    handler: async ({ params }) => {
      const { uris } = params;

      if (!uris || uris.length === 0) {
        return {
          encoding: "application/json",
          body: { stories: [] } as GetStoriesView,
        };
      }

      const stories = await getStories(uris, ctx.db);

      return {
        encoding: "application/json",
        body: { stories } as GetStoriesView,
      };
    },
  });
}
