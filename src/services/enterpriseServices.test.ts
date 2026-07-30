import { describe, expect, it } from "vitest";
import { airports } from "../data/airports";
import { translations } from "../data/enterprise";
import { createSmartNotifications } from "./notifications";
import { createVoiceQueue } from "./voice";
import { FlightService } from "./enterpriseServices";
import { createGraphRoute } from "../utils/pathfinder";

describe("enterprise services", () => {
  it("searches pilot flights", () => {
    expect(FlightService.search("DL 241")[0].gate).toBe("A7");
  });

  it("creates contextual smart notifications", () => {
    const airport = airports[0];
    const notifications = createSmartNotifications(airport, [], [], "veteran");

    expect(notifications.some((notification) => notification.modeTarget === "veteran")).toBe(true);
  });

  it("creates voice guidance queues", () => {
    const airport = airports[0];
    const route = createGraphRoute(airport.locations, airport.locations[0], airport.locations[3], "business");
    const queue = createVoiceQueue(route, "es", 1, 0.8);

    expect(queue[0].language).toBe("es");
    expect(queue.length).toBe(route.steps.length);
  });

  it("loads multilingual resource labels", () => {
    expect(translations.ja.settings).toBe("設定");
    expect(translations.de.flights).toBe("Flüge");
  });
});
