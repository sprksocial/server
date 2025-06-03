import { pino } from "pino";
import { customConfig } from "./logger-config.js";
import { TtlCache } from "./ttl-cache.js";
import { Database } from "../db/connection.js";

const logger = pino(customConfig("actor-cache"));
const actorsCache = new TtlCache<string, Set<string>>({ defaultTtlMs: 60_000 }); // 60 seconds TTL
const ACTORS_CACHE_KEY = "all_actor_dids";

// Cache refresh lock to prevent multiple simultaneous refreshes
let cacheRefreshInProgress = false;
let refreshPromise: Promise<Set<string>> | null = null;

/**
 * Queries the database directly to check if an actor with the given DID exists
 */
async function queryActorDirectly(did: string, db: Database): Promise<boolean> {
  return !!(await db.models.Actor.findOne({ did }).lean());
}

/**
 * Checks if an actor with the given DID exists in the database using cache for optimization
 */
export async function isActorInDatabase(
  did: string,
  db: Database,
): Promise<boolean> {
  // Check if actors are already cached
  const actorDids = actorsCache.get(ACTORS_CACHE_KEY);
  if (actorDids) {
    return actorDids.has(did);
  }

  // If a refresh is already in progress, wait for it
  if (cacheRefreshInProgress && refreshPromise) {
    try {
      const refreshedActors = await refreshPromise;
      return refreshedActors.has(did);
    } catch (error) {
      logger.warn(
        { error, did },
        "Shared cache refresh failed, falling back to direct query",
      );
      return queryActorDirectly(did, db);
    }
  }

  // Start a new cache refresh
  cacheRefreshInProgress = true;
  refreshPromise = refreshActorsCache(db);

  try {
    const refreshedActors = await refreshPromise;
    return refreshedActors.has(did);
  } catch (error) {
    logger.warn(
      { error, did },
      "Cache refresh failed, falling back to direct query",
    );
    return queryActorDirectly(did, db);
  } finally {
    cacheRefreshInProgress = false;
    refreshPromise = null;
  }
}

/**
 * Refreshes the actors cache by fetching all actors from the database
 */
async function refreshActorsCache(db: Database): Promise<Set<string>> {
  try {
    const actors = await db.models.Actor.find({}, { did: 1, _id: 0 }).lean();
    const actorDids = new Set(actors.map((actor) => actor.did));
    actorsCache.set(ACTORS_CACHE_KEY, actorDids);
    logger.info({ actorCount: actorDids.size }, "Refreshed actors cache");
    return actorDids;
  } catch (error) {
    logger.error({ error }, "Failed to fetch actors for caching");
    throw error;
  }
}
