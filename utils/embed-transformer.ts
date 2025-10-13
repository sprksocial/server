import type * as SoSprkEmbedImages from "../lex/types/so/sprk/embed/images.ts";
import {
  EmbedImage,
  PostEmbed,
  VideoMappingDocument,
} from "../data-plane/db/models.ts";
import { ServerConfig } from "../config.ts";

interface ImageTransformOptions {
  /** If true, only return the first image (useful for stories) */
  firstImageOnly?: boolean;
}

export function transformImagesEmbed(
  embed: PostEmbed,
  authorDid: string,
  options: ImageTransformOptions = {},
) {
  const { firstImageOnly = false } = options;

  if (!embed.images) {
    return undefined;
  }

  const imagesToProcess = firstImageOnly
    ? [embed.images[0]].filter(Boolean)
    : embed.images;

  return {
    $type: "so.sprk.embed.images#view",
    images: imagesToProcess.map(
      (img: EmbedImage): SoSprkEmbedImages.ViewImage => ({
        thumb:
          `https://media.sprk.so/img/medium/${authorDid}/${img.image.ref.$link}/webp`,
        fullsize:
          `https://media.sprk.so/img/full/${authorDid}/${img.image.ref.$link}/webp`,
        alt: img.alt ?? "",
        aspectRatio: img.aspectRatio || undefined,
      }),
    ),
  } as const;
}

export function transformVideoEmbed(
  embed: PostEmbed,
  authorDid: string,
  cfg: ServerConfig,
  videoMapping?: VideoMappingDocument | null,
  isStory = false,
) {
  if (!embed.video) {
    return undefined;
  }

  let playlist: string;
  let thumbnail: string;

  if (videoMapping) {
    playlist = `${cfg.hlsCdn}/${videoMapping.bunnyGuid}/playlist.m3u8`;
    thumbnail = `${cfg.hlsCdn}/${videoMapping.bunnyGuid}/thumbnail.jpg`;
  } else if (isStory) {
    playlist =
      `https://media.sprk.so/video/${authorDid}/${embed.video.ref.$link}`;
    thumbnail =
      `https://thumb.sprk.so/${authorDid}/${embed.video.ref.$link}/thumbnail`;
  } else {
    playlist =
      `${cfg.videoCdn}/watch/${authorDid}/${embed.video.ref.$link}/playlist.m3u8`;
    thumbnail =
      `https://thumb.sprk.so/${authorDid}/${embed.video.ref.$link}/thumbnail`;
  }

  return {
    $type: "so.sprk.embed.video#view",
    cid: embed.video.ref.$link,
    alt: embed.alt,
    playlist,
    thumbnail,
  } as const;
}

export function transformEmbed(
  embed: PostEmbed | null,
  authorDid: string,
  cfg: ServerConfig,
  videoMapping?: VideoMappingDocument | null,
  options: ImageTransformOptions = {},
  isStory = false,
) {
  if (!embed) {
    return undefined;
  }

  if (embed.$type === "so.sprk.embed.images") {
    return transformImagesEmbed(embed, authorDid, options);
  }

  if (embed.$type === "so.sprk.embed.video") {
    return transformVideoEmbed(
      embed,
      authorDid,
      cfg,
      videoMapping,
      isStory,
    );
  }

  return undefined;
}
