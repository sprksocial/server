import mongoose, { Schema, Document, Model } from 'mongoose'

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
    cid: { type: String, required: true }
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
    cid: { type: String, required: true }
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
        cid: { type: String, required: true }
      },
      parent: {
        uri: { type: String, required: true },
        cid: { type: String, required: true }
      }
    },
    required: false,
    default: null
  },
  embed: { type: Object, required: false, default: null },
  sound: {
    type: {
      uri: { type: String, required: true },
      cid: { type: String, required: true }
    },
    required: false,
    default: null
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

lookSchema.index({ authorDid: 1, createdAt: -1 })
lookSchema.index({ 'subject.uri': 1, createdAt: -1 })

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

generatorSchema.index({ authorDid: 1, createdAt: -1 })
generatorSchema.index({ did: 1, createdAt: -1 })

export interface ActorDocument extends Document {
  uri: string
  did: string
  handle?: string
  profile?: ProfileDocument
  profileCid?: string
  profileTakedownRef?: string
  followersCount: number
  followingCount: number
  postsCount: number
  sortedAt?: Date
  indexedAt: string
  takedownRef?: string
  isLabeler: boolean
  allowIncomingChatsFrom?: string
  upstreamStatus?: string
  createdAt?: Date
  priorityNotifications: boolean
  trustedVerifier?: boolean
  labelsDeclaration?: Record<string, any>
}

export const actorSchema = new Schema<ActorDocument>({
  uri: { type: String, required: true, unique: true, index: true },
  did: { type: String, required: true, index: true },
  handle: { type: String, required: false, index: true },
  profile: { type: Schema.Types.ObjectId, ref: 'Profile', required: false },
  profileCid: { type: String, required: false },
  profileTakedownRef: { type: String, required: false },
  followersCount: { type: Number, required: true, default: 0 },
  followingCount: { type: Number, required: true, default: 0 },
  postsCount: { type: Number, required: true, default: 0 },
  sortedAt: { type: Date, required: false },
  indexedAt: { type: String, required: true },
  takedownRef: { type: String, required: false },
  isLabeler: { type: Boolean, required: true, default: false },
  allowIncomingChatsFrom: { type: String, required: false },
  upstreamStatus: { type: String, required: false },
  createdAt: { type: Date, required: false },
  priorityNotifications: { type: Boolean, required: true, default: false },
  trustedVerifier: { type: Boolean, required: false },
  labelsDeclaration: { type: Object, required: false },
})

// Add compound indexes for Actor
actorSchema.index({ handle: 'text' })
actorSchema.index({ did: 1 }, { unique: true })

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
  Actor: Model<ActorDocument>
}