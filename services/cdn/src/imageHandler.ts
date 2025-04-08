import type { Context } from 'hono'
import { pino } from 'pino'
import type { BidirectionalResolver } from './id-resolver'

// Get logger instance from parent
const logger = pino({
  name: 'cdn:image',
  transport: {
    target: 'pino-pretty',
  },
})

// In-memory image cache: did:cid -> {buffer, timestamp}
interface CachedImage {
  buffer: ArrayBuffer
  timestamp: number
  contentType: string
}

const imageCache = new Map<string, CachedImage>()
const CACHE_TTL = 24 * 60 * 60 * 1000 // 24 hours

// Fetch image from PDS
export const getImage = async (
  pdsUrl: URL | string,
  did: string,
  cid: string,
) => {
  const baseUrl = typeof pdsUrl === 'string' ? new URL(pdsUrl) : pdsUrl
  const imageUrl = new URL(`/xrpc/com.atproto.sync.getBlob`, baseUrl)
  imageUrl.searchParams.set('did', did)
  imageUrl.searchParams.set('cid', cid)
  const response = await fetch(imageUrl)

  if (!response.ok) {
    throw new Error(
      `Failed to fetch image: ${response.status} ${response.statusText}`,
    )
  }

  const imageBytes = await response.arrayBuffer()
  // Get content type from response
  const contentType = response.headers.get('content-type') || 'image/jpeg'
  return { buffer: imageBytes, contentType }
}

// Cleanup old cache entries
export function cleanupCache() {
  const now = Date.now()
  const keysToDelete: string[] = []

  imageCache.forEach((entry, key) => {
    if (now - entry.timestamp > CACHE_TTL) {
      keysToDelete.push(key)
    }
  })

  keysToDelete.forEach((key) => {
    imageCache.delete(key)
  })

  if (keysToDelete.length > 0) {
    logger.info(
      { count: keysToDelete.length },
      'Cleaned up expired cache entries',
    )
  }
}

// Generic image handler for both avatar and regular images
export const imageHandler = async (
  c: Context,
  bidirectionalResolver: BidirectionalResolver,
) => {
  const did = c.req.param('did')
  const cid = c.req.param('cid')
  const cacheKey = `${did}:${cid}`

  try {
    let imageBuffer: ArrayBuffer
    let contentType: string
    let fromCache = false

    const cachedEntry = imageCache.get(cacheKey)
    if (cachedEntry) {
      logger.info({ did, cid, cached: true }, 'Found image in cache')
      imageBuffer = cachedEntry.buffer
      contentType = cachedEntry.contentType
      fromCache = true
    } else {
      logger.info({ did, cid }, 'Resolving DID to find PDS')
      const didDoc = await bidirectionalResolver.resolveDidToDidDoc(did)

      if (!didDoc?.pds) {
        logger.error({ did }, 'PDS not found for DID')
        return c.json({ error: 'PDS not found for DID' }, 404)
      }

      logger.info(
        { pds: didDoc.pds.toString(), did, cid },
        'Fetching image from PDS',
      )
      const result = await getImage(didDoc.pds, did, cid)
      imageBuffer = result.buffer
      contentType = result.contentType

      // Cache the image
      imageCache.set(cacheKey, {
        buffer: imageBuffer,
        timestamp: Date.now(),
        contentType,
      })

      cleanupCache()
    }

    const fileSize = imageBuffer.byteLength

    // Set headers
    c.header('Content-Type', contentType)
    c.header('Content-Length', fileSize.toString())
    c.header('ETag', cid)
    c.header('Cache-Control', 'public, max-age=86400')

    logger.info(
      { did, cid, size: fileSize, cached: fromCache, type: contentType },
      'Serving image',
    )

    return c.body(imageBuffer)
  } catch (err) {
    logger.error({ err, did, cid }, 'Error serving image')
    return c.json({ error: 'Error serving image' }, 500)
  }
}
