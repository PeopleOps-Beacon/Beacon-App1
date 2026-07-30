import { beforeEach, describe, expect, it } from "vitest";
import { ErrorService } from "./ErrorService";

describe("ErrorService", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("captures user-friendly recovery records", () => {
    const record = ErrorService.capture(new Error("Route missing"), "routing", "demo route");

    expect(record.userMessage).toMatch(/could not calculate/i);
    expect(ErrorService.list()[0].area).toBe("routing");
  });

  it("simulates network failures", () => {
    expect(ErrorService.simulateNetworkFailure().area).toBe("network");
  });
});
