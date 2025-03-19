import mongoose, { Connection } from 'mongoose'
import { type DatabaseModels, likeSchema } from './models.js'
import { env } from '../utils/env.js'
import { pino } from 'pino'

export class Database {
  private connection: Connection
  public models: DatabaseModels
  private logger = pino({ name: 'database' })

  constructor() {
    this.connection = mongoose.createConnection()
    this.models = {
      Like: this.connection.model('Like', likeSchema),
    }
  }

  async connect(): Promise<void> {
    const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } = env
    const uri = `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/?appName=ingester`

    this.logger.info(`Connecting to MongoDB at ${DB_HOST}:${DB_PORT}/?appName=ingester`)

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