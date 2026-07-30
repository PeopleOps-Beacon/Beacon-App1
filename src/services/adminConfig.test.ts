import { describe, expect, it } from "vitest";
import { airports } from "../data/airports";
import {
  addAirportAnnouncement,
  addServiceDisruption,
  createDefaultAdminState,
  setManagedLocationStatus,
  summarizeAdminState
} from "./adminConfig";

describe("admin configuration", () => {
  it("manages airport-scoped operations state", () => {
    const state = createDefaultAdminState(airports[0]);
    const gate = state.managedLocations.find((location) => location.category === "gate");

    expect(gate).toBeDefined();

    const restricted = setManagedLocationStatus(state, gate?.id ?? "", "restricted");
    const announced = addAirportAnnouncement(restricted, {
      title: "Checkpoint advisory",
      message: "Use the north checkpoint for accessible screening support.",
      severity: "medium"
    });
    const disrupted = addServiceDisruption(announced, {
      title: "Elevator support",
      locationName: "Main Elevator",
      impact: "Staff escort available through the alternate step-free route.",
      severity: "high"
    });
    const summary = summarizeAdminState(disrupted);

    expect(disrupted.managedLocations.find((location) => location.id === gate?.id)?.status).toBe("restricted");
    expect(disrupted.announcements[0].title).toBe("Checkpoint advisory");
    expect(summary.activeDisruptions).toBe(1);
    expect(summary.gates).toBeGreaterThan(0);
  });
});
