import { describe, expect, it } from "vitest";
import { contextualGuidanceForRoute, contextualGuidanceForStep } from "./contextualGuidance";
import { simulatedFlights } from "./flightSimulations";
import { airportLocations } from "./mockData";
import { calculateRoute } from "./routeEngine";
import type { ContextualAlert } from "./types";

function condition(overrides: Partial<ContextualAlert> = {}): ContextualAlert {
  return {
    id: "condition",
    type: "busy-checkpoint",
    title: "Busy checkpoint",
    message: "Allow extra time.",
    locationId: "security-checkpoint",
    severity: "caution",
    active: true,
    startTime: "",
    endTime: "",
    ...overrides
  };
}

describe("contextual guidance", () => {
  it("creates a unique landmark-aware message for every complete GSP journey step", () => {
    const flight = simulatedFlights.find((item) => item.id === "delta-1842") ?? null;
    const route = calculateRoute({
      startId: "main-entrance",
      destinationId: "gate-a12",
      preferences: ["simplifiedDirections", "reassurance", "quietStop", "tsaPreCheck"],
      alerts: []
    });
    const guidance = contextualGuidanceForRoute({
      route,
      locations: airportLocations,
      destinationId: "gate-a12",
      flight
    });
    const messages = guidance.map((item) => `${item.title}|${item.message}`);

    expect(guidance).toHaveLength(route.steps.length);
    expect(new Set(messages).size).toBe(route.steps.length);
    messages.slice(1).forEach((message, index) => expect(message).not.toBe(messages[index]));
    expect(guidance.map((item) => item.title)).toEqual(
      expect.arrayContaining([
        "Approaching Delta Check In",
        "Approaching TSA",
        "Security Complete",
        "Quiet Space Nearby",
        "Gate A12 Ahead"
      ])
    );
  });

  it("uses all supported categories across real airport destinations", () => {
    const flight = simulatedFlights.find((item) => item.id === "delta-1842") ?? null;
    const scenarios = [
      { startId: "main-entrance", destinationId: "gate-a12", flight },
      { startId: "central-concourse", destinationId: "nursing-room", flight: null },
      { startId: "central-concourse", destinationId: "information-desk", flight: null },
      { startId: "central-concourse", destinationId: "quiet-space", flight: null }
    ];
    const categories = new Set(
      scenarios.flatMap((scenario) => {
        const route = calculateRoute({ startId: scenario.startId, destinationId: scenario.destinationId, alerts: [] });
        return contextualGuidanceForRoute({
          route,
          locations: airportLocations,
          destinationId: scenario.destinationId,
          flight: scenario.flight
        }).map((item) => item.category);
      })
    );

    expect(categories).toEqual(
      new Set(["Information", "Direction", "Accessibility", "Family Services", "Traveler Services", "Advisory", "Success"])
    );
  });

  it("folds active nearby conditions into landmark guidance and ignores inactive ones", () => {
    const activeRoute = calculateRoute({
      startId: "ticket-counter",
      destinationId: "security-checkpoint",
      alerts: [condition()]
    });
    const inactiveRoute = calculateRoute({
      startId: "ticket-counter",
      destinationId: "security-checkpoint",
      alerts: [condition({ active: false })]
    });
    const activeSecurityStep = activeRoute.steps.findIndex((step) => step.to === "security-checkpoint");
    const inactiveSecurityStep = inactiveRoute.steps.findIndex((step) => step.to === "security-checkpoint");
    const activeGuidance = contextualGuidanceForStep({
      route: activeRoute,
      activeStepIndex: activeSecurityStep,
      locations: airportLocations,
      destinationId: "security-checkpoint",
      flight: null
    });
    const inactiveGuidance = contextualGuidanceForStep({
      route: inactiveRoute,
      activeStepIndex: inactiveSecurityStep,
      locations: airportLocations,
      destinationId: "security-checkpoint",
      flight: null
    });

    expect(activeGuidance).toMatchObject({ title: "Approaching TSA", category: "Advisory", severity: "caution" });
    expect(activeGuidance?.message).toContain("busy");
    expect(inactiveGuidance).toMatchObject({ title: "Approaching TSA" });
    expect(inactiveGuidance?.message).not.toContain("checkpoint is busy");
  });

  it("shows an active route detour only at the affected step", () => {
    const baseline = calculateRoute({ startId: "concourse-entrance", destinationId: "central-concourse", alerts: [] });
    const closure = condition({
      type: "route-closure",
      title: "Route closed",
      message: "Use another corridor.",
      locationId: baseline.steps[0].to,
      nearbyLocationIds: [baseline.steps[0].from],
      connectionId: baseline.steps[0].connectionId
    });
    const route = calculateRoute({
      startId: "concourse-entrance",
      destinationId: "central-concourse",
      alerts: [closure]
    });
    const guidance = contextualGuidanceForStep({
      route,
      activeStepIndex: 0,
      locations: airportLocations,
      destinationId: "central-concourse",
      flight: null
    });

    expect(guidance).toMatchObject({ title: "Temporary Detour", category: "Advisory" });
  });
});
