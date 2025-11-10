import { Document, Model, Schema } from "mongoose";

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
});

export interface FollowDocument extends AuthoredDocument {
  subject: string;
}

export const followSchema = new Schema<FollowDocument>({
  ...authoredSchema,
  subject: { type: String, required: true, index: true },
});

export interface BlockDocument extends AuthoredDocument {
  subject: string;
}

export const blockSchema = new Schema<BlockDocument>({
  ...authoredSchema,
  subject: { type: String, required: true, index: true },
});

interface RecordRef {
  uri: string;
  cid: string;
}

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
});

// Add text index for profile search
profileSchema.index({
  displayName: "text",
  description: "text",
});

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
});

export interface RepostDocument extends AuthoredDocument {
  subject: RecordRef;
  via?: string | null;
  viaCid?: string | null;
}

export const repostSchema = new Schema<RepostDocument>({
  ...authoredSchema,
  subject: { type: Object, required: true },
  via: { type: String, required: false },
  viaCid: { type: String, required: false },
});

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
});

// Compound indexes for more efficient queries
postSchema.index({ authorDid: 1, createdAt: -1 });
postSchema.index({ tags: 1, createdAt: -1 });

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
});

replySchema.index({ reply: 1, createdAt: -1 });

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
});

storySchema.index({ authorDid: 1, createdAt: -1 });
storySchema.index({ tags: 1, createdAt: -1 });

followSchema.index({ authorDid: 1, subject: 1 });
followSchema.index({ subject: 1, createdAt: -1 });
followSchema.index({ type: 1, createdAt: -1 });

blockSchema.index({ authorDid: 1, subject: 1 });
blockSchema.index({ subject: 1, createdAt: -1 });

audioSchema.index({ authorDid: 1, createdAt: -1 });
audioSchema.index({ useCount: -1, createdAt: -1 });
repostSchema.index({ authorDid: 1, createdAt: -1 });
repostSchema.index({ "subject.uri": 1, createdAt: -1 });

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
});

// Add compound indexes for Generator
generatorSchema.index({ authorDid: 1, createdAt: -1 });

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

// Repository takedown schema
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

// Blob takedown schema
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
});

// Ensure compound index on did + cid for blob takedowns
blobTakedownSchema.index({ did: 1, cid: 1 }, { unique: true });

export interface ActorDocument extends Document {
  did: string;
  handle: string | null;
  indexedAt: string;
  takedownRef: string | null;
  upstreamStatus: string | null;
  keys: string[];
  services: string;
}

export const actorSchema = new Schema<ActorDocument>({
  did: { type: String, required: true, unique: true, index: true },
  handle: { type: String, required: false, index: true },
  indexedAt: { type: String, required: true },
  takedownRef: { type: String, required: false },
  upstreamStatus: { type: String, required: false },
  keys: { type: [String], required: true },
  services: { type: String, required: true },
});

type SavedFeed = {
  id: string;
  type: "feed" | "list" | "timeline";
  value: string;
  pinned: boolean;
};

export interface UserPreferenceDocument extends Document {
  userDid: string;
  savedFeeds: SavedFeed[];
  createdAt: string;
  updatedAt: string;
}

export const userPreferenceSchema = new Schema<UserPreferenceDocument>({
  userDid: { type: String, required: true, unique: true, index: true },
  savedFeeds: { type: [Object], required: true },
  createdAt: { type: String, required: true },
  updatedAt: { type: String, required: true },
});

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
] as Schema[]).forEach((s) => s.plugin(addAuthor));

export interface DatabaseModels {
  Record: Model<RecordDocument>;
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
  Takedown: Model<TakedownDocument>;
  RepoTakedown: Model<RepoTakedownDocument>;
  BlobTakedown: Model<BlobTakedownDocument>;
  Actor: Model<ActorDocument>;
  ActorSync: Model<ActorSyncDocument>;
  UserPreference: Model<UserPreferenceDocument>;
  CursorState: Model<CursorStateDocument>;
}
