import { pino } from 'pino'
import { Database } from '../db/connection.js'
import type { NormalizedEvent } from '../types/events.js'
import { ensureActor } from '../utils/actor-utils.js'

const logger = pino({ name: 'actor-handler' })

/**
 * This handler is called by all other handlers to ensure that
 * any DID referenced in an event has a corresponding actor entry.
 * 
 * @param evt The normalized event to process
 * @param db Database connection
 */
export async function handleActorReferences(evt: NormalizedEvent, db: Database): Promise<void> {
  try {
    // Always ensure the author DID has an actor
    if (evt.did) {
      await ensureActor(evt.did, evt.handle || undefined, db)
    }

    // Handle subject DIDs for follow, block, like events
    if (['follow', 'block', 'like'].includes(evt.event) && evt.record?.subject) {
      // Subject is usually a DID in format did:plc:12345
      const subjectDid = evt.record.subject as string
      if (subjectDid && subjectDid.startsWith('did:')) {
        await ensureActor(subjectDid, undefined, db)
      }
    }

    // Handle reply references for posts
    if (evt.collection === 'so.sprk.feed.post' && evt.record?.reply) {
      const reply = evt.record.reply as { root?: { uri?: string }, parent?: { uri?: string } }
      
      // Extract DIDs from reply URIs (format: at://did:plc:12345/...)
      if (reply.root?.uri) {
        const rootDid = extractDidFromUri(reply.root.uri)
        if (rootDid) {
          await ensureActor(rootDid, undefined, db)
        }
      }
      
      if (reply.parent?.uri) {
        const parentDid = extractDidFromUri(reply.parent.uri)
        if (parentDid && parentDid !== extractDidFromUri(reply.root?.uri || '')) {
          await ensureActor(parentDid, undefined, db)
        }
      }
    }
    
    // Handle repost subjects
    if (evt.collection === 'so.sprk.feed.repost' && evt.record?.subject?.uri) {
      const subjectUri = evt.record.subject.uri as string
      const subjectDid = extractDidFromUri(subjectUri)
      if (subjectDid) {
        await ensureActor(subjectDid, undefined, db)
      }
    }
  } catch (error) {
    logger.error({ error, uri: evt.uri }, 'Error while handling actor references')
  }
}

/**
 * Extracts a DID from an AT URI (at://did:plc:12345/...)
 * 
 * @param uri The URI to extract the DID from
 * @returns The extracted DID or undefined
 */
function extractDidFromUri(uri: string): string | undefined {
  if (!uri) return undefined
  
  // Match a DID in an AT URI format
  const match = uri.match(/at:\/\/(did:[a-zA-Z0-9:]+)\//)
  return match ? match[1] : undefined
} 