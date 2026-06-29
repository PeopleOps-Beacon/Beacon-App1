import type { ApiResult } from "../types";

type CacheEntry<T> = {
  data: T;
  timestamp: number;
};

const cache = new Map<string, CacheEntry<unknown>>();

export async function mockApiRequest<T>(
  key: string,
  loader: () => T,
  options: { retries?: number; cacheMs?: number } = {}
): Promise<ApiResult<T>> {
  const cacheMs = options.cacheMs ?? 30_000;
  const cached = cache.get(key) as CacheEntry<T> | undefined;

  if (cached && Date.now() - cached.timestamp < cacheMs) {
    return {
      data: cached.data,
      cached: true,
      receivedAt: new Date(cached.timestamp).toISOString()
    };
  }

  const retries = options.retries ?? 1;
  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      const data = loader();
      cache.set(key, { data, timestamp: Date.now() });
      return { data, cached: false, receivedAt: new Date().toISOString() };
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError instanceof Error ? lastError : new Error("Mock API request failed");
}
