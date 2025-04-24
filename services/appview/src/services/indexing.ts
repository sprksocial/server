import { AtUri } from '@atproto/syntax'
import { CID } from 'multiformats/cid'
import { Document } from 'mongoose'
import { BidirectionalResolver } from '../id-resolver.js'
import { Database } from '../db.js'
import { pino } from 'pino'
import * as Post from './plugins/post.js'

const logger = pino({ name: 'indexing-service' })

// Generic type for model processors
type RecordProcessor<T extends Document> = {
  collection: string
  insertRecord: (
    uri: AtUri,
    cid: CID,
    record: unknown,
    timestamp: string,
    opts?: { disableNotifs?: boolean },
  ) => Promise<T | null>
  updateRecord: (
    uri: AtUri,
    cid: CID,
    record: unknown,
    timestamp: string,
  ) => Promise<T | null>
  deleteRecord: (uri: AtUri, cascading?: boolean) => Promise<void>
}

/**
 * Service to handle indexing of records from the Atproto network
 */
export class IndexingService {
  private records: Record<string, RecordProcessor<any>> = {}
  private logger = pino({ name: 'indexing-service' })

  constructor(
    private db: Database,
    private resolver: BidirectionalResolver,
  ) {
    // Register record processors
    this.records.post = Post.makePlugin(db)
    
    // Additional plugins would be registered here
    // Example:
    // this.records.like = Like.makePlugin(db)
    // this.records.follow = Follow.makePlugin(db)
    // etc.
  }

  /**
   * Index a record in the database
   * 
   * @param uri The URI of the record
   * @param cid The CID of the record
   * @param obj The record data
   * @param action The action type (create/update)
   * @param timestamp The timestamp of the operation
   * @param opts Optional parameters
   */
  async indexRecord(
    uri: AtUri,
    cid: CID,
    obj: unknown,
    action: 'create' | 'update',
    timestamp: string,
    opts?: { disableNotifs?: boolean },
  ): Promise<void> {
    try {
      const indexer = this.findIndexerForCollection(uri.collection)
      if (!indexer) {
        this.logger.debug({ collection: uri.collection }, 'No indexer found for collection')
        return
      }

      if (action === 'create') {
        await indexer.insertRecord(uri, cid, obj, timestamp, opts)
      } else {
        await indexer.updateRecord(uri, cid, obj, timestamp)
      }
    } catch (error) {
      this.logger.error(
        { error, uri: uri.toString(), cid: cid.toString(), action },
        'Error indexing record',
      )
    }
  }

  /**
   * Delete a record from the database
   * 
   * @param uri The URI of the record to delete
   * @param cascading Whether to cascade the deletion to related records
   */
  async deleteRecord(uri: AtUri, cascading = false): Promise<void> {
    try {
      const indexer = this.findIndexerForCollection(uri.collection)
      if (!indexer) {
        this.logger.debug({ collection: uri.collection }, 'No indexer found for collection')
        return
      }

      await indexer.deleteRecord(uri, cascading)
    } catch (error) {
      this.logger.error(
        { error, uri: uri.toString() },
        'Error deleting record',
      )
    }
  }

  /**
   * Index or update actor handle information
   * 
   * @param did The DID of the actor
   * @param timestamp The timestamp of the operation
   * @param force Force reindexing even if recently indexed
   */
  async indexHandle(did: string, timestamp: string, force = false): Promise<void> {
    try {
      // Find existing actor
      const actor = await this.db.models.Actor.findOne({ did })
      
      // Skip if recently indexed and not forced
      if (!force && actor  && this.isHandleRecentlyIndexed(actor, timestamp)) {
        return
      }

      // Resolve DID to handle
      const didDoc = await this.resolver.resolveDidToDidDoc(did)
      
      // Verify handle ownership
      let handle: string | undefined = undefined
      if (didDoc.handle) {
        const handleDidDoc = await this.resolver.resolveHandleToDidDoc(didDoc.handle)
        handle = did === handleDidDoc.did ? didDoc.handle.toLowerCase() : undefined
      }

      // Handle conflict resolution - if another actor has this handle
      if (handle) {
        const actorWithHandle = await this.db.models.Actor.findOne({ handle })
        if (actorWithHandle && actorWithHandle.did !== did) {
          // Clear handle from the other actor
          await this.db.models.Actor.updateOne(
            { did: actorWithHandle.did },
            { $set: { handle: null } }
          )
        }
      }

      const existingProfile = await this.db.models.Profile.findOne({ authorDid: did })
      if (existingProfile) {
        console.log('existingProfile: ', existingProfile)
      }

      // Update or create actor
      await this.db.models.Actor.updateOne(
        { did },
        { 
          $set: { 
            handle,
            indexedAt: timestamp,
            ...(existingProfile && existingProfile._id ? {
              profile: existingProfile._id,
              profileCid: existingProfile.cid
            } : {})
          },
          $setOnInsert: {
            uri: `at://${did}/app.bsky.actor.profile`,
            followersCount: 0,
            followingCount: 0,
            postsCount: 0,
            isLabeler: false,
            priorityNotifications: false,
          }
        },
        { upsert: true }
      )

      if (existingProfile) {
        this.logger.info({ did, profileId: existingProfile._id }, 'Linked existing profile to actor during indexing')
      }
    } catch (error) {
      this.logger.error({ error, did }, 'Error indexing handle')
    }
  }

  /**
   * Find the indexer responsible for a collection
   * 
   * @param collection The collection to find an indexer for
   * @returns The indexer or undefined if not found
   */
  findIndexerForCollection(collection: string): RecordProcessor<any> | undefined {
    return Object.values(this.records).find(
      (indexer) => indexer.collection === collection
    )
  }

  /**
   * Check if an actor's handle was recently indexed
   * 
   * @param actor The actor document
   * @param timestamp Current timestamp
   * @returns Whether the actor was recently indexed
   */
  private isHandleRecentlyIndexed(actor: any, timestamp: string): boolean {
    if (!actor.indexedAt) return false
    
    const timeDiff = new Date(timestamp).getTime() - new Date(actor.indexedAt).getTime()
    const ONE_DAY = 24 * 60 * 60 * 1000
    const ONE_HOUR = 60 * 60 * 1000
    
    // Reindex daily for all actors
    if (timeDiff > ONE_DAY) return false
    
    // Reindex more frequently for actors without handles
    if (actor.handle === null && timeDiff > ONE_HOUR) return false
    
    return true
  }
} 