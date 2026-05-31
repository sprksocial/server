import * as com from "../lex/com.ts";
import * as so from "../lex/so.ts";

export type { $Typed, Un$Typed } from "@atp/lex";

export type ProfileRecord = so.sprk.actor.profile.Main;
export const isProfileRecord = so.sprk.actor.profile.$matches;

export type KnownFollowers = so.sprk.actor.defs.KnownFollowers;
export type ProfileView = so.sprk.actor.defs.ProfileView;
export type ProfileViewBasic = so.sprk.actor.defs.ProfileViewBasic;
export type ProfileViewDetailed = so.sprk.actor.defs.ProfileViewDetailed;
export type ProfileViewer = so.sprk.actor.defs.ViewerState;

export type MentionEmbed = so.sprk.embed.mention.Main;
export type RecordEmbed = so.sprk.embed.record.Main;

export type FeedViewPost = so.sprk.feed.defs.FeedViewPost;
export type KnownLike = so.sprk.feed.defs.KnownLike;
export type KnownReply = so.sprk.feed.defs.KnownReply;
export type KnownRepost = so.sprk.feed.defs.KnownRepost;
export type ReplyRef = so.sprk.feed.defs.ReplyRef;
export type ThreadContext = so.sprk.feed.defs.ThreadContext;
export type ThreadViewPost = so.sprk.feed.defs.ThreadViewPost;
export type BlockedPost = so.sprk.feed.defs.BlockedPost;
export type GeneratorView = so.sprk.feed.defs.GeneratorView;
export type NotFoundPost = so.sprk.feed.defs.NotFoundPost;
export type PostView = so.sprk.feed.defs.PostView;
export type ReplyView = so.sprk.feed.defs.ReplyView;
export const isPostView = so.sprk.feed.defs.postView.$isTypeOf.bind(
  so.sprk.feed.defs.postView,
);
export const isReplyView = so.sprk.feed.defs.replyView.$isTypeOf.bind(
  so.sprk.feed.defs.replyView,
);

export type FeedGenRecord = so.sprk.feed.generator.Main;
export const isFeedGenRecord = so.sprk.feed.generator.$matches;
export type LikeRecord = so.sprk.feed.like.Main;
export type PostRecord = so.sprk.feed.post.Main;
export const isPostRecord = so.sprk.feed.post.$matches;
export type ReplyRecord = so.sprk.feed.reply.Main;
export const isReplyRecord = so.sprk.feed.reply.$matches;
export type RepostRecord = so.sprk.feed.repost.Main;

export type ThreadItem = so.sprk.feed.getPostThread.ThreadItem;
export type GetThreadQueryParams = so.sprk.feed.getPostThread.$Params;

export type FollowRecord = so.sprk.graph.follow.Main;

export type LabelerRecord = so.sprk.labeler.service.Main;
export const isLabelerRecord = so.sprk.labeler.service.$matches;
export type LabelerView = so.sprk.labeler.defs.LabelerView;
export type LabelerViewDetailed = so.sprk.labeler.defs.LabelerViewDetailed;

export type ImageMedia = so.sprk.media.image.Main;
export const isImageMedia = so.sprk.media.image.$matches;
export type ImageView = so.sprk.media.image.View;
export type ImagesMedia = so.sprk.media.images.Main;
export const isImagesMedia = so.sprk.media.images.$matches;
export type ImagesMediaView = so.sprk.media.images.View;
export type VideoMedia = so.sprk.media.video.Main;
export const isVideoMedia = so.sprk.media.video.$matches;
export const isVideoMediaMain = so.sprk.media.video.$matches;
export type VideoMediaView = so.sprk.media.video.View;
export type VideoMediaMainType = so.sprk.media.video.Main;

export type NotificationView =
  so.sprk.notification.listNotifications.Notification;

export type AudioRecord = so.sprk.sound.audio.Main;
export const isAudioRecord = so.sprk.sound.audio.$matches;
export type AudioView = so.sprk.sound.defs.AudioView;

export type StoriesByAuthor = so.sprk.story.defs.StoriesByAuthor;
export type StoryView = so.sprk.story.defs.StoryView;

export type Label = com.atproto.label.defs.Label;
export const isSelfLabels = com.atproto.label.defs.selfLabels.$matches.bind(
  com.atproto.label.defs.selfLabels,
);

export type StrongRef = com.atproto.repo.strongRef.Main;

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
