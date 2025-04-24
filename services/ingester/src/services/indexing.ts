import { pino } from 'pino'
import { Database } from '../db/connection.js'
import { BidirectionalResolver } from '../id-resolver.js'

const logger = pino({ name: 'indexing-service' })

/**
 * Service to handle indexing of actors and their handles
 */
export class IndexingService {
  private logger = pino({ name: 'indexing-service' })

  constructor(
    private db: Database,
    private resolver: BidirectionalResolver,
  ) {}

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
      if (!force && actor && this.isHandleRecentlyIndexed(actor, timestamp)) {
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
   * Check if an actor's handle was recently indexed
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