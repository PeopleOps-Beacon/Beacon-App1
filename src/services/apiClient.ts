import type { ApiResult } from "../types";

type CacheEntry<T> = {
  data: T;
  timestamp: number;
};

const cache = new Map<string, CacheEntry<unknown>>();

function withTimeout<T>(loader: () => T | Promise<T>, timeoutMs: number): Promise<T> {
  return new Promise((resolve, reject) => {
    let settled = false;
    const timeoutId = globalThis.setTimeout(() => {
      settled = true;
      reject(new Error("Airport API request timed out"));
    }, timeoutMs);

    Promise.resolve()
      .then(loader)
      .then((data) => {
        if (settled) {
          return;
        }
        settled = true;
        globalThis.clearTimeout(timeoutId);
        resolve(data);
      })
      .catch((error: unknown) => {
        if (settled) {
          return;
        }
        settled = true;
        globalThis.clearTimeout(timeoutId);
        reject(error);
      });
  });
}

export async function resilientApiRequest<T>(
  key: string,
  loader: () => T | Promise<T>,
  options: { retries?: number; cacheMs?: number; timeoutMs?: number } = {}
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
  const timeoutMs = options.timeoutMs ?? 2_000;
  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      const data = await withTimeout(loader, timeoutMs);
      cache.set(key, { data, timestamp: Date.now() });
      return { data, cached: false, receivedAt: new Date().toISOString() };
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError instanceof Error ? lastError : new Error("Airport API request failed");
}
