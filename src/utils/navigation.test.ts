import { describe, expect, it } from "vitest";
import { locations } from "../data/locations";
import { calculateDistance, createRoute, estimateWalkTime, getNearbyLocations } from "./navigation";

const from = locations.find((location) => location.id === "info-desk") ?? locations[0];
const to = locations.find((location) => location.id === "gate-a7") ?? locations[1];

describe("navigation utilities", () => {
  it("calculates distance and walk time", () => {
    const distance = calculateDistance(from, to);

    expect(distance).toBeGreaterThan(0);
    expect(estimateWalkTime(distance, "family")).toBeGreaterThanOrEqual(
      estimateWalkTime(distance, "business")
    );
  });

  it("creates traveler-mode-aware routes", () => {
    const route = createRoute(from, to, "accessibility");

    expect(route.to.id).toBe("gate-a7");
    expect(route.steps.some((step) => step.instruction.includes("step-free"))).toBe(true);
    expect(route.path.length).toBe(3);
  });

  it("finds nearby locations", () => {
    const nearby = getNearbyLocations(to, locations, 3);

    expect(nearby).toHaveLength(3);
    expect(nearby.every((location) => location.id !== to.id)).toBe(true);
  });
});
