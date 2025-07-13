import mongoose, { Connection, Document, Model, Schema } from "mongoose";
import { pino } from "pino";
import { IdResolver, MemoryCache } from "@atproto/identity";
import { env } from "../../utils/env.ts";
import { DataPlaneClient, GetIdentityByDidResponse } from "../client/index.ts";
import { DidDocument } from "@atproto/identity";
import { Buffer } from "node:buffer";
import { Timestamp } from "npm:@bufbuild/protobuf@1.5.0";

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

const HOUR = 60e3 * 60;
const DAY = HOUR * 24;

const getDid = (doc: DidDocument) => doc.id;
const getHandle = (doc: DidDocument) =>
  doc.alsoKnownAs?.find((aka) => aka.startsWith("at://"))?.replace("at://", "");

const getResultFromDoc = (doc: DidDocument) => {
  const keys: Record<string, { Type: string; PublicKeyMultibase: string }> = {};
  doc.verificationMethod?.forEach((method) => {
    const id = method.id.split("#").at(1);
    if (!id) return;
    keys[id] = {
      Type: method.type,
      PublicKeyMultibase: method.publicKeyMultibase || "",
    };
  });
  const services: Record<string, { Type: string; URL: string }> = {};
  doc.service?.forEach((service) => {
    const id = service.id.split("#").at(1);
    if (!id) return;
    if (typeof service.serviceEndpoint !== "string") return;
    services[id] = {
      Type: service.type,
      URL: service.serviceEndpoint,
    };
  });
  return {
    did: getDid(doc),
    handle: getHandle(doc),
    keys: Buffer.from(JSON.stringify(keys)),
    services: Buffer.from(JSON.stringify(services)),
    updated: Timestamp.fromDate(new Date()),
  };
};

export interface MediaRef {
  $type: string;
  ref: { $link: string };
}

export interface EmbedImage {
  alt: string;
  image: MediaRef;
  aspectRatio: {
    width: number;
    height: number;
  };
}

export interface EmbedVideo extends MediaRef {
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

export interface RecordDocument extends Document {
  uri: string;
  cid: string;
  did: string;
  collectionName: string;
  rkey: string;
  createdAt: string;
  indexedAt: string;
  json?: string;
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
  json: { type: String, required: false },
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

export interface LookDocument extends AuthoredDocument {
  subject: string;
  subjectCid: string;
  cid: string;
}

export const lookSchema = new Schema<LookDocument>({
  ...authoredSchema,
  subject: { type: String, required: true, index: true },
  subjectCid: { type: String, required: true },
});

export interface FollowDocument extends AuthoredDocument {
  subject: string;
  type: "sprk" | "bsky";
}

export const followSchema = new Schema<FollowDocument>({
  ...authoredSchema,
  subject: { type: String, required: true, index: true },
  type: {
    type: String,
    required: true,
    enum: ["sprk", "bsky"],
    index: true,
    default: "sprk",
  },
});

export interface BlockDocument extends AuthoredDocument {
  subject: string;
}

export const blockSchema = new Schema<BlockDocument>({
  ...authoredSchema,
  subject: { type: String, required: true, index: true },
});

interface PinnedPost {
  uri: string;
  cid: string;
}

export interface ProfileDocument extends AuthoredDocument {
  displayName?: string;
  description?: string;
  avatar?: MediaRef;
  banner?: MediaRef;
  labels?: Label[];
  pinnedPost?: PinnedPost;
}

export const profileSchema = new Schema<ProfileDocument>({
  ...authoredSchema,
  displayName: { type: String, required: false },
  description: { type: String, required: false },
  avatar: { type: Object, required: false },
  banner: { type: Object, required: false },
  labels: { type: Object, required: false },
  pinnedPost: { type: Object, required: false },
});

// Add text index for profile search
profileSchema.index({
  displayName: "text",
  description: "text",
});

export interface ProfileAggDocument extends Document {
  did: string;
  postsCount: number;
}

export const profileAggSchema = new Schema<ProfileAggDocument>({
  did: { type: String, required: true, unique: true, index: true },
  postsCount: { type: Number, required: true, default: 0 },
});

export interface AudioDocument extends AuthoredDocument {
  sound: string;
  origin: {
    uri: string;
    cid: string;
  };
  title?: string;
  text?: string;
  labels?: Label[];
}

export const audioSchema = new Schema<AudioDocument>({
  ...authoredSchema,
  sound: { type: String, required: true },
  origin: {
    uri: { type: String, required: true },
    cid: { type: String, required: true },
  },
  title: { type: String, required: false },
  text: { type: String, required: false },
  labels: { type: Object, required: false },
});

export interface RepostDocument extends AuthoredDocument {
  subject: {
    uri: string;
    cid: string;
  };
  via?: string | null;
  viaCid?: string | null;
}

export const repostSchema = new Schema<RepostDocument>({
  ...authoredSchema,
  subject: {
    uri: { type: String, required: true },
    cid: { type: String, required: true },
  },
  via: { type: String, required: false },
  viaCid: { type: String, required: false },
});

export interface MusicDocument extends AuthoredDocument {
  sound: string;
  title: string;
  author: string;
  releaseDate: string;
  album?: string;
  recordLabel?: string;
  cover?: string;
  text?: string;
  copyright?: string[];
  facets?: Facet[];
  labels?: Label[];
  tags?: string[];
}

export const musicSchema = new Schema<MusicDocument>({
  ...authoredSchema,
  sound: { type: String, required: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  releaseDate: { type: String, required: true },
  album: { type: String, required: false },
  recordLabel: { type: String, required: false },
  cover: { type: String, required: false },
  text: { type: String, required: false },
  copyright: { type: [String], required: false },
  facets: { type: [Object], required: false },
  labels: { type: Object, required: false },
  tags: { type: [String], required: false },
});

export interface PostEmbed {
  $type: string;
  record?: {
    uri: string;
    cid: string;
  };
  alt?: string;
  video?: EmbedVideo;
  images?: Array<EmbedImage>;
  external?: {
    uri: string;
    title: string;
    description: string;
    thumb?: MediaRef;
  };
  recordWithMedia?: {
    record: {
      uri: string;
      cid: string;
    };
    media: {
      $type: string;
      images?: Array<{
        alt: string;
        image: MediaRef;
      }>;
    };
  };
}

export interface PostDocument extends AuthoredDocument {
  text?: string;
  facets?: Facet[];
  reply: {
    root: {
      uri: string;
      cid: string;
    };
    parent: {
      uri: string;
      cid: string;
    };
  } | null;
  embed: PostEmbed | null;
  sound: {
    uri: string;
    cid: string;
  } | null;
  langs?: string[];
  labels: Label[] | null;
  tags?: string[];
}

export const postSchema = new Schema<PostDocument>({
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
    default: null,
  },
  embed: { type: Object, required: false, default: null },
  sound: {
    type: {
      uri: { type: String, required: true },
      cid: { type: String, required: true },
    },
    required: false,
    default: null,
  },
  langs: { type: [String], required: false, default: [] },
  labels: { type: Object, required: false, default: null },
  tags: { type: [String], required: false, default: [] },
});

// Compound indexes for more efficient queries
postSchema.index({ authorDid: 1, createdAt: -1 });
postSchema.index({ tags: 1, createdAt: -1 });

export interface PostAggDocument extends Document {
  uri: string;
  replyCount: number;
}

export const postAggSchema = new Schema<PostAggDocument>({
  uri: { type: String, required: true, unique: true, index: true },
  replyCount: { type: Number, required: true, default: 0 },
});

export interface StoryDocument extends AuthoredDocument {
  media: PostEmbed | null;
  sound: {
    uri: string;
    cid: string;
  } | null;
  labels: Label[] | null;
  tags: string[];
}

export const storySchema = new Schema<StoryDocument>({
  ...authoredSchema,
  media: { type: Object, required: false, default: null },
  sound: {
    type: {
      uri: { type: String, required: true },
      cid: { type: String, required: true },
    },
    required: false,
    default: null,
  },
  labels: { type: Object, required: false, default: null },
  tags: { type: [String], required: false, default: [] },
});

storySchema.index({ authorDid: 1, createdAt: -1 });
storySchema.index({ tags: 1, createdAt: -1 });

followSchema.index({ authorDid: 1, subject: 1, type: 1 }, { unique: true });
followSchema.index({ subject: 1, createdAt: -1 });
followSchema.index({ type: 1, createdAt: -1 });

blockSchema.index({ authorDid: 1, subject: 1 }, { unique: true });
blockSchema.index({ subject: 1, createdAt: -1 });

audioSchema.index({ authorDid: 1, createdAt: -1 });
repostSchema.index({ authorDid: 1, createdAt: -1 });
repostSchema.index({ "subject.uri": 1, createdAt: -1 });

musicSchema.index({ authorDid: 1, createdAt: -1 });
musicSchema.index({ tags: 1, createdAt: -1 });

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

export interface GeneratorDocument extends AuthoredDocument {
  displayName: string;
  description?: string;
  descriptionFacets?: Facet[];
  avatar?: string;
  acceptsInteractions?: boolean;
  labels?: Label[];
  contentMode?: string;
}

export const generatorSchema = new Schema<GeneratorDocument>({
  ...authoredSchema,
  displayName: { type: String, required: true },
  description: { type: String, required: false },
  descriptionFacets: { type: [Object], required: false },
  avatar: { type: String, required: false },
  acceptsInteractions: { type: Boolean, required: false },
  labels: { type: Object, required: false },
  contentMode: { type: String, required: false },
});

// Add compound indexes for Generator
generatorSchema.index({ authorDid: 1, createdAt: -1 });
generatorSchema.index({ did: 1, createdAt: -1 });

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

// Add compound indexes for Actor
actorSchema.index({ handle: "text" });
actorSchema.index({ did: 1 }, { unique: true });

export interface UserPreferenceDocument extends Document {
  userDid: string;
  followMode: string;
  createdAt: string;
  updatedAt: string;
}

export const userPreferenceSchema = new Schema<UserPreferenceDocument>({
  userDid: { type: String, required: true, unique: true, index: true },
  followMode: {
    type: String,
    required: true,
    enum: ["bsky", "sprk"],
    default: "sprk",
  },
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
  lookSchema,
  postSchema,
  repostSchema,
  followSchema,
  blockSchema,
  generatorSchema,
  audioSchema,
  musicSchema,
  storySchema,
] as Schema[]).forEach((s) => s.plugin(addAuthor));

export interface DatabaseModels {
  Record: Model<RecordDocument>;
  DuplicateRecord: Model<DuplicateRecordDocument>;
  Like: Model<LikeDocument>;
  Post: Model<PostDocument>;
  PostAgg: Model<PostAggDocument>;
  Story: Model<StoryDocument>;
  Follow: Model<FollowDocument>;
  Block: Model<BlockDocument>;
  Profile: Model<ProfileDocument>;
  ProfileAgg: Model<ProfileAggDocument>;
  Audio: Model<AudioDocument>;
  Repost: Model<RepostDocument>;
  Music: Model<MusicDocument>;
  Look: Model<LookDocument>;
  Generator: Model<GeneratorDocument>;
  Takedown: Model<TakedownDocument>;
  RepoTakedown: Model<RepoTakedownDocument>;
  BlobTakedown: Model<BlobTakedownDocument>;
  Actor: Model<ActorDocument>;
  ActorSync: Model<ActorSyncDocument>;
  UserPreference: Model<UserPreferenceDocument>;
  CursorState: Model<CursorStateDocument>;
}

export class Database implements DataPlaneClient {
  private connection!: Connection;
  public models!: DatabaseModels;
  public logger = pino({ name: "database" });
  public idResolver: IdResolver;

  constructor() {
    this.idResolver = new IdResolver({
      didCache: new MemoryCache(HOUR, DAY),
    });
  }

  connect() {
    const { DB_URI, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } = env;

    const uri = DB_URI ||
      `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/?appName=appview`;

    this.logger.info(
      DB_URI
        ? `Connecting to MongoDB using provided URI`
        : `Connecting to MongoDB at ${DB_HOST}:${DB_PORT}/?appName=appview`,
    );

    try {
      this.connection = mongoose.createConnection(uri, {
        autoIndex: true,
        autoCreate: true,
        dbName: DB_NAME,
      });

      // Initialize models
      this.models = {
        Record: this.connection.model<RecordDocument>("Record", recordSchema),
        DuplicateRecord: this.connection.model<DuplicateRecordDocument>(
          "DuplicateRecord",
          duplicateRecordSchema,
        ),
        Like: this.connection.model<LikeDocument>("Like", likeSchema),
        Post: this.connection.model<PostDocument>("Post", postSchema),
        Story: this.connection.model<StoryDocument>("Story", storySchema),
        Follow: this.connection.model<FollowDocument>("Follow", followSchema),
        Block: this.connection.model<BlockDocument>("Block", blockSchema),
        Profile: this.connection.model<ProfileDocument>(
          "Profile",
          profileSchema,
        ),
        ProfileAgg: this.connection.model<ProfileAggDocument>(
          "ProfileAgg",
          profileAggSchema,
        ),
        PostAgg: this.connection.model<PostAggDocument>(
          "PostAgg",
          postAggSchema,
        ),
        Audio: this.connection.model<AudioDocument>("Audio", audioSchema),
        Repost: this.connection.model<RepostDocument>("Repost", repostSchema),
        Music: this.connection.model<MusicDocument>("Music", musicSchema),
        Look: this.connection.model<LookDocument>("Look", lookSchema),
        Generator: this.connection.model<GeneratorDocument>(
          "Generator",
          generatorSchema,
        ),
        Takedown: this.connection.model<TakedownDocument>(
          "Takedown",
          takedownSchema,
        ),
        RepoTakedown: this.connection.model<RepoTakedownDocument>(
          "RepoTakedown",
          repoTakedownSchema,
        ),
        BlobTakedown: this.connection.model<BlobTakedownDocument>(
          "BlobTakedown",
          blobTakedownSchema,
        ),
        Actor: this.connection.model<ActorDocument>("Actor", actorSchema),
        ActorSync: this.connection.model<ActorSyncDocument>(
          "ActorSync",
          actorSyncSchema,
        ),
        UserPreference: this.connection.model<UserPreferenceDocument>(
          "UserPreference",
          userPreferenceSchema,
        ),
        CursorState: this.connection.model<CursorStateDocument>(
          "CursorState",
          cursorStateSchema,
        ),
      };

      this.logger.info("Connected to MongoDB");
    } catch (error) {
      this.logger.error(error, "Failed to connect to MongoDB");
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (this.connection) {
      await this.connection.close();
      this.logger.info("Disconnected from MongoDB");
    }
  }

  // Add methods for DID resolution
  async resolveHandle(handle: string): Promise<string | undefined> {
    try {
      return await this.idResolver.handle.resolve(handle);
    } catch (err) {
      this.logger.error({ err, handle }, "Failed to resolve handle");
      return undefined;
    }
  }

  async resolveDid(
    did: string,
  ): Promise<{ did: string; handle?: string } | undefined> {
    try {
      const data = await this.idResolver.did.resolveAtprotoData(did);
      return {
        did: data.did,
        handle: data.handle,
      };
    } catch (err) {
      this.logger.error({ err, did }, "Failed to resolve DID");
      return undefined;
    }
  }

  // Implement DataPlaneClient interface
  async getIdentityByDid(
    { did }: { did: string },
  ): Promise<GetIdentityByDidResponse> {
    const doc = await this.idResolver.did.resolve(did);
    if (!doc) {
      throw new Error("DID not found");
    }
    return getResultFromDoc(doc);
  }

  async getCursorState(): Promise<number | null> {
    try {
      const cursorState = await this.models.CursorState.findOne({
        identifier: "last_processed_cursor",
      });
      return cursorState?.cursorValue || null;
    } catch (error) {
      this.logger.error({ error }, "Failed to get cursor state");
      return null;
    }
  }

  async saveCursorState(cursorPosition: number): Promise<void> {
    try {
      await this.models.CursorState.findOneAndUpdate(
        { identifier: "last_processed_cursor" },
        {
          cursorValue: cursorPosition,
          updatedAt: new Date(),
        },
        { upsert: true },
      );
    } catch (error) {
      this.logger.error(
        { error, cursorPosition },
        "Failed to save cursor state",
      );
    }
  }
}
