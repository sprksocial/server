import {
  Main as ImagesMedia,
  View as ImagesMediaView,
} from "../lex/types/so/sprk/media/images.ts";
import {
  Main as VideoMedia,
  View as VideoMediaView,
} from "../lex/types/so/sprk/media/video.ts";
import {
  BlockedPost,
  GeneratorView,
  NotFoundPost,
  PostView,
  ReplyView,
} from "../lex/types/so/sprk/feed/defs.ts";
import { LabelerView } from "../lex/types/so/sprk/labeler/defs.ts";

export type {
  Notification as NotificationView,
} from "../lex/types/so/sprk/notification/listNotifications.ts";

export {
  isMain as isImagesMedia,
  type Main as ImagesMedia,
  type View as ImagesMediaView,
} from "../lex/types/so/sprk/media/images.ts";
export {
  isMain as isVideoMedia,
  type Main as VideoMedia,
  type View as VideoMediaView,
} from "../lex/types/so/sprk/media/video.ts";
export type {
  BlockedPost,
  GeneratorView,
  NotFoundPost,
  PostView,
} from "../lex/types/so/sprk/feed/defs.ts";

export type Media =
  | ImagesMedia
  | VideoMedia;

export type MediaView =
  | ImagesMediaView
  | VideoMediaView;

export type MaybePostView = PostView | ReplyView | NotFoundPost | BlockedPost;

export type RecordMediaViewInternal =
  | GeneratorView
  | LabelerView;
