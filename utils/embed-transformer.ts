import type * as SoSprkEmbedImages from "../lex/types/so/sprk/embed/images.ts";
import {
  EmbedImage,
  PostEmbed,
  VideoMappingDocument,
} from "../data-plane/server/models.ts";
import { env } from "./env.ts";

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
  videoMapping?: VideoMappingDocument | null,
) {
  if (!embed.video) {
    return undefined;
  }

  let playlist: string;
  let thumbnail: string;

  if (videoMapping) {
    playlist = `${env.HLS_CDN_URL}/${videoMapping.bunnyGuid}/playlist.m3u8`;
    thumbnail = `${env.HLS_CDN_URL}/${videoMapping.bunnyGuid}/thumbnail.jpg`;
  } else {
    playlist =
      `${env.VIDEO_CDN_URL}/watch/${authorDid}/${embed.video.ref.$link}/playlist.m3u8`;
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
  videoMapping?: VideoMappingDocument | null,
  options: ImageTransformOptions = {},
) {
  if (!embed) {
    return undefined;
  }

  if (embed.$type === "so.sprk.embed.images") {
    return transformImagesEmbed(embed, authorDid, options);
  }

  if (embed.$type === "so.sprk.embed.video") {
    return transformVideoEmbed(embed, authorDid, videoMapping);
  }

  return undefined;
}
