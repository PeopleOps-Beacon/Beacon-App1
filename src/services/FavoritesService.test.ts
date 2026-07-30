import { beforeEach, describe, expect, it } from "vitest";
import { airports } from "../data/airports";
import { FavoritesService } from "./FavoritesService";
import { RecentDestinationsService } from "./RecentDestinationsService";

describe("FavoritesService", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("persists unique favorite locations locally", () => {
    const ids = FavoritesService.toggle([], "gate-a7");
    const updated = FavoritesService.toggle(ids, "quiet-room");

    FavoritesService.write([...updated, "gate-a7"]);

    expect(FavoritesService.read()).toEqual(["quiet-room", "gate-a7"]);
  });

  it("removes a saved favorite when toggled again", () => {
    expect(FavoritesService.toggle(["gate-a7", "quiet-room"], "gate-a7")).toEqual(["quiet-room"]);
  });

  it("resolves favorite ids to airport locations", () => {
    const airport = airports[0];
    const location = airport.locations[0];

    expect(FavoritesService.resolve([location.id, "missing"], airport.locations)).toEqual([location]);
  });
});

describe("RecentDestinationsService", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("keeps the newest ten destinations", () => {
    const ids = Array.from({ length: 12 }, (_, index) => "location-" + index).reduce(
      (items, id) => RecentDestinationsService.add(items, id),
      [] as string[]
    );

    RecentDestinationsService.write(ids);

    expect(RecentDestinationsService.read()).toHaveLength(10);
    expect(RecentDestinationsService.read()[0]).toBe("location-11");
  });
});
