import { pino } from 'pino'
import { Database } from '../db/connection.js'
import type { NormalizedEvent } from '../types/events.js'
import { IndexingService } from '../services/indexing.js'
import { BidirectionalResolver } from '../id-resolver.js'
import { ensureActor } from '../utils/actor-utils.js'
import { customConfig } from '../utils/logger-config.js'

const logger = pino(customConfig('actor-handler'))

/**
 * This handler is called by all other handlers to ensure that
 * any DID referenced in an event has a corresponding actor entry.
 *
 * @param evt The normalized event to process
 * @param db Database connection
 */
export async function handleActorReferences(evt: NormalizedEvent, db: Database): Promise<void> {
  try {
    const now = new Date().toISOString()
    const resolver = new BidirectionalResolver()
    const indexingService = new IndexingService(db, resolver)

    // Always ensure the author DID has an actor
    if (evt.did) {
      await indexingService.indexHandle(evt.did, now)
    }

    // Handle subject DIDs for follow, block, like events
    if (['follow', 'block', 'like'].includes(evt.event) && evt.record?.subject) {
      // Subject is usually a DID in format did:plc:12345
      const subjectDid = evt.record.subject as string
      if (subjectDid && subjectDid.startsWith('did:')) {
        await indexingService.indexHandle(subjectDid, now)
      }
    }

    // Handle reply references for posts
    if (evt.collection === 'so.sprk.feed.post' && evt.record?.reply) {
      const reply = evt.record.reply as { root?: { uri?: string }, parent?: { uri?: string } }

      // Extract DIDs from reply URIs (format: at://did:plc:12345/...)
      if (reply.root?.uri) {
        const rootDid = extractDidFromUri(reply.root.uri)
        if (rootDid) {
          await indexingService.indexHandle(rootDid, now)
        }
      }

      if (reply.parent?.uri) {
        const parentDid = extractDidFromUri(reply.parent.uri)
        if (parentDid && parentDid !== extractDidFromUri(reply.root?.uri || '')) {
          await indexingService.indexHandle(parentDid, now)
        }
      }
    }

    // Handle repost subjects
    if (evt.collection === 'so.sprk.feed.repost' && evt.record?.subject?.uri) {
      const subjectUri = evt.record.subject.uri as string
      const subjectDid = extractDidFromUri(subjectUri)
      if (subjectDid) {
        await indexingService.indexHandle(subjectDid, now)
      }
    }
  } catch (error) {
    logger.error({ error, uri: evt.uri }, 'Error while handling actor references')
  }
}

/**
 * Helper function to extract DID from a URI
 */
function extractDidFromUri(uri: string): string | null {
  const match = uri.match(/at:\/\/(did:[^/]+)/)
  return match ? match[1] : null
}