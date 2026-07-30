import { describe, expect, it } from "vitest";
import { createOperationalConditions } from "./operations";

describe("operational conditions", () => {
  it("derives route-affecting conditions from simulator values", () => {
    const conditions = createOperationalConditions("gsp", {
      crowding: 90,
      noise: 84,
      waitTime: 38,
      support: 26
    });

    expect(conditions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: "operations-gsp-crowding",
          title: "High terminal crowding",
          severity: "high",
          avoidInRouting: true
        }),
        expect.objectContaining({
          id: "operations-gsp-noise",
          category: "noise",
          avoidInRouting: true
        }),
        expect.objectContaining({
          id: "operations-gsp-security-wait",
          waitMinutes: 38
        }),
        expect.objectContaining({
          id: "operations-gsp-support",
          category: "support",
          avoidInRouting: true
        })
      ])
    );
  });
});
