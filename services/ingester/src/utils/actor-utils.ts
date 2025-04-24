import { pino } from 'pino'
import { Database } from '../db/connection.js'

const logger = pino({ name: 'actor-utils' })

/**
 * Ensures that an actor exists for the given DID.
 * If the actor doesn't exist, it creates a new one.
 * 
 * @param did The DID to ensure has an actor
 * @param handle Optional handle associated with the DID
 * @param db Database connection
 * @returns The actor document, either existing or newly created
 */
export async function ensureActor(
  did: string, 
  handle?: string, 
  db?: Database
): Promise<any> {
  if (!db) {
    logger.warn({ did }, 'No database connection provided to ensureActor')
    return null
  }

  try {
    // Try to find existing actor
    const existingActor = await db.models.Actor.findOne({ did })
    
    if (existingActor) {
      // If handle is provided and different from existing, update it
      if (handle && existingActor.handle !== handle) {
        existingActor.handle = handle
        await existingActor.save()
        logger.info({ did, handle }, 'Updated actor handle')
      }
      return existingActor
    }

    // Create new actor if none exists
    const now = new Date()
    const uri = `at://${did}/app.bsky.actor.profile`
    
    const newActor = await db.models.Actor.create({
      uri,
      did,
      handle: handle || undefined,
      followersCount: 0,
      followingCount: 0,
      postsCount: 0,
      indexedAt: now.toISOString(),
      isLabeler: false,
      priorityNotifications: false
    })

    logger.info({ did, handle }, 'Created new actor')
    return newActor
  } catch (error) {
    logger.error({ error, did, handle }, 'Failed to ensure actor exists')
    return null
  }
}

/**
 * Links a profile to an actor
 * 
 * @param did The DID of the actor
 * @param profileId The MongoDB ID of the profile
 * @param profileCid The CID of the profile
 * @param db Database connection
 */
export async function linkProfileToActor(
  did: string,
  profileId: string,
  profileCid: string,
  db: Database
): Promise<void> {
  try {
    await db.models.Actor.findOneAndUpdate(
      { did },
      { 
        profile: profileId,
        profileCid
      },
      { new: true }
    )
    
    logger.info({ did, profileId }, 'Linked profile to actor')
  } catch (error) {
    logger.error({ error, did, profileId }, 'Failed to link profile to actor')
  }
} 