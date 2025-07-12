import type * as SoSprkEmbedImages from "../lexicon/types/so/sprk/embed/images.ts";
import { EmbedImage, PostEmbed } from "../data-plane/server/index.ts";

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
  cid: string,
) {
  if (!embed.video) {
    return undefined;
  }
  return {
    $type: "so.sprk.embed.video#view",
    cid,
    alt: embed.alt,
    playlist:
      `https://media.sprk.so/video/${authorDid}/${embed.video.ref.$link}`,
    thumbnail:
      `https://thumb.sprk.so/${authorDid}/${embed.video.ref.$link}/thumbnail`,
  } as const;
}

export function transformEmbed(
  embed: PostEmbed | null,
  authorDid: string,
  cid: string,
  options: ImageTransformOptions = {},
) {
  if (!embed) {
    return undefined;
  }

  if (embed.$type === "so.sprk.embed.images") {
    return transformImagesEmbed(embed, authorDid, options);
  }

  if (embed.$type === "so.sprk.embed.video") {
    return transformVideoEmbed(embed, authorDid, cid);
  }

  return undefined;
}
