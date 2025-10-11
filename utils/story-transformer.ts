import type * as SoSprkFeedDefs from "../lex/types/so/sprk/feed/defs.ts";
import { StoryDocument } from "../data-plane/db/models.ts";
import { transformEmbed } from "./embed-transformer.ts";
import { createProfileViewBasic } from "./profile-helper.ts";
import { AppContext } from "../context.ts";

// Transform DB story to StoryView format
export async function transformStoryToStoryView(
  story: StoryDocument,
  ctx: AppContext,
): Promise<SoSprkFeedDefs.StoryView> {
  // Create the author object with stories
  const authorView = await createProfileViewBasic(
    story.authorDid,
    ctx,
  );

  const embedView = transformEmbed(story.media, story.authorDid, null, {
    firstImageOnly: true,
  }, true);

  return {
    uri: story.uri,
    cid: story.cid,
    author: authorView,
    media: embedView,
    record: {
      media: story.media,
      sound: story.sound,
      labels: story.labels,
      tags: story.tags,
      createdAt: story.createdAt,
    },
    indexedAt: story.indexedAt,
  };
}

// Batch transform DB stories to StoryView format for optimal performance
export async function transformStoriesToStoryViews(
  stories: StoryDocument[],
  ctx: AppContext,
): Promise<SoSprkFeedDefs.StoryView[]> {
  if (stories.length === 0) {
    return [];
  }

  // Get unique author DIDs
  const authorDids = [...new Set(stories.map((s) => s.authorDid))];

  // Batch fetch all author profiles
  const authors = await Promise.all(
    authorDids.map((did) => createProfileViewBasic(did, ctx)),
  );

  // Create author map for quick lookup
  const authorsMap = new Map(authors.map((author) => [author.did, author]));

  // Transform all stories in parallel
  return stories.map((story) => {
    const authorView = authorsMap.get(story.authorDid)!;

    const embedView = transformEmbed(story.media, story.authorDid, null, {
      firstImageOnly: true,
    }, true);

    return {
      uri: story.uri,
      cid: story.cid,
      author: authorView,
      media: embedView,
      record: {
        media: story.media,
        sound: story.sound,
        labels: story.labels,
        tags: story.tags,
        createdAt: story.createdAt,
      },
      indexedAt: story.indexedAt,
    };
  });
}
