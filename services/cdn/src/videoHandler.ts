import type { Context } from 'hono'
import { pino } from 'pino'
import type { BidirectionalResolver } from './id-resolver'

// Get logger instance from parent
const logger = pino({
  name: 'cdn:video',
  transport: {
    target: 'pino-pretty',
  },
})

// In-memory video cache: did:cid -> {buffer, timestamp}
interface CachedVideo {
  buffer: ArrayBuffer
  timestamp: number
}

const videoCache = new Map<string, CachedVideo>()
const CACHE_TTL = 24 * 60 * 60 * 1000 // 24 hours

// Fetch video from PDS
export const getVideo = async (
  pdsUrl: URL | string,
  did: string,
  cid: string,
) => {
  const baseUrl = typeof pdsUrl === 'string' ? new URL(pdsUrl) : pdsUrl
  const videoUrl = new URL(`/xrpc/com.atproto.sync.getBlob`, baseUrl)
  videoUrl.searchParams.set('did', did)
  videoUrl.searchParams.set('cid', cid)
  const response = await fetch(videoUrl)

  if (!response.ok) {
    throw new Error(
      `Failed to fetch video: ${response.status} ${response.statusText}`,
    )
  }

  const videoBytes = await response.arrayBuffer()
  return videoBytes
}

// Cleanup old cache entries
export function cleanupCache() {
  const now = Date.now()
  const keysToDelete: string[] = []

  videoCache.forEach((entry, key) => {
    if (now - entry.timestamp > CACHE_TTL) {
      keysToDelete.push(key)
    }
  })

  keysToDelete.forEach((key) => {
    videoCache.delete(key)
  })

  if (keysToDelete.length > 0) {
    logger.info(
      { count: keysToDelete.length },
      'Cleaned up expired cache entries',
    )
  }
}

// Parse range header and return start and end bytes
function parseRangeHeader(
  rangeHeader: string,
  fileSize: number,
): { start: number; end: number } | null {
  // Check if the range header has the correct format
  const matches = rangeHeader.match(/bytes=(\d+)-(\d*)/)
  if (!matches) return null

  // Get the start and end bytes
  const start = parseInt(matches[1])

  // If end is not specified, use the file size minus 1
  let end = matches[2] ? parseInt(matches[2]) : fileSize - 1

  // Make sure end doesn't exceed file size
  end = Math.min(end, fileSize - 1)

  // Validate range
  if (start > end || start >= fileSize || end < 0) return null

  return { start, end }
}

// Video route handler with streaming support
export const videoHandler = async (
  c: Context,
  bidirectionalResolver: BidirectionalResolver,
) => {
  const did = c.req.param('did')
  const cid = c.req.param('cid')
  const cacheKey = `${did}:${cid}`

  try {
    // Get range header if present
    const rangeHeader = c.req.header('range')

    // Get video buffer (from cache or source)
    let videoBuffer: ArrayBuffer
    let fromCache = false

    // Check if video is in cache
    const cachedEntry = videoCache.get(cacheKey)
    if (cachedEntry) {
      logger.info({ did, cid, cached: true }, 'Found video in cache')
      videoBuffer = cachedEntry.buffer
      fromCache = true
    } else {
      // Resolve DID to find PDS URL
      logger.info({ did, cid }, 'Resolving DID to find PDS')
      const didDoc = await bidirectionalResolver.resolveDidToDidDoc(did)

      if (!didDoc?.pds) {
        logger.error({ did }, 'PDS not found for DID')
        return c.json({ error: 'PDS not found for DID' }, 404)
      }

      // Fetch video from PDS
      logger.info(
        { pds: didDoc.pds.toString(), did, cid },
        'Fetching video from PDS',
      )
      videoBuffer = await getVideo(didDoc.pds, did, cid)

      // Cache the video
      videoCache.set(cacheKey, {
        buffer: videoBuffer,
        timestamp: Date.now(),
      })

      // Cleanup old cache entries
      cleanupCache()
    }

    const fileSize = videoBuffer.byteLength

    // Set common headers
    c.header('Accept-Ranges', 'bytes')
    c.header('Content-Type', 'video/mp4')
    c.header('ETag', cid)

    // If no range requested, send entire file
    if (!rangeHeader) {
      logger.info(
        { did, cid, size: fileSize, cached: fromCache },
        'Serving full video',
      )
      c.header('Content-Length', fileSize.toString())
      c.header('Cache-Control', 'public, max-age=86400')
      return c.body(videoBuffer)
    }

    // Parse range header
    const range = parseRangeHeader(rangeHeader, fileSize)

    if (!range) {
      logger.warn({ did, cid, rangeHeader }, 'Invalid range header')
      c.status(416) // Range Not Satisfiable
      c.header('Content-Range', `bytes */${fileSize}`)
      return c.body(null)
    }

    const { start, end } = range
    const chunkSize = end - start + 1

    logger.info(
      {
        did,
        cid,
        range: `${start}-${end}`,
        size: chunkSize,
        cached: fromCache,
      },
      'Serving partial video content',
    )

    // Create a new buffer with only the requested bytes
    const slicedBuffer = videoBuffer.slice(start, end + 1)

    // Set partial content headers
    c.status(206) // Partial Content
    c.header('Content-Range', `bytes ${start}-${end}/${fileSize}`)
    c.header('Content-Length', chunkSize.toString())
    c.header('Cache-Control', 'public, max-age=86400')

    return c.body(slicedBuffer)
  } catch (err) {
    logger.error({ err, did, cid }, 'Error serving video')
    return c.json({ error: 'Error serving video' }, 500)
  }
}
