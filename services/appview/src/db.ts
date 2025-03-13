import mongoose, { Schema, Document, Model, Connection } from 'mongoose'
import { env } from './env.js'

export interface LikeDocument extends Document {
  uri: string // URI of the like event
  subject: string // URI of the post being liked
  subjectCid: string // CID of the post being liked
  authorDid: string // DID of the user who liked the post
  authorHandle: string // Handle of the user who liked the post
  createdAt: string // When the like was created
  indexedAt: string // When the like was indexed
}

const likeSchema = new Schema<LikeDocument>({
  uri: { type: String, required: true, unique: true, index: true },
  subject: { type: String, required: true, index: true },
  subjectCid: { type: String, required: true },
  authorDid: { type: String, required: true, index: true },
  authorHandle: { type: String, required: true },
  createdAt: { type: String, required: true },
  indexedAt: { type: String, required: true },
})

// Model types
export interface DatabaseModels {
  Like: Model<LikeDocument>
}

// Database connection and models
export class Database {
  private connection: Connection
  public models: DatabaseModels

  constructor() {
    this.connection = mongoose.createConnection()
    this.models = {
      Like: this.connection.model<LikeDocument>('Like', likeSchema),
    }
  }

  async connect(): Promise<void> {
    const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } = env
    const uri = `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/`
    console.log('Connecting to MongoDB:', uri)

    try {
      await this.connection.openUri(uri, {
        autoIndex: true,
        autoCreate: true,
      })
      console.log('Connected to MongoDB')
    } catch (error) {
      console.error('MongoDB connection error:', error)
      throw error
    }
  }

  async disconnect(): Promise<void> {
    if (this.connection) {
      await this.connection.close()
      console.log('Disconnected from MongoDB')
    }
  }
}
