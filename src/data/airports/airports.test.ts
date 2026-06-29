import { describe, expect, it } from "vitest";
import { airports } from ".";

describe("airport configuration", () => {
  it("contains pilot airports with locations and map metadata", () => {
    expect(airports.map((airport) => airport.iata)).toEqual(["GSP", "AVL", "CLT"]);
    expect(airports.every((airport) => airport.locations.length >= 20)).toBe(true);
    expect(airports.every((airport) => airport.map.defaultTerminal)).toBe(true);
  });
});
