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

export interface DatabaseModels {
  Like: Model<LikeDocument>
}