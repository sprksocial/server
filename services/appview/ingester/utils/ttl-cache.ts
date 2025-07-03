type Timestamp = number;

interface CacheEntry<T> {
  value: T;
  expiresAt: Timestamp;
}

interface TtlCacheOptions {
  defaultTtlMs?: number;
}

export class TtlCache<K, V> {
  private store = new Map<K, CacheEntry<V>>();
  private defaultTtlMs: number;

  constructor(options?: TtlCacheOptions) {
    this.defaultTtlMs = options?.defaultTtlMs ?? 60_000; // default: 1 min
  }

  /**
   * Inserts a value into the cache.
   * @param key The item key.
   * @param value The value to be cached.
   * @param ttlMs Time to live in milliseconds (optional).
   */
  set(key: K, value: V, ttlMs?: number): void {
    const expiresAt = Date.now() + (ttlMs ?? this.defaultTtlMs);
    this.store.set(key, { value, expiresAt });
  }

  /**
   * Returns the cached value, or undefined if expired or non-existent.
   */
  get(key: K): V | undefined {
    const entry = this.store.get(key);
    if (!entry) return undefined;

    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return undefined;
    }

    return entry.value;
  }

  /**
   * Checks if the key exists and is still valid.
   */
  has(key: K): boolean {
    const entry = this.store.get(key);
    if (!entry) return false;

    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return false;
    }

    return true;
  }

  /**
   * Manually removes an entry.
   */
  delete(key: K): void {
    this.store.delete(key);
  }

  /**
   * Clears the entire cache.
   */
  clear(): void {
    this.store.clear();
  }

  /**
   * Returns the number of valid items in the cache.
   */
  size(): number {
    let count = 0;
    const now = Date.now();
    for (const [key, entry] of this.store) {
      if (now > entry.expiresAt) {
        this.store.delete(key);
      } else {
        count++;
      }
    }
    return count;
  }
}
