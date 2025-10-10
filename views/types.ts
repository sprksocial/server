import {
  Main as ImagesEmbed,
  View as ImagesEmbedView,
} from "../lex/types/so/sprk/embed/images.ts";
import {
  Main as VideoEmbed,
  View as VideoEmbedView,
} from "../lex/types/so/sprk/embed/video.ts";
import {
  BlockedPost,
  GeneratorView,
  NotFoundPost,
  PostView,
} from "../lex/types/so/sprk/feed/defs.ts";
import { LabelerView } from "../lex/types/app/bsky/labeler/defs.ts";

export type {
  Main as ImagesEmbed,
  View as ImagesEmbedView,
} from "../lex/types/so/sprk/embed/images.ts";
export { isMain as isImagesEmbed } from "../lex/types/so/sprk/embed/images.ts";
export type {
  Main as VideoEmbed,
  View as VideoEmbedView,
} from "../lex/types/so/sprk/embed/video.ts";
export { isMain as isVideoEmbed } from "../lex/types/so/sprk/embed/video.ts";
export type {
  BlockedPost,
  GeneratorView,
  NotFoundPost,
  PostView,
} from "../lex/types/so/sprk/feed/defs.ts";

export type Embed =
  | ImagesEmbed
  | VideoEmbed;

export type EmbedView =
  | ImagesEmbedView
  | VideoEmbedView;

export type MaybePostView = PostView | NotFoundPost | BlockedPost;

export type RecordEmbedViewInternal =
  | GeneratorView
  | LabelerView;
