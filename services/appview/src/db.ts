import mongoose, { Connection, Document, Model, Schema } from 'mongoose'
import { pino } from 'pino'
import { env } from './env.js'

export interface LikeDocument extends Document {
  uri: string
  subject: string
  subjectCid: string
  authorDid: string
  authorHandle: string
  createdAt: string
  indexedAt: string
  cid: string
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
})

export interface LookDocument extends Document {
  uri: string
  subject: string
  subjectCid: string
  authorDid: string
  authorHandle: string
  createdAt: string
  indexedAt: string
  cid: string
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
})

export interface FollowDocument extends Document {
  uri: string
  subject: string
  authorDid: string
  authorHandle: string
  createdAt: string
  indexedAt: string
  cid: string
}

export const followSchema = new Schema<FollowDocument>({
  uri: { type: String, required: true, unique: true, index: true },
  subject: { type: String, required: true, index: true },
  authorDid: { type: String, required: true, index: true },
  authorHandle: { type: String, required: true },
  createdAt: { type: String, required: true },
  indexedAt: { type: String, required: true },
  cid: { type: String, required: true },
})

export interface BlockDocument extends Document {
  uri: string
  subject: string
  authorDid: string
  authorHandle: string
  createdAt: string
  indexedAt: string
  cid: string
}

export const blockSchema = new Schema<BlockDocument>({
  uri: { type: String, required: true, unique: true, index: true },
  subject: { type: String, required: true, index: true },
  authorDid: { type: String, required: true, index: true },
  authorHandle: { type: String, required: true },
  createdAt: { type: String, required: true },
  indexedAt: { type: String, required: true },
  cid: { type: String, required: true },
})

export interface ProfileDocument extends Document {
  uri: string
  displayName?: string
  description?: string
  avatar?: Record<string, any>
  banner?: Record<string, any>
  labels?: Record<string, any>
  joinedViaStarterPack?: Record<string, any>
  pinnedPost?: Record<string, any>
  authorDid: string
  authorHandle: string
  createdAt: string
  indexedAt: string
  cid: string
}

export const profileSchema = new Schema<ProfileDocument>({
  uri: { type: String, required: true, unique: true, index: true },
  displayName: { type: String, required: false },
  description: { type: String, required: false },
  avatar: { type: Object, required: false },
  banner: { type: Object, required: false },
  labels: { type: Object, required: false },
  joinedViaStarterPack: { type: Object, required: false },
  pinnedPost: { type: Object, required: false },
  authorDid: { type: String, required: true, index: true },
  authorHandle: { type: String, required: true },
  createdAt: { type: String, required: true },
  indexedAt: { type: String, required: true },
  cid: { type: String, required: true },
})

// Add text index for profile search
profileSchema.index({
  displayName: 'text',
  authorHandle: 'text',
  description: 'text',
})

export interface AudioDocument extends Document {
  uri: string
  sound: string
  origin: {
    uri: string
    cid: string
  }
  title?: string
  text?: string
  labels?: Record<string, any>
  authorDid: string
  authorHandle: string
  createdAt: string
  indexedAt: string
  cid: string
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
})

export interface RepostDocument extends Document {
  uri: string
  subject: {
    uri: string
    cid: string
  }
  authorDid: string
  authorHandle: string
  createdAt: string
  indexedAt: string
  cid: string
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
})

export interface MusicDocument extends Document {
  uri: string
  sound: string
  title: string
  author: string
  releaseDate: string
  album?: string
  recordLabel?: string
  cover?: string
  text?: string
  copyright?: string[]
  facets?: Array<Record<string, any>>
  labels?: Record<string, any>
  tags?: string[]
  authorDid: string
  authorHandle: string
  createdAt: string
  indexedAt: string
  cid: string
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
})

export interface PostDocument extends Document {
  uri: string
  text: string
  facets: Array<Record<string, any>>
  reply: {
    root: {
      uri: string
      cid: string
    }
    parent: {
      uri: string
      cid: string
    }
  } | null
  embed: Record<string, any> | null
  sound: {
    uri: string
    cid: string
  } | null
  langs: string[]
  labels: Record<string, any> | null
  tags: string[]
  authorDid: string
  authorHandle: string
  createdAt: string
  indexedAt: string
  cid: string
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
})

// Add compound indexes for more efficient queries
postSchema.index({ authorDid: 1, createdAt: -1 })
postSchema.index({ tags: 1, createdAt: -1 })

// Add compound indexes for new schemas
followSchema.index({ authorDid: 1, subject: 1 }, { unique: true })
followSchema.index({ subject: 1, createdAt: -1 })

blockSchema.index({ authorDid: 1, subject: 1 }, { unique: true })
blockSchema.index({ subject: 1, createdAt: -1 })

audioSchema.index({ authorDid: 1, createdAt: -1 })
repostSchema.index({ authorDid: 1, createdAt: -1 })
repostSchema.index({ 'subject.uri': 1, createdAt: -1 })

musicSchema.index({ authorDid: 1, createdAt: -1 })
musicSchema.index({ tags: 1, createdAt: -1 })

export interface GeneratorDocument extends Document {
  uri: string
  did: string
  displayName: string
  description?: string
  descriptionFacets?: Array<any>
  avatar?: string
  acceptsInteractions?: boolean
  labels?: any
  contentMode?: string
  authorDid: string
  authorHandle: string
  createdAt: string
  indexedAt: string
  cid: string
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
})

// Add compound indexes for Generator
generatorSchema.index({ authorDid: 1, createdAt: -1 })
generatorSchema.index({ did: 1, createdAt: -1 })

export interface TakedownDocument extends Document {
  targetUri: string
  targetCid: string
  reason: string
  takenDownBy: string
  takenDownAt: string
}

export const takedownSchema = new Schema<TakedownDocument>({
  targetUri: { type: String, required: true, unique: true, index: true },
  targetCid: { type: String, required: true },
  reason: { type: String, required: true },
  takenDownBy: { type: String, required: true },
  takenDownAt: { type: String, required: true },
})

// Repository takedown schema
export interface RepoTakedownDocument extends Document {
  did: string
  reason: string
  takenDownBy: string
  takenDownAt: string
  ref: string | null
}

export const repoTakedownSchema = new Schema<RepoTakedownDocument>({
  did: { type: String, required: true, unique: true, index: true },
  reason: { type: String, required: true },
  takenDownBy: { type: String, required: true },
  takenDownAt: { type: String, required: true },
  ref: { type: String, required: false, default: null },
})

// Blob takedown schema
export interface BlobTakedownDocument extends Document {
  did: string
  cid: string
  reason: string
  takenDownBy: string
  takenDownAt: string
  ref: string | null
}

export const blobTakedownSchema = new Schema<BlobTakedownDocument>({
  did: { type: String, required: true, index: true },
  cid: { type: String, required: true, index: true },
  reason: { type: String, required: true },
  takenDownBy: { type: String, required: true },
  takenDownAt: { type: String, required: true },
  ref: { type: String, required: false, default: null },
})

// Ensure compound index on did + cid for blob takedowns
blobTakedownSchema.index({ did: 1, cid: 1 }, { unique: true })

export interface DatabaseModels {
  Like: Model<LikeDocument>
  Post: Model<PostDocument>
  Follow: Model<FollowDocument>
  Block: Model<BlockDocument>
  Profile: Model<ProfileDocument>
  Audio: Model<AudioDocument>
  Repost: Model<RepostDocument>
  Music: Model<MusicDocument>
  Look: Model<LookDocument>
  Generator: Model<GeneratorDocument>
  Takedown: Model<TakedownDocument>
  RepoTakedown: Model<RepoTakedownDocument>
  BlobTakedown: Model<BlobTakedownDocument>
}

export class Database {
  private connection: Connection
  public models: DatabaseModels
  private logger = pino({ name: 'database' })

  constructor() {
    this.connection = mongoose.createConnection()
    this.models = {
      Like: this.connection.model<LikeDocument>('Like', likeSchema),
      Post: this.connection.model<PostDocument>('Post', postSchema),
      Follow: this.connection.model<FollowDocument>('Follow', followSchema),
      Block: this.connection.model<BlockDocument>('Block', blockSchema),
      Profile: this.connection.model<ProfileDocument>('Profile', profileSchema),
      Audio: this.connection.model<AudioDocument>('Audio', audioSchema),
      Repost: this.connection.model<RepostDocument>('Repost', repostSchema),
      Music: this.connection.model<MusicDocument>('Music', musicSchema),
      Look: this.connection.model<LookDocument>('Look', lookSchema),
      Generator: this.connection.model<GeneratorDocument>('Generator', generatorSchema),
      Takedown: this.connection.model<TakedownDocument>('Takedown', takedownSchema),
      RepoTakedown: this.connection.model<RepoTakedownDocument>('RepoTakedown', repoTakedownSchema),
      BlobTakedown: this.connection.model<BlobTakedownDocument>('BlobTakedown', blobTakedownSchema),
    }
  }

  async connect(): Promise<void> {
    const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } = env
    const uri = `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/?appName=appview`
    this.logger.info(
      `Connecting to MongoDB at ${DB_HOST}:${DB_PORT}/?appName=appview`,
    )

    try {
      await this.connection.openUri(uri, {
        autoIndex: true,
        autoCreate: true,
        dbName: DB_NAME,
      })
      this.logger.info('Connected to MongoDB')
    } catch (error) {
      this.logger.error({ error }, 'MongoDB connection error')
      throw error
    }
  }

  async disconnect(): Promise<void> {
    if (this.connection) {
      await this.connection.close()
      this.logger.info('Disconnected from MongoDB')
    }
  }
}
