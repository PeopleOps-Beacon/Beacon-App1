import { describe, expect, it } from "vitest";
import { resilientApiRequest } from "./apiClient";

describe("api client", () => {
  it("returns cached API results", async () => {
    let calls = 0;
    const first = await resilientApiRequest("cache-test", () => {
      calls += 1;
      return { ok: true };
    });
    const second = await resilientApiRequest("cache-test", () => {
      calls += 1;
      return { ok: true };
    });

    expect(first.cached).toBe(false);
    expect(second.cached).toBe(true);
    expect(calls).toBe(1);
  });

  it("times out slow API results", async () => {
    await expect(
      resilientApiRequest(
        "timeout-test",
        () => new Promise((resolve) => window.setTimeout(() => resolve({ ok: true }), 20)),
        { retries: 0, timeoutMs: 1, cacheMs: 0 }
      )
    ).rejects.toThrow(/timed out/i);
  });
});
