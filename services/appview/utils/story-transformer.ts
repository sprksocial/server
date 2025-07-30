import type * as SoSprkFeedDefs from "../lexicon/types/so/sprk/feed/defs.ts";
import { Database, StoryDocument } from "../data-plane/server/index.ts";
import { transformEmbed } from "./embed-transformer.ts";
import { createProfileViewBasic } from "./profile-helper.ts";

// Transform DB story to StoryView format
export async function transformStoryToStoryView(
  story: StoryDocument,
  db: Database,
): Promise<SoSprkFeedDefs.StoryView> {
  // Create the author object with stories
  const authorView = await createProfileViewBasic(
    story.authorDid,
    story.authorHandle,
    db,
  );

  const embedView = transformEmbed(story.media, story.authorDid, story.cid, null,{
    firstImageOnly: true,
  });

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
