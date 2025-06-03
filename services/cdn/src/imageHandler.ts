import type { Context } from "hono";
import { pino } from "pino";
import sharp from "sharp";
import type { BidirectionalResolver } from "./id-resolver";

// Get logger instance from parent
const logger = pino({
  name: "cdn:image",
  transport: {
    target: "pino-pretty",
  },
});

// Size dimensions for different size options
interface SizeDimension {
  width: number;
}

const SIZE_DIMENSIONS: Record<string, SizeDimension | null> = {
  tiny: { width: 150 },
  medium: { width: 600 },
  full: null, // original size
};

// In-memory image cache: did:cid:size:format -> {buffer, timestamp}
interface CachedImage {
  buffer: Buffer | ArrayBuffer;
  timestamp: number;
  contentType: string;
}

const imageCache = new Map<string, CachedImage>();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

// Fetch image from PDS
export const getImage = async (
  pdsUrl: URL | string,
  did: string,
  cid: string,
) => {
  const baseUrl = typeof pdsUrl === "string" ? new URL(pdsUrl) : pdsUrl;
  const imageUrl = new URL(`/xrpc/com.atproto.sync.getBlob`, baseUrl);
  imageUrl.searchParams.set("did", did);
  imageUrl.searchParams.set("cid", cid);
  const response = await fetch(imageUrl);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch image: ${response.status} ${response.statusText}`,
    );
  }

  const imageBytes = await response.arrayBuffer();
  // Get content type from response
  const contentType = response.headers.get("content-type") || "image/jpeg";
  return { buffer: imageBytes, contentType };
};

// Transform image based on size and format
export const transformImage = async (
  imageBuffer: ArrayBuffer,
  originalContentType: string,
  size: string,
  format?: string,
): Promise<{ buffer: Buffer; contentType: string }> => {
  // Convert ArrayBuffer to Buffer for Sharp
  const buffer = Buffer.from(imageBuffer);
  let transformer = sharp(buffer);

  // Apply resize if not "full"
  if (size !== "full" && SIZE_DIMENSIONS[size]) {
    transformer = transformer.resize({
      ...(SIZE_DIMENSIONS[size] as SizeDimension),
      withoutEnlargement: true, // Don't upscale images smaller than target size
      fit: "inside", // Maintain aspect ratio and ensure dimensions don't exceed specified values
    });
  }

  // Apply format conversion if specified
  let contentType = originalContentType;
  if (format) {
    switch (format.toLowerCase()) {
      case "webp":
        transformer = transformer.webp();
        contentType = "image/webp";
        break;
      case "png":
        transformer = transformer.png();
        contentType = "image/png";
        break;
      case "jpg":
      case "jpeg":
        transformer = transformer.jpeg();
        contentType = "image/jpeg";
        break;
      case "avif":
        transformer = transformer.avif();
        contentType = "image/avif";
        break;
      default:
        // Keep original format if unsupported
        break;
    }
  }

  const outputBuffer = await transformer.toBuffer();
  return { buffer: outputBuffer, contentType };
};

// Cleanup old cache entries
export function cleanupCache() {
  const now = Date.now();
  const keysToDelete: string[] = [];

  imageCache.forEach((entry, key) => {
    if (now - entry.timestamp > CACHE_TTL) {
      keysToDelete.push(key);
    }
  });

  keysToDelete.forEach((key) => {
    imageCache.delete(key);
  });

  if (keysToDelete.length > 0) {
    logger.info(
      { count: keysToDelete.length },
      "Cleaned up expired cache entries",
    );
  }
}

// Parse format from path if present
function parseFormat(path: string): string | undefined {
  const formatMatch = path.match(/@([a-zA-Z0-9]+)$/);
  return formatMatch ? formatMatch[1].toLowerCase() : undefined;
}

// Generic image handler for both avatar and regular images
export const imageHandler = async (
  c: Context,
  bidirectionalResolver: BidirectionalResolver,
) => {
  const size = c.req.param("size") || "full";
  if (!["tiny", "medium", "full"].includes(size)) {
    return c.json(
      { error: "Invalid size parameter. Must be tiny, medium, or full" },
      400,
    );
  }

  const did = c.req.param("did");
  const cid = c.req.param("cid");
  const format = parseFormat(c.req.path);

  // Create a unique cache key that includes size and format
  const cacheKey = `${did}:${cid}:${size}:${format || "original"}`;

  try {
    let transformedBuffer: Buffer;
    let contentType: string;
    let fromCache = false;

    const cachedEntry = imageCache.get(cacheKey);
    if (cachedEntry) {
      logger.info(
        { did, cid, size, format, cached: true },
        "Found transformed image in cache",
      );
      transformedBuffer = cachedEntry.buffer instanceof Buffer
        ? cachedEntry.buffer
        : Buffer.from(new Uint8Array(cachedEntry.buffer));
      contentType = cachedEntry.contentType;
      fromCache = true;
    } else {
      logger.info({ did, cid }, "Resolving DID to find PDS");
      const didDoc = await bidirectionalResolver.resolveDidToDidDoc(did);

      if (!didDoc?.pds) {
        logger.error({ did }, "PDS not found for DID");
        return c.json({ error: "PDS not found for DID" }, 404);
      }

      logger.info(
        { pds: didDoc.pds.toString(), did, cid },
        "Fetching image from PDS",
      );
      const result = await getImage(didDoc.pds, did, cid);

      // Transform the image according to size and format
      logger.info({ did, cid, size, format }, "Transforming image");
      const transformed = await transformImage(
        result.buffer,
        result.contentType,
        size,
        format,
      );

      transformedBuffer = transformed.buffer;
      contentType = transformed.contentType;

      // Cache the transformed image
      imageCache.set(cacheKey, {
        buffer: transformedBuffer,
        timestamp: Date.now(),
        contentType,
      });

      cleanupCache();
    }

    const fileSize = transformedBuffer.byteLength;

    // Set headers
    c.header("Content-Type", contentType);
    c.header("Content-Length", fileSize.toString());
    c.header("ETag", `${cid}-${size}-${format || "original"}`);
    c.header("Cache-Control", "public, max-age=86400");

    logger.info(
      {
        did,
        cid,
        size,
        format,
        fileSize,
        cached: fromCache,
        type: contentType,
      },
      "Serving transformed image",
    );

    return c.body(transformedBuffer);
  } catch (err) {
    logger.error({ err, did, cid, size, format }, "Error serving image");
    return c.json({ error: "Error serving image" }, 500);
  }
};
