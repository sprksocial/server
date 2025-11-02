import type * as SoSprkMediaImage from "../lex/types/so/sprk/media/image.ts";
import {
  ImageMedia,
  PostMedia,
  StoryMedia,
  VideoMappingDocument,
} from "../data-plane/db/models.ts";
import { ServerConfig } from "../config.ts";

interface ImageTransformOptions {
  /** If true, only return the first image (useful for stories) */
  firstImageOnly?: boolean;
}

export function transformImagesMedia(
  media: PostMedia,
  authorDid: string,
  options: ImageTransformOptions = {},
) {
  const { firstImageOnly = false } = options;

  if (!media.images) {
    return undefined;
  }

  const imagesToProcess = firstImageOnly
    ? [media.images[0]].filter(Boolean)
    : media.images;

  return {
    $type: "so.sprk.media.images#view",
    images: imagesToProcess.map(
      (img: ImageMedia): SoSprkMediaImage.View => ({
        thumb:
          `https://media.sprk.so/img/medium/${authorDid}/${img.ref.$link}/webp`,
        fullsize:
          `https://media.sprk.so/img/full/${authorDid}/${img.ref.$link}/webp`,
        alt: img.alt ?? "",
        aspectRatio: img.aspectRatio || undefined,
      }),
    ),
  } as const;
}

export function transformVideoMedia(
  media: PostMedia,
  authorDid: string,
  cfg: ServerConfig,
  videoMapping?: VideoMappingDocument | null,
  isStory = false,
) {
  if (!media.video) {
    return undefined;
  }

  let playlist: string;
  let thumbnail: string;

  if (videoMapping) {
    playlist = `${cfg.hlsCdn}/${videoMapping.bunnyGuid}/playlist.m3u8`;
    thumbnail = `${cfg.hlsCdn}/${videoMapping.bunnyGuid}/thumbnail.jpg`;
  } else if (isStory) {
    playlist =
      `https://media.sprk.so/video/${authorDid}/${media.video.ref.$link}`;
    thumbnail =
      `https://thumb.sprk.so/${authorDid}/${media.video.ref.$link}/thumbnail`;
  } else {
    playlist =
      `${cfg.videoCdn}/watch/${authorDid}/${media.video.ref.$link}/playlist.m3u8`;
    thumbnail =
      `https://thumb.sprk.so/${authorDid}/${media.video.ref.$link}/thumbnail`;
  }

  return {
    $type: "so.sprk.media.video#view",
    cid: media.video.ref.$link,
    alt: media.video.alt,
    playlist,
    thumbnail,
  } as const;
}

export function transformMedia(
  media: PostMedia | StoryMedia | undefined,
  authorDid: string,
  cfg: ServerConfig,
  videoMapping?: VideoMappingDocument | null,
  options: ImageTransformOptions = {},
  isStory = false,
) {
  if (!media) {
    return undefined;
  }

  if (media.$type === "so.sprk.media.images") {
    return transformImagesMedia(media as PostMedia, authorDid, options);
  }

  if (media.$type === "so.sprk.media.image") {
    // Handle single image (used in stories and replies)
    const singleImageMedia = media as StoryMedia;
    if (!singleImageMedia.image) {
      return undefined;
    }

    return {
      $type: "so.sprk.media.image#view",
      thumb:
        `https://media.sprk.so/img/medium/${authorDid}/${singleImageMedia.image.ref.$link}/webp`,
      fullsize:
        `https://media.sprk.so/img/full/${authorDid}/${singleImageMedia.image.ref.$link}/webp`,
      alt: singleImageMedia.image.alt ?? "",
      aspectRatio: singleImageMedia.image.aspectRatio || undefined,
    } as const;
  }

  if (media.$type === "so.sprk.media.video") {
    return transformVideoMedia(
      media as PostMedia,
      authorDid,
      cfg,
      videoMapping,
      isStory,
    );
  }

  return undefined;
}
