import { describe, expect, it } from "vitest";
import { airports } from "../data/airports";
import { searchLocations } from "./search";

describe("smart search", () => {
  it("matches synonyms for restrooms and dining", () => {
    const airport = airports[0];

    expect(searchLocations("bathroom", airport.locations)[0].category).toBe("restroom");
    expect(searchLocations("eat", airport.locations).some((location) => location.category === "dining")).toBe(true);
  });

  it("handles small typos in airport searches", () => {
    const airport = airports[0];

    expect(searchLocations("restrrom", airport.locations).some((location) => location.category === "restroom")).toBe(true);
  });
});
