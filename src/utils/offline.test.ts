import { describe, expect, it } from "vitest";
import { airports } from "../data/airports";
import { createOfflineManifest, isOfflineReady } from "./offline";

describe("offline helpers", () => {
  it("creates airport-scoped offline manifests", () => {
    const manifest = createOfflineManifest(airports[0]);

    expect(manifest).toContain("airport:gsp:locations");
    expect(isOfflineReady(airports[0])).toBe(true);
  });
});
