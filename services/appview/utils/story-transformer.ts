import type * as SoSprkFeedDefs from "../lexicon/types/so/sprk/feed/defs.ts";
import { StoryDocument } from "../data-plane/server/models.ts";
import { transformEmbed } from "./embed-transformer.ts";
import { createProfileViewBasic } from "./profile-helper.ts";
import { AppContext } from "../main.ts";

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

  const embedView = transformEmbed(story.media, story.authorDid, story.cid, {
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
