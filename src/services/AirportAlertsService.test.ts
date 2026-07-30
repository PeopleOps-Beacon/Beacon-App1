import { describe, expect, it } from "vitest";
import { airports } from "../data/airports";
import { AirportAlertsService } from "./AirportAlertsService";
import { EventSimulationService } from "./EventSimulationService";

describe("AirportAlertsService", () => {
  it("combines airport alerts with high-priority simulation alerts", () => {
    const airport = airports[0];
    const events = [EventSimulationService.createEvent(airport, 1), EventSimulationService.createEvent(airport, 6)];
    const alerts = AirportAlertsService.getAlerts(airport, events);

    expect(alerts.some((alert) => alert.source === "airport")).toBe(true);
    expect(alerts.some((alert) => alert.source === "simulation")).toBe(true);
    expect(alerts.some((alert) => alert.category === "emergency" || alert.category === "security")).toBe(true);
  });
});
