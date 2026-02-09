import { Document, Model, Schema } from "mongoose";

interface RecordRef {
  uri: string;
  cid: string;
}

// Plugin for adding author DID population to schemas
function addAuthor(schema: Schema) {
  // Only add if schema has authorDid field
  if (schema.paths.authorDid) {
    schema.virtual("actor", {
      ref: "Actor",
      localField: "authorDid",
      foreignField: "did",
      justOne: true,
    });

    // Ensure virtual fields are serialized
    schema.set("toJSON", { virtuals: true });
    schema.set("toObject", { virtuals: true });
  }
}

// Base interface for documents with authorDid
interface AuthoredDocument extends Document {
  uri: string;
  cid: string;
  createdAt: string;
  indexedAt: string;
  authorDid: string;
  actor?: ActorDocument; // Virtual field for populated actor data
}

export const authoredSchema = {
  uri: { type: String, required: true, unique: true, index: true },
  authorDid: { type: String, required: true, index: true },
  cid: { type: String, required: true },
  createdAt: { type: String, required: true },
  indexedAt: { type: String, required: true },
};

export interface MediaRef {
  $type: string;
  ref: { $link: string };
}
export interface ImageMedia extends MediaRef {
  alt: string;
  aspectRatio: {
    width: number;
    height: number;
  };
}
export interface VideoMedia extends MediaRef {
  alt: string;
  aspectRatio: {
    width: number;
    height: number;
  };
}
interface Label {
  src: string;
  uri: string;
  cid: string;
  val: string;
  neg: boolean;
}
interface Facet {
  index: {
    byteStart: number;
    byteEnd: number;
  };
  features: Array<{
    $type: string;
    uri?: string;
    did?: string;
    tag?: string;
  }>;
}
export interface PostMedia {
  $type: string;
  video?: VideoMedia;
  images?: ImageMedia[];
}
export interface StoryMedia {
  $type: string;
  video?: VideoMedia;
  image?: ImageMedia;
}
export interface Caption {
  text: string;
  facets?: Facet[];
}

// records

export interface RecordDocument extends Document {
  uri: string;
  cid: string;
  did: string;
  collectionName: string;
  rkey: string;
  createdAt: string;
  indexedAt: string;
  json: string;
  takenDown: boolean;
  takedownRef: string;
  invalidReplyRoot?: boolean;
}

export interface ArchivedRecordDocument extends Document {
  uri: string;
  cid: string;
  did: string;
  collectionName: string;
  rkey: string;
  createdAt: string;
  indexedAt: string;
  json: string;
  archivedAt: string;
  deleteReason: "user_delete" | "takedown";
  takedownRef?: string;
}
export const recordSchema = new Schema<RecordDocument>({
  uri: { type: String, required: true, unique: true, index: true },
  cid: { type: String, required: true },
  did: { type: String, required: true, index: true },
  collectionName: { type: String, required: true, index: true },
  rkey: { type: String, required: true },
  createdAt: { type: String, required: true },
  indexedAt: { type: String, required: true },
  json: { type: String, required: true },
  takenDown: { type: Boolean, required: false },
  takedownRef: { type: String, required: false },
  invalidReplyRoot: { type: Boolean, required: false },
});

export const archivedRecordSchema = new Schema<ArchivedRecordDocument>({
  uri: { type: String, required: true, unique: true, index: true },
  cid: { type: String, required: true },
  did: { type: String, required: true, index: true },
  collectionName: { type: String, required: true, index: true },
  rkey: { type: String, required: true },
  createdAt: { type: String, required: true },
  indexedAt: { type: String, required: true },
  json: { type: String, required: true },
  archivedAt: { type: String, required: true },
  deleteReason: {
    type: String,
    required: true,
    enum: ["user_delete", "takedown"],
  },
  takedownRef: { type: String, required: false },
})
  .index({ did: 1, collectionName: 1, indexedAt: -1 });

// duplicate records

export interface DuplicateRecordDocument extends Document {
  uri: string;
  cid: string;
  duplicateOf: string;
  indexedAt: string;
}
export const duplicateRecordSchema = new Schema<DuplicateRecordDocument>({
  uri: { type: String, required: true, unique: true, index: true },
  cid: { type: String, required: true },
  duplicateOf: { type: String, required: true, index: true },
  indexedAt: { type: String, required: true },
});

// actor sync

export interface ActorSyncDocument extends Document {
  did: string;
  commitCid: string;
  repoRev: string | null;
}
export const actorSyncSchema = new Schema<ActorSyncDocument>({
  did: { type: String, required: true, unique: true, index: true },
  commitCid: { type: String, required: true },
  repoRev: { type: String, required: false, default: null },
});

// likes

export interface LikeDocument extends AuthoredDocument {
  subject: string;
  subjectCid: string;
  via?: string | null;
  viaCid?: string | null;
}
export const likeSchema = new Schema<LikeDocument>({
  ...authoredSchema,
  subject: { type: String, required: true, index: true },
  subjectCid: { type: String, required: true },
  via: { type: String, required: false },
  viaCid: { type: String, required: false },
})
  .index({ authorDid: 1, subject: 1 }, { unique: true })
  .index({ subject: 1, createdAt: -1 })
  .index({ subject: 1, authorDid: 1 });

// follows

export interface FollowDocument extends AuthoredDocument {
  subject: string;
}
export const followSchema = new Schema<FollowDocument>({
  ...authoredSchema,
  subject: { type: String, required: true, index: true },
})
  .index({ authorDid: 1, subject: 1 }, { unique: true })
  .index({ subject: 1, createdAt: -1 })
  .index({ subject: 1, authorDid: 1 });

// blocks

export interface BlockDocument extends AuthoredDocument {
  subject: string;
}

export const blockSchema = new Schema<BlockDocument>({
  ...authoredSchema,
  subject: { type: String, required: true, index: true },
})
  .index({ authorDid: 1, subject: 1 }, { unique: true })
  .index({ subject: 1, createdAt: -1 })
  .index({ subject: 1, authorDid: 1 });

// profiles

export interface ProfileDocument extends AuthoredDocument {
  displayName?: string;
  description?: string;
  avatar?: MediaRef;
  banner?: MediaRef;
  labels?: Label[];
  pinnedPost?: RecordRef;
  postsCount: number;
  followersCount: number;
  followsCount: number;
}
export const profileSchema = new Schema<ProfileDocument>({
  ...authoredSchema,
  displayName: { type: String, required: false },
  description: { type: String, required: false },
  avatar: { type: Object, required: false },
  banner: { type: Object, required: false },
  labels: { type: [Object], required: false },
  pinnedPost: { type: Object, required: false },
  postsCount: { type: Number, required: true, default: 0 },
  followersCount: { type: Number, required: true, default: 0 },
  followsCount: { type: Number, required: true, default: 0 },
})
  .index({ displayName: "text", description: "text" });

// audio

export interface AudioDocument extends AuthoredDocument {
  sound: MediaRef;
  origin?: RecordRef;
  title: string;
  details?: {
    artist?: string;
    title?: string;
  };
  labels?: Label[];
  useCount: number;
}
export const audioSchema = new Schema<AudioDocument>({
  ...authoredSchema,
  sound: { type: Object, required: true },
  origin: { type: Object, required: false },
  title: { type: String, required: true },
  details: { type: Object, required: false },
  labels: { type: [Object], required: false },
  useCount: { type: Number, required: true, default: 0 },
})
  .index({ authorDid: 1, createdAt: -1 })
  .index({ useCount: -1, createdAt: -1 });

// reposts

export interface RepostDocument extends AuthoredDocument {
  subject: string;
  subjectCid: string;
  via?: string | null;
  viaCid?: string | null;
}
export const repostSchema = new Schema<RepostDocument>({
  ...authoredSchema,
  subject: { type: String, required: true },
  subjectCid: { type: String, required: true },
  via: { type: String, required: false },
  viaCid: { type: String, required: false },
})
  .index({ subject: 1, createdAt: -1 })
  .index({ authorDid: 1, createdAt: -1 })
  .index({ subject: 1, authorDid: 1 });

// posts

export interface PostDocument extends AuthoredDocument {
  caption?: Caption;
  media?: PostMedia;
  sound?: RecordRef;
  langs?: string[];
  labels?: Label[];
  tags?: string[];
  likeCount: number;
  replyCount: number;
  repostCount: number;
}
export const postSchema = new Schema<PostDocument>({
  ...authoredSchema,
  caption: {
    type: {
      text: { type: String, required: true },
      facets: { type: [Object], required: false, default: [] },
    },
    required: false,
  },
  media: { type: Object, required: false },
  sound: {
    type: {
      uri: { type: String, required: true },
      cid: { type: String, required: true },
    },
    required: false,
  },
  langs: { type: [String], required: false, default: [] },
  labels: { type: [Object], required: false, default: [] },
  tags: { type: [String], required: false, default: [] },
  likeCount: { type: Number, required: true, default: 0 },
  replyCount: { type: Number, required: true, default: 0 },
  repostCount: { type: Number, required: true, default: 0 },
})
  .index({ authorDid: 1, createdAt: -1 })
  .index({ tags: 1, createdAt: -1 });

// replies

export interface ReplyDocument extends AuthoredDocument {
  text?: string;
  facets?: Facet[];
  reply?: {
    root: RecordRef;
    parent: RecordRef;
  };
  media?: ImageMedia;
  langs?: string[];
  labels?: Label[];
  likeCount: number;
  replyCount: number;
}
export const replySchema = new Schema<ReplyDocument>({
  ...authoredSchema,
  text: { type: String, required: false },
  facets: { type: [Object], required: false, default: [] },
  reply: {
    type: {
      root: {
        uri: { type: String, required: true },
        cid: { type: String, required: true },
      },
      parent: {
        uri: { type: String, required: true },
        cid: { type: String, required: true },
      },
    },
    required: false,
  },
  media: { type: Object, required: false },
  langs: { type: [String], required: false, default: [] },
  labels: { type: [Object], required: false, default: [] },
  likeCount: { type: Number, required: true, default: 0 },
  replyCount: { type: Number, required: true, default: 0 },
})
  .index({ reply: 1, createdAt: -1 })
  .index({ "reply.parent.uri": 1, authorDid: 1 })
  .index({ "reply.root.uri": 1, createdAt: -1 });

// stories

export interface StoryDocument extends AuthoredDocument {
  media: StoryMedia;
  sound?: RecordRef;
  labels?: Label[];
}
export const storySchema = new Schema<StoryDocument>({
  ...authoredSchema,
  media: { type: Object, required: true },
  sound: {
    type: {
      uri: { type: String, required: true },
      cid: { type: String, required: true },
    },
    required: false,
  },
  labels: { type: [Object], required: false, default: [] },
})
  .index({ authorDid: 1, createdAt: -1 });

// generators

export interface GeneratorDocument extends AuthoredDocument {
  displayName: string;
  description?: string;
  descriptionFacets?: Facet[];
  avatar?: MediaRef;
  acceptsInteractions?: boolean;
  labels?: Label[];
  likeCount: number;
}
export const generatorSchema = new Schema<GeneratorDocument>({
  ...authoredSchema,
  displayName: { type: String, required: true },
  description: { type: String, required: false },
  descriptionFacets: { type: [Object], required: false },
  avatar: { type: Object, required: false },
  acceptsInteractions: { type: Boolean, required: false },
  labels: { type: [Object], required: false },
  likeCount: { type: Number, required: false, default: 0 },
})
  .index({ authorDid: 1, createdAt: -1 });

// labelers

export interface LabelerDocument extends AuthoredDocument {}

export const labelerSchema = new Schema<LabelerDocument>({
  ...authoredSchema,
})
  .index({ authorDid: 1, createdAt: -1 });

// labels

export interface LabelDocument extends Document {
  src: string;
  uri: string;
  cid: string;
  val: string;
  neg: boolean;
  cts: string;
  exp: string | null;
}

export const labelSchema = new Schema<LabelDocument>({
  src: { type: String, required: true, index: true },
  uri: { type: String, required: true, index: true },
  cid: { type: String, required: true },
  val: { type: String, required: true, index: true },
  neg: { type: Boolean, required: true },
  cts: { type: String, required: true },
  exp: { type: String, required: false, default: null },
})
  .index({ uri: 1, src: 1, val: 1 }, { unique: true })
  .index({ src: 1, cts: -1 });

// takedowns

export interface TakedownDocument extends Document {
  targetUri: string;
  targetCid: string;
  reason: string;
  takenDownBy: string;
  takenDownAt: string;
  ref: string | null;
  applied: boolean;
}
export const takedownSchema = new Schema<TakedownDocument>({
  targetUri: { type: String, required: true, unique: true, index: true },
  targetCid: { type: String, required: true },
  reason: { type: String, required: true },
  takenDownBy: { type: String, required: true },
  takenDownAt: { type: String, required: true },
  ref: { type: String, required: false },
  applied: { type: Boolean, required: true, default: false },
});

// repo takedowns

export interface RepoTakedownDocument extends Document {
  did: string;
  reason: string;
  takenDownBy: string;
  takenDownAt: string;
  ref: string | null;
  applied: boolean;
}
export const repoTakedownSchema = new Schema<RepoTakedownDocument>({
  did: { type: String, required: true, unique: true, index: true },
  reason: { type: String, required: true },
  takenDownBy: { type: String, required: true },
  takenDownAt: { type: String, required: true },
  ref: { type: String, required: false, default: null },
  applied: { type: Boolean, required: true, default: false },
});

// blobs takedowns

export interface BlobTakedownDocument extends Document {
  did: string;
  cid: string;
  reason: string;
  takenDownBy: string;
  takenDownAt: string;
  ref: string | null;
  applied: boolean;
}
export const blobTakedownSchema = new Schema<BlobTakedownDocument>({
  did: { type: String, required: true, index: true },
  cid: { type: String, required: true, index: true },
  reason: { type: String, required: true },
  takenDownBy: { type: String, required: true },
  takenDownAt: { type: String, required: true },
  ref: { type: String, required: false, default: null },
  applied: { type: Boolean, required: true, default: false },
})
  .index({ did: 1, cid: 1 }, { unique: true });

// actors

export interface ActorDocument extends Document {
  did: string;
  handle: string | null;
  indexedAt: string;
  takedownRef: string | null;
  upstreamStatus: string | null;
  keys: string[];
  services: string;
  lastSeenNotifs: string | null;
}
export const actorSchema = new Schema<ActorDocument>({
  did: { type: String, required: true, unique: true, index: true },
  handle: { type: String, required: false, index: true },
  indexedAt: { type: String, required: true },
  takedownRef: { type: String, required: false },
  upstreamStatus: { type: String, required: false },
  keys: { type: [String], required: true },
  services: { type: String, required: true },
  lastSeenNotifs: { type: String, required: false, default: null },
});

// preferences

export interface PreferenceDocument extends Document {
  userDid: string;
  contentLabelPrefs?: Array<{
    labelerDid?: string;
    label: string;
    visibility: string;
  }>;
  savedFeeds?: Array<{
    id: string;
    type: string;
    value: string;
    pinned: boolean;
  }>;
  personalDetailsPref?: {
    birthDate?: string;
  };
  feedViewPrefs?: Array<{
    feed: string;
    hideReplies?: boolean;
    hideRepliesByUnfollowed: boolean;
    hideRepliesByLikeCount?: number;
    hideReposts?: boolean;
    hideQuotePosts?: boolean;
  }>;
  threadViewPref?: {
    sort?: string;
  };
  interestsPref?: {
    tags: string[];
  };
  mutedWordsPref?: {
    items: Array<{
      id?: string;
      value: string;
      targets: string[];
      actorTarget: string;
      expiresAt?: string;
    }>;
  };
  hiddenPostsPref?: {
    items: string[];
  };
  labelersPref?: {
    labelers: Array<{
      did: string;
    }>;
  };
  postInteractionSettingsPref?: {
    threadgateAllowRules?: Array<{
      $type: string;
      [key: string]: unknown;
    }>;
  };
  createdAt: string;
  updatedAt: string;
}
export const preferenceSchema = new Schema<PreferenceDocument>({
  userDid: { type: String, required: true, unique: true, index: true },
  contentLabelPrefs: { type: [Object], required: false },
  savedFeeds: { type: [Object], required: false },
  personalDetailsPref: { type: Object, required: false },
  feedViewPrefs: { type: [Object], required: false },
  threadViewPref: { type: Object, required: false },
  interestsPref: { type: Object, required: false },
  mutedWordsPref: { type: Object, required: false },
  hiddenPostsPref: { type: Object, required: false },
  labelersPref: { type: Object, required: false },
  postInteractionSettingsPref: { type: Object, required: false },
  createdAt: { type: String, required: true },
  updatedAt: { type: String, required: true },
});

// cursor state

export interface CursorStateDocument extends Document {
  identifier: string; // To ensure a single document, e.g., 'last_processed_cursor'
  cursorValue: number;
  updatedAt: Date;
}
export const cursorStateSchema = new Schema<CursorStateDocument>({
  identifier: { type: String, required: true, unique: true, index: true },
  cursorValue: { type: Number, required: true },
  updatedAt: { type: Date, default: Date.now },
});

// notifications

export interface NotificationDocument extends Document {
  did: string;
  recordUri: string;
  recordCid: string;
  author: string;
  reason: string;
  reasonSubject: string | null;
  sortAt: string;
}
export const notificationSchema = new Schema<NotificationDocument>({
  did: { type: String, required: true, index: true },
  recordUri: { type: String, required: true, index: true },
  recordCid: { type: String, required: true },
  author: { type: String, required: true, index: true },
  reason: { type: String, required: true },
  reasonSubject: { type: String, required: false, default: null },
  sortAt: { type: String, required: true, index: true },
})
  .index({ did: 1, sortAt: -1 })
  .index({ did: 1, reason: 1, sortAt: -1 });

// push tokens

export interface PushTokenDocument extends Document {
  did: string;
  token: string;
  platform: "ios" | "android" | "web";
  appId: string;
  serviceDid: string;
  createdAt: string;
  updatedAt: string;
}
export const pushTokenSchema = new Schema<PushTokenDocument>({
  did: { type: String, required: true, index: true },
  token: { type: String, required: true },
  platform: { type: String, required: true, enum: ["ios", "android", "web"] },
  appId: { type: String, required: true },
  serviceDid: { type: String, required: true },
  createdAt: { type: String, required: true },
  updatedAt: { type: String, required: true },
})
  .index({ did: 1, token: 1, platform: 1, appId: 1 }, { unique: true });

// Apply plugin to schemas that extend AuthoredDocument
([
  profileSchema,
  likeSchema,
  postSchema,
  replySchema,
  repostSchema,
  followSchema,
  blockSchema,
  generatorSchema,
  audioSchema,
  storySchema,
  labelerSchema,
] as Schema[]).forEach((s) => s.plugin(addAuthor));

export interface DatabaseModels {
  Record: Model<RecordDocument>;
  ArchivedRecord: Model<ArchivedRecordDocument>;
  DuplicateRecord: Model<DuplicateRecordDocument>;
  Like: Model<LikeDocument>;
  Post: Model<PostDocument>;
  Reply: Model<ReplyDocument>;
  Story: Model<StoryDocument>;
  Follow: Model<FollowDocument>;
  Block: Model<BlockDocument>;
  Profile: Model<ProfileDocument>;
  Audio: Model<AudioDocument>;
  Repost: Model<RepostDocument>;
  Generator: Model<GeneratorDocument>;
  Labeler: Model<LabelerDocument>;
  Label: Model<LabelDocument>;
  Takedown: Model<TakedownDocument>;
  RepoTakedown: Model<RepoTakedownDocument>;
  BlobTakedown: Model<BlobTakedownDocument>;
  Actor: Model<ActorDocument>;
  ActorSync: Model<ActorSyncDocument>;
  Preference: Model<PreferenceDocument>;
  CursorState: Model<CursorStateDocument>;
  Notification: Model<NotificationDocument>;
  PushToken: Model<PushTokenDocument>;
}
