import { describe, expect, it } from "vitest";
import { locations } from "../data/locations";
import { searchLocations } from "./search";

describe("searchLocations", () => {
  it("searches names and keywords", () => {
    const results = searchLocations("ptsd", locations, "veteran");

    expect(results[0].name).toBe("Quiet Room");
  });

  it("supports fuzzy destination search", () => {
    const results = searchLocations("gt a7", locations, "business");

    expect(results.some((location) => location.id === "gate-a7")).toBe(true);
  });
});
