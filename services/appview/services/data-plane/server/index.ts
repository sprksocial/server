import mongoose, { Connection, Document, Model, Schema } from "mongoose";
import { pino } from "pino";
import { IdResolver, MemoryCache } from "@atproto/identity";
import { env } from "../../../utils/env.ts";
import { DataPlaneClient, GetIdentityByDidResponse } from "../client/index.ts";
import { DidDocument } from "@atproto/identity";
import { Buffer } from "node:buffer";
import { Timestamp } from "npm:@bufbuild/protobuf@1.5.0";

const HOUR = 60e3 * 60;
const DAY = HOUR * 24;

const getDid = (doc: DidDocument) => doc.id
const getHandle = (doc: DidDocument) => doc.alsoKnownAs?.find(aka => aka.startsWith('at://'))?.replace('at://', '')

const getResultFromDoc = (doc: DidDocument) => {
  const keys: Record<string, { Type: string; PublicKeyMultibase: string }> = {}
  doc.verificationMethod?.forEach((method) => {
    const id = method.id.split('#').at(1)
    if (!id) return
    keys[id] = {
      Type: method.type,
      PublicKeyMultibase: method.publicKeyMultibase || '',
    }
  })
  const services: Record<string, { Type: string; URL: string }> = {}
  doc.service?.forEach((service) => {
    const id = service.id.split('#').at(1)
    if (!id) return
    if (typeof service.serviceEndpoint !== 'string') return
    services[id] = {
      Type: service.type,
      URL: service.serviceEndpoint,
    }
  })
  return {
    did: getDid(doc),
    handle: getHandle(doc),
    keys: Buffer.from(JSON.stringify(keys)),
    services: Buffer.from(JSON.stringify(services)),
    updated: Timestamp.fromDate(new Date()),
  }
}

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

export interface LikeDocument extends Document {
  uri: string;
  subject: string;
  subjectCid: string;
  authorDid: string;
  authorHandle: string;
  createdAt: string;
  indexedAt: string;
  cid: string;
}

export const likeSchema = new Schema<LikeDocument>({
  uri: { type: String, required: true, unique: true, index: true },
  subject: { type: String, required: true, index: true },
  subjectCid: { type: String, required: true },
  authorDid: { type: String, required: true, index: true },
  authorHandle: { type: String, required: true },
  createdAt: { type: String, required: true },
  indexedAt: { type: String, required: true },
  cid: { type: String, required: true },
});

export interface LookDocument extends Document {
  uri: string;
  subject: string;
  subjectCid: string;
  authorDid: string;
  authorHandle: string;
  createdAt: string;
  indexedAt: string;
  cid: string;
}

export const lookSchema = new Schema<LookDocument>({
  uri: { type: String, required: true, unique: true, index: true },
  subject: { type: String, required: true, index: true },
  subjectCid: { type: String, required: true },
  authorDid: { type: String, required: true, index: true },
  authorHandle: { type: String, required: true },
  createdAt: { type: String, required: true },
  indexedAt: { type: String, required: true },
  cid: { type: String, required: true },
});

export interface FollowDocument extends Document {
  uri: string;
  subject: string;
  authorDid: string;
  authorHandle: string;
  createdAt: string;
  indexedAt: string;
  cid: string;
  type: "sprk" | "bsky";
}

export const followSchema = new Schema<FollowDocument>({
  uri: { type: String, required: true, unique: true, index: true },
  subject: { type: String, required: true, index: true },
  authorDid: { type: String, required: true, index: true },
  authorHandle: { type: String, required: true },
  createdAt: { type: String, required: true },
  indexedAt: { type: String, required: true },
  cid: { type: String, required: true },
  type: {
    type: String,
    required: true,
    enum: ["sprk", "bsky"],
    index: true,
    default: "sprk",
  },
});

export interface BlockDocument extends Document {
  uri: string;
  subject: string;
  authorDid: string;
  authorHandle: string;
  createdAt: string;
  indexedAt: string;
  cid: string;
}

export const blockSchema = new Schema<BlockDocument>({
  uri: { type: String, required: true, unique: true, index: true },
  subject: { type: String, required: true, index: true },
  authorDid: { type: String, required: true, index: true },
  authorHandle: { type: String, required: true },
  createdAt: { type: String, required: true },
  indexedAt: { type: String, required: true },
  cid: { type: String, required: true },
});

interface PinnedPost {
  uri: string;
  cid: string;
}

export interface ProfileDocument extends Document {
  uri: string;
  displayName?: string;
  description?: string;
  avatar?: MediaRef;
  banner?: MediaRef;
  labels?: Label[];
  pinnedPost?: PinnedPost;
  authorDid: string;
  authorHandle: string;
  createdAt: string;
  indexedAt: string;
  cid: string;
}

export const profileSchema = new Schema<ProfileDocument>({
  uri: { type: String, required: true, unique: true, index: true },
  displayName: { type: String, required: false },
  description: { type: String, required: false },
  avatar: { type: Object, required: false },
  banner: { type: Object, required: false },
  labels: { type: Object, required: false },
  pinnedPost: { type: Object, required: false },
  authorDid: { type: String, required: true, index: true },
  authorHandle: { type: String, required: true },
  createdAt: { type: String, required: true },
  indexedAt: { type: String, required: true },
  cid: { type: String, required: true },
});

// Add text index for profile search
profileSchema.index({
  displayName: "text",
  authorHandle: "text",
  description: "text",
});

export interface AudioDocument extends Document {
  uri: string;
  sound: string;
  origin: {
    uri: string;
    cid: string;
  };
  title?: string;
  text?: string;
  labels?: PostLabel[];
  authorDid: string;
  authorHandle: string;
  createdAt: string;
  indexedAt: string;
  cid: string;
}

export const audioSchema = new Schema<AudioDocument>({
  uri: { type: String, required: true, unique: true, index: true },
  sound: { type: String, required: true },
  origin: {
    uri: { type: String, required: true },
    cid: { type: String, required: true },
  },
  title: { type: String, required: false },
  text: { type: String, required: false },
  labels: { type: Object, required: false },
  authorDid: { type: String, required: true, index: true },
  authorHandle: { type: String, required: true },
  createdAt: { type: String, required: true },
  indexedAt: { type: String, required: true },
  cid: { type: String, required: true },
});

export interface RepostDocument extends Document {
  uri: string;
  subject: {
    uri: string;
    cid: string;
  };
  authorDid: string;
  authorHandle: string;
  createdAt: string;
  indexedAt: string;
  cid: string;
}

export const repostSchema = new Schema<RepostDocument>({
  uri: { type: String, required: true, unique: true, index: true },
  subject: {
    uri: { type: String, required: true },
    cid: { type: String, required: true },
  },
  authorDid: { type: String, required: true, index: true },
  authorHandle: { type: String, required: true },
  createdAt: { type: String, required: true },
  indexedAt: { type: String, required: true },
  cid: { type: String, required: true },
});

export interface MusicDocument extends Document {
  uri: string;
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
  labels?: PostLabel[];
  tags?: string[];
  authorDid: string;
  authorHandle: string;
  createdAt: string;
  indexedAt: string;
  cid: string;
}

export const musicSchema = new Schema<MusicDocument>({
  uri: { type: String, required: true, unique: true, index: true },
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
  authorDid: { type: String, required: true, index: true },
  authorHandle: { type: String, required: true },
  createdAt: { type: String, required: true },
  indexedAt: { type: String, required: true },
  cid: { type: String, required: true },
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

export interface PostDocument extends Document {
  uri: string;
  text: string;
  facets: Facet[];
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
  langs: string[];
  labels: PostLabel[] | null;
  tags: string[];
  authorDid: string;
  authorHandle: string;
  createdAt: string;
  indexedAt: string;
  cid: string;
}

export const postSchema = new Schema<PostDocument>({
  uri: { type: String, required: true, unique: true, index: true },
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
  authorDid: { type: String, required: true, index: true },
  authorHandle: { type: String, required: true },
  createdAt: { type: String, required: true },
  indexedAt: { type: String, required: true },
  cid: { type: String, required: true },
});

// Compound indexes for more efficient queries
postSchema.index({ authorDid: 1, createdAt: -1 });
postSchema.index({ tags: 1, createdAt: -1 });

export interface StoryDocument extends Document {
  uri: string;
  media: PostEmbed | null;
  sound: {
    uri: string;
    cid: string;
  } | null;
  labels: PostLabel[] | null;
  tags: string[];
  authorDid: string;
  authorHandle: string;
  createdAt: string;
  indexedAt: string;
  cid: string;
}

export const storySchema = new Schema<StoryDocument>({
  uri: { type: String, required: true, unique: true, index: true },
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
  authorDid: { type: String, required: true, index: true },
  authorHandle: { type: String, required: true },
  createdAt: { type: String, required: true },
  indexedAt: { type: String, required: true },
  cid: { type: String, required: true },
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

interface PostLabel {
  src: string;
  uri: string;
  cid: string;
  val: string;
  neg: boolean;
}

export interface GeneratorDocument extends Document {
  uri: string;
  did: string;
  displayName: string;
  description?: string;
  descriptionFacets?: Facet[];
  avatar?: string;
  acceptsInteractions?: boolean;
  labels?: PostLabel[];
  contentMode?: string;
  authorDid: string;
  authorHandle: string;
  createdAt: string;
  indexedAt: string;
  cid: string;
}

export const generatorSchema = new Schema<GeneratorDocument>({
  uri: { type: String, required: true, unique: true, index: true },
  did: { type: String, required: true, index: true },
  displayName: { type: String, required: true },
  description: { type: String, required: false },
  descriptionFacets: { type: [Object], required: false },
  avatar: { type: String, required: false },
  acceptsInteractions: { type: Boolean, required: false },
  labels: { type: Object, required: false },
  contentMode: { type: String, required: false },
  authorDid: { type: String, required: true, index: true },
  authorHandle: { type: String, required: true },
  createdAt: { type: String, required: true },
  indexedAt: { type: String, required: true },
  cid: { type: String, required: true },
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
  did: { type: String, required: true },
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

export interface DatabaseModels {
  Like: Model<LikeDocument>;
  Post: Model<PostDocument>;
  Story: Model<StoryDocument>;
  Follow: Model<FollowDocument>;
  Block: Model<BlockDocument>;
  Profile: Model<ProfileDocument>;
  Audio: Model<AudioDocument>;
  Repost: Model<RepostDocument>;
  Music: Model<MusicDocument>;
  Look: Model<LookDocument>;
  Generator: Model<GeneratorDocument>;
  Takedown: Model<TakedownDocument>;
  RepoTakedown: Model<RepoTakedownDocument>;
  BlobTakedown: Model<BlobTakedownDocument>;
  Actor: Model<ActorDocument>;
  UserPreference: Model<UserPreferenceDocument>;
}

export class Database implements DataPlaneClient {
  private connection!: Connection;
  public models!: DatabaseModels;
  private logger = pino({ name: "database" });
  public idResolver: IdResolver;

  constructor() {
    this.idResolver = new IdResolver({
      didCache: new MemoryCache(HOUR, DAY),
    });
  }

  async connect(): Promise<void> {
    const { DB_URI, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } = env;

    const uri = DB_URI ||
      `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/?appName=appview`;

    this.logger.info(
      DB_URI
        ? `Connecting to MongoDB using provided URI`
        : `Connecting to MongoDB at ${DB_HOST}:${DB_PORT}/?appName=appview`,
    );

    try {
      this.connection = await mongoose.createConnection(uri, {
        autoIndex: true,
        autoCreate: true,
        dbName: DB_NAME,
      });

      // Initialize models
      this.models = {
        Like: this.connection.model<LikeDocument>("Like", likeSchema),
        Post: this.connection.model<PostDocument>("Post", postSchema),
        Story: this.connection.model<StoryDocument>("Story", storySchema),
        Follow: this.connection.model<FollowDocument>("Follow", followSchema),
        Block: this.connection.model<BlockDocument>("Block", blockSchema),
        Profile: this.connection.model<ProfileDocument>(
          "Profile",
          profileSchema,
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
        UserPreference: this.connection.model<UserPreferenceDocument>(
          "UserPreference",
          userPreferenceSchema,
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
}
