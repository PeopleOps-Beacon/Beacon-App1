import { describe, expect, it } from "vitest";
import { airports } from "../data/airports";
import { airportConditions } from "../data/enterprise";
import { createRouteOptions } from "./smartRouting";

const airport = airports[0];
const start = airport.locations.find((location) => location.name === "Information Desk") ?? airport.locations[0];
const destination = airport.locations.find((location) => location.name === "Gate A7") ?? airport.locations[1];

describe("smart routing", () => {
  it("creates comparable route options", () => {
    const options = createRouteOptions(
      airport.locations,
      start,
      destination,
      "accessibility",
      airportConditions.filter((condition) => condition.airportId === airport.id)
    );

    expect(options.length).toBeGreaterThan(4);
    expect(options.some((option) => option.preference === "wheelchair")).toBe(true);
    expect(options.every((option) => option.accessibilityScore >= 0)).toBe(true);
  });
});
