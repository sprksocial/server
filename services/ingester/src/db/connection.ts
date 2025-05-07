import mongoose, { Connection } from 'mongoose'
import {
  type DatabaseModels,
  likeSchema,
  postSchema,
  followSchema,
  blockSchema,
  profileSchema,
  audioSchema,
  repostSchema,
  musicSchema,
  lookSchema,
  generatorSchema,
  actorSchema,
  processedEventSchema,
  cursorStateSchema,
} from './models.js'
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
      Post: this.connection.model('Post', postSchema),
      Follow: this.connection.model('Follow', followSchema),
      Block: this.connection.model('Block', blockSchema),
      Profile: this.connection.model('Profile', profileSchema),
      Audio: this.connection.model('Audio', audioSchema),
      Repost: this.connection.model('Repost', repostSchema),
      Music: this.connection.model('Music', musicSchema),
      Look: this.connection.model('Look', lookSchema),
      Generator: this.connection.model('Generator', generatorSchema),
      Actor: this.connection.model('Actor', actorSchema),
      ProcessedEvent: this.connection.model(
        'ProcessedEvent',
        processedEventSchema,
      ),
      CursorState: this.connection.model('CursorState', cursorStateSchema),
    }
  }

  async connect(): Promise<void> {
    const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } = env
    const uri = `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/?appName=ingester`

    this.logger.info(
      `Connecting to MongoDB at ${DB_HOST}:${DB_PORT}/?appName=ingester`,
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

  async hasProcessedEvent(rev: string): Promise<boolean> {
    const count = await this.models.ProcessedEvent.countDocuments({
      rev,
    }).exec()
    return count > 0
  }

  async recordProcessedEvent(rev: string): Promise<void> {
    try {
      await this.models.ProcessedEvent.create({ rev })
      this.logger.info({ rev }, 'Recorded processed event')
    } catch (error) {
      // Handle potential duplicate key error gracefully if two instances try to write at the exact same time
      if (error instanceof Error && 'code' in error && error.code === 11000) {
        this.logger.warn(
          { rev, error },
          'Attempted to record already processed event rev. Likely a race condition, ignoring.',
        )
      } else {
        this.logger.error({ rev, error }, 'Failed to record processed event')
        // Re-throw other errors
        throw error
      }
    }
  }

  private readonly CURSOR_IDENTIFIER = 'last_processed_cursor'

  async getCursorState(): Promise<number | null> {
    try {
      const state = await this.models.CursorState.findOne({
        identifier: this.CURSOR_IDENTIFIER,
      }).exec()
      if (state) {
        this.logger.info(
          { cursorValue: state.cursorValue },
          'Loaded cursor state',
        )
        return state.cursorValue
      }
      this.logger.info('No cursor state found in database.')
      return null
    } catch (error) {
      this.logger.error({ error }, 'Failed to get cursor state')
      return null // Or rethrow, depending on desired error handling
    }
  }

  async saveCursorState(cursorValue: number): Promise<void> {
    try {
      await this.models.CursorState.updateOne(
        { identifier: this.CURSOR_IDENTIFIER },
        {
          $set: { cursorValue, updatedAt: new Date() },
          $setOnInsert: { identifier: this.CURSOR_IDENTIFIER },
        },
        { upsert: true },
      ).exec()
      this.logger.debug({ cursorValue }, 'Saved cursor state')
    } catch (error) {
      this.logger.error({ cursorValue, error }, 'Failed to save cursor state')
      // Depending on desired behavior, you might want to rethrow or handle more gracefully
    }
  }
}
