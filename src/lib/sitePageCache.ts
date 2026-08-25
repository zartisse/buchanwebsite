const TTL_MS = 5 * 60 * 1000;

type CacheEntry<T> = { data: T; expires: number };

const cache = new Map<string, CacheEntry<unknown>>();

export function getCached<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expires) {
    cache.delete(key);
    return null;
  }
  return entry.data as T;
}

export function setCached<T>(key: string, data: T): void {
  cache.set(key, { data, expires: Date.now() + TTL_MS });
}

export function invalidateCache(key?: string): void {
  if (key) cache.delete(key);
  else cache.clear();
}
