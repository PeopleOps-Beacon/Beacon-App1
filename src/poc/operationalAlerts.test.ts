import { describe, expect, it } from "vitest";
import { airportLocations, mockAlerts, routeConnections } from "./mockData";
import {
  calculateRoute,
  contextualAlertForStep,
  contextualAlertsForStep,
  isOperationalAlertActive,
  prioritizeOperationalAlerts
} from "./routeEngine";
import { operationalAlertTypes, type ContextualAlert } from "./types";

function alert(overrides: Partial<ContextualAlert> = {}): ContextualAlert {
  return {
    id: "test-alert",
    type: "construction",
    title: "Simulated condition",
    message: "A deterministic test condition.",
    locationId: "concourse-entrance",
    severity: "caution",
    active: true,
    startTime: "",
    endTime: "",
    ...overrides
  };
}

describe("operational alert conditions", () => {
  it("supports and seeds all eight operational alert types", () => {
    expect([...operationalAlertTypes]).toEqual([
      "construction",
      "gate-change",
      "busy-checkpoint",
      "elevator-unavailable",
      "route-closure",
      "noise-condition",
      "crowded-corridor",
      "amenity-unavailable"
    ]);
    expect(new Set(mockAlerts.map((item) => item.type))).toEqual(new Set(operationalAlertTypes));
  });

  it("honors active state and optional time windows", () => {
    const now = new Date("2026-07-15T12:00:00.000Z");
    expect(isOperationalAlertActive(alert({ active: false }), now)).toBe(false);
    expect(isOperationalAlertActive(alert({ startTime: "2026-07-15T13:00:00.000Z" }), now)).toBe(false);
    expect(isOperationalAlertActive(alert({ endTime: "2026-07-15T11:00:00.000Z" }), now)).toBe(false);
    expect(
      isOperationalAlertActive(
        alert({ startTime: "2026-07-15T11:00:00.000Z", endTime: "2026-07-15T13:00:00.000Z" }),
        now
      )
    ).toBe(true);
  });

  it("prioritizes by type, severity, and then route proximity", () => {
    const ordered = prioritizeOperationalAlerts(
      [
        alert({ id: "noise", type: "noise-condition", locationId: "security-checkpoint" }),
        alert({ id: "far", type: "route-closure", locationId: "gate-a1", severity: "information" }),
        alert({ id: "near", type: "route-closure", locationId: "concourse-entrance", severity: "caution" })
      ],
      ["security-checkpoint", "concourse-entrance", "gate-a1"]
    );
    expect(ordered.map((item) => item.id)).toEqual(["near", "far", "noise"]);
  });

  it("removes a closed segment from route generation", () => {
    const route = calculateRoute({
      startId: "concourse-entrance",
      destinationId: "central-concourse",
      locations: airportLocations,
      connections: routeConnections,
      alerts: [alert({ type: "route-closure", connectionId: "concourse-central" })]
    });
    expect(route.steps[0]?.to).not.toBe("central-concourse");
  });

  it("makes an elevator outage affect accessible route generation", () => {
    expect(() =>
      calculateRoute({
        startId: "security-checkpoint",
        destinationId: "concourse-entrance",
        preferences: ["wheelchair", "avoidStairs"],
        alerts: [alert({ type: "elevator-unavailable", locationId: "elevators" })]
      })
    ).toThrow("Beacon could not find a route with the selected preferences.");
  });

  it("skips an unavailable optional amenity and blocks it as a destination", () => {
    const amenityAlert = alert({ type: "amenity-unavailable", locationId: "quiet-space" });
    const route = calculateRoute({
      startId: "main-entrance",
      destinationId: "gate-a1",
      preferences: ["quietStop"],
      alerts: [amenityAlert]
    });
    expect(route.locationIds).not.toContain("quiet-space");
    expect(route.alerts).toContainEqual(amenityAlert);
    expect(() =>
      calculateRoute({ startId: "main-entrance", destinationId: "quiet-space", alerts: [amenityAlert] })
    ).toThrow("temporarily unavailable in this simulation");
  });

  it("leaves routes unchanged for unrelated alerts", () => {
    const options = { startId: "main-entrance", destinationId: "ticket-counter" };
    const baseline = calculateRoute({ ...options, alerts: [] });
    const withAlert = calculateRoute({
      ...options,
      alerts: [alert({ type: "construction", locationId: "gate-b2" })]
    });
    expect(withAlert.locationIds).toEqual(baseline.locationIds);
    expect(withAlert.estimatedMinutes).toBe(baseline.estimatedMinutes);
    expect(withAlert.alerts).toEqual([]);
  });

  it("changes alerts with the active step and excludes unrelated conditions", () => {
    const route = calculateRoute({ startId: "main-entrance", destinationId: "gate-a1", alerts: [] });
    const firstAlert = alert({
      id: "first-area",
      title: "Security congestion",
      type: "busy-checkpoint",
      locationId: route.steps[0].to
    });
    const destinationAlert = alert({
      id: "destination-area",
      title: "Boarding update",
      type: "gate-change",
      locationId: route.steps[route.steps.length - 1]?.to ?? "gate-a1"
    });
    const unrelatedAlert = alert({ id: "unrelated", locationId: "gate-b2" });
    const routeWithAlerts = { ...route, alerts: [firstAlert, destinationAlert, unrelatedAlert] };

    expect(contextualAlertForStep(routeWithAlerts, 0)?.id).toBe("first-area");
    expect(contextualAlertForStep(routeWithAlerts, route.steps.length - 1)?.id).toBe("destination-area");
    expect(contextualAlertsForStep(routeWithAlerts, 0).map((item) => item.id)).not.toContain("unrelated");
  });

  it("selects only the highest priority relevant alert", () => {
    const route = calculateRoute({ startId: "main-entrance", destinationId: "gate-a1", alerts: [] });
    const locationId = route.steps[0].to;
    const routeWithAlerts = {
      ...route,
      alerts: [
        alert({ id: "crowd", type: "crowded-corridor", locationId }),
        alert({ id: "blockage", type: "route-closure", locationId })
      ]
    };

    expect(contextualAlertForStep(routeWithAlerts, 0)?.id).toBe("blockage");
  });

  it("returns a stable clear result when no condition is near the active step", () => {
    const route = calculateRoute({ startId: "main-entrance", destinationId: "gate-a1", alerts: [] });
    const routeWithPastAlert = {
      ...route,
      alerts: [alert({ id: "past", locationId: route.steps[0].from })]
    };
    const lastStepIndex = route.steps.length - 1;

    expect(contextualAlertForStep(routeWithPastAlert, lastStepIndex)).toBeNull();
    expect(contextualAlertForStep(routeWithPastAlert, lastStepIndex)).toBeNull();
  });

  it("explains an alternate route selected around a route-affecting alert", () => {
    const baseline = calculateRoute({ startId: "concourse-entrance", destinationId: "central-concourse", alerts: [] });
    const affectedConnectionId = baseline.steps[0].connectionId;
    const closure = alert({
      id: "closed-corridor",
      type: "route-closure",
      title: "Route closed",
      message: "Beacon selected another route around this closed corridor.",
      locationId: baseline.steps[0].to,
      nearbyLocationIds: [baseline.steps[0].from],
      connectionId: affectedConnectionId
    });
    const rerouted = calculateRoute({
      startId: "concourse-entrance",
      destinationId: "central-concourse",
      alerts: [closure]
    });

    expect(rerouted.steps.map((step) => step.connectionId)).not.toContain(affectedConnectionId);
    expect(contextualAlertForStep(rerouted, 0)).toMatchObject({
      id: "closed-corridor",
      message: "Beacon selected another route around this closed corridor."
    });
  });
});
