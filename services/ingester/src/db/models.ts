import mongoose, { Schema, Document, Model } from 'mongoose'

export interface LikeDocument extends Document {
  uri: string
  subject: string
  subjectCid: string
  authorDid: string
  authorHandle: string
  createdAt: string
  indexedAt: string
}

export const likeSchema = new Schema<LikeDocument>({
  uri: { type: String, required: true, unique: true, index: true },
  subject: { type: String, required: true, index: true },
  subjectCid: { type: String, required: true },
  authorDid: { type: String, required: true, index: true },
  authorHandle: { type: String, required: true },
  createdAt: { type: String, required: true },
  indexedAt: { type: String, required: true },
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
  indexedAt: { type: String, required: true }
})

// Add compound indexes for more efficient queries
postSchema.index({ authorDid: 1, createdAt: -1 })
postSchema.index({ tags: 1, createdAt: -1 })

export interface DatabaseModels {
  Like: Model<LikeDocument>
  Post: Model<PostDocument>
}