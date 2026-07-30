import type { SimulatedFlight } from "./flightSimulations";
import { contextualAlertsForStep } from "./routeEngine";
import type { AirportLocation, CalculatedRoute, ContextualAlert, RouteStep } from "./types";

export type ContextualGuidanceCategory =
  | "Information"
  | "Direction"
  | "Accessibility"
  | "Family Services"
  | "Traveler Services"
  | "Advisory"
  | "Success";

export type ContextualGuidance = {
  id: string;
  category: ContextualGuidanceCategory;
  title: string;
  message: string;
  severity: ContextualAlert["severity"];
};

type ContextualGuidanceOptions = {
  route: CalculatedRoute | null;
  activeStepIndex: number;
  locations: AirportLocation[];
  destinationId: string | null;
  flight: SimulatedFlight | null;
  now?: Date;
};

function titleCaseLocation(value: string): string {
  return value.replace(/\b\w/g, (character) => character.toUpperCase());
}

function locationName(locations: AirportLocation[], locationId: string | null | undefined): string {
  return locations.find((location) => location.id === locationId)?.name ?? "your next landmark";
}

function conditionTouchesStep(alert: ContextualAlert, step: RouteStep): boolean {
  return (
    alert.connectionId === step.connectionId ||
    alert.locationId === step.from ||
    alert.locationId === step.to ||
    alert.nearbyLocationIds?.includes(step.from) === true ||
    alert.nearbyLocationIds?.includes(step.to) === true
  );
}

function directCondition(
  route: CalculatedRoute,
  activeStepIndex: number,
  step: RouteStep,
  now: Date
): ContextualAlert | null {
  return contextualAlertsForStep(route, activeStepIndex, now).find((alert) => conditionTouchesStep(alert, step)) ?? null;
}

function operationalMessage(alert: ContextualAlert, fallback: string): string {
  if (alert.type === "route-closure" || alert.type === "construction") {
    return "Follow Beacon's updated directions around the affected area.";
  }
  if (alert.type === "elevator-unavailable") {
    return "Continue on the alternate step-free path Beacon selected.";
  }
  if (alert.type === "gate-change") {
    return alert.message;
  }
  if (alert.type === "busy-checkpoint") {
    return "The checkpoint is busy; allow extra time and continue toward the signed lanes.";
  }
  if (alert.type === "crowded-corridor") {
    return "This corridor is busy; keep to the marked route and continue ahead.";
  }
  if (alert.type === "noise-condition") {
    return "A calmer option is nearby; continue toward the next landmark.";
  }
  if (alert.type === "amenity-unavailable") {
    return "This service is unavailable; continue to the next available option.";
  }
  return fallback;
}

function landmarkGuidance(
  step: RouteStep,
  locations: AirportLocation[],
  destinationId: string | null,
  flight: SimulatedFlight | null
): Omit<ContextualGuidance, "id" | "severity"> {
  const destinationName = flight?.gateLabel ?? locationName(locations, destinationId);
  const targetName = locationName(locations, step.to);
  const visualId = step.visualId;

  if (step.to === "ticket-counter" && flight) {
    return {
      category: "Information",
      title: `Approaching ${flight.airlineName.replace(" Air Lines", "")} Check In`,
      message: `Continue toward the ${flight.airlineName} counter shown ahead.`
    };
  }
  if (step.to === "security-checkpoint" || visualId === "tsa-precheck" || step.landmarkType === "security") {
    return {
      category: "Advisory",
      title: "Approaching TSA",
      message: flight?.securityType === "tsa-precheck"
        ? "Keep left for the simulated TSA PreCheck entrance."
        : "Continue toward the signed screening lanes."
    };
  }
  if (step.from === "security-checkpoint") {
    return {
      category: "Success",
      title: "Security Complete",
      message: "Continue into the concourse toward your next landmark."
    };
  }
  if (step.landmarkType === "elevator" || step.maneuver === "elevator") {
    const side = step.directionOverlay.includes("left") ? "Left" : "Right";
    return {
      category: "Accessibility",
      title: `Elevator on ${side}`,
      message: "Use the elevator for the step-free connection ahead."
    };
  }
  if (step.to === "quiet-space" || step.landmarkType === "quiet_space") {
    return {
      category: "Accessibility",
      title: "Quiet Space Nearby",
      message: "Continue ahead for a lower-stimulation space."
    };
  }
  if (step.to === "nursing-room" || visualId === "nursing-room-entrance") {
    return {
      category: "Family Services",
      title: "Nursing Room Ahead",
      message: "Continue to the private entrance beneath the Nursing Room sign."
    };
  }
  if (step.to === "information-desk" || step.landmarkType === "information_desk") {
    return {
      category: "Traveler Services",
      title: "Information Desk",
      message: "Continue toward the staffed desk near the central landmark."
    };
  }
  if (step.to === "restroom" || step.landmarkType === "restroom") {
    return {
      category: "Traveler Services",
      title: "Restroom Nearby",
      message: "Follow the amenity signs to the restroom ahead."
    };
  }
  if (step.to === "service-animal-relief" || visualId === "service-animal-relief") {
    return {
      category: "Traveler Services",
      title: "Service Animal Relief Area",
      message: "Continue toward the marked relief area entrance."
    };
  }
  if (step.landmarkType === "gate" || step.to === destinationId) {
    return {
      category: "Direction",
      title: `${destinationName} Ahead`,
      message: `Continue toward ${destinationName}; the gate marker is ahead.`
    };
  }
  if (step.to === "concourse-entrance" || step.to === "central-concourse") {
    const concourse = destinationId?.includes("gate-b") ? "Concourse B" : "Concourse A";
    return {
      category: "Direction",
      title: `${concourse} Ahead`,
      message: `Continue into ${concourse} and follow Beacon's highlighted route.`
    };
  }

  return {
    category: step.accessibilityNote ? "Accessibility" : "Direction",
    title: targetName === "your next landmark" ? titleCaseLocation(step.landmarkName) : `${targetName} Ahead`,
    message: step.instruction
  };
}

export function contextualGuidanceForStep({
  route,
  activeStepIndex,
  locations,
  destinationId,
  flight,
  now = new Date()
}: ContextualGuidanceOptions): ContextualGuidance | null {
  const step = route?.steps[activeStepIndex];
  if (!route || !step) {
    return null;
  }

  const landmark = landmarkGuidance(step, locations, destinationId, flight);
  const condition = directCondition(route, activeStepIndex, step, now);
  if (!condition) {
    return { id: `guidance-${step.id}`, severity: "information", ...landmark };
  }

  if (condition.type === "route-closure" || condition.type === "construction") {
    return {
      id: `guidance-${step.id}-${condition.id}`,
      category: "Advisory",
      title: "Temporary Detour",
      message: operationalMessage(condition, landmark.message),
      severity: "caution"
    };
  }
  if (condition.type === "elevator-unavailable") {
    return {
      id: `guidance-${step.id}-${condition.id}`,
      category: "Accessibility",
      title: "Elevator Outage",
      message: operationalMessage(condition, landmark.message),
      severity: "caution"
    };
  }
  if (condition.type === "gate-change") {
    return {
      id: `guidance-${step.id}-${condition.id}`,
      category: "Advisory",
      title: "Gate Change",
      message: operationalMessage(condition, landmark.message),
      severity: "caution"
    };
  }

  return {
    id: `guidance-${step.id}-${condition.id}`,
    category: landmark.category,
    title: landmark.title,
    message: operationalMessage(condition, landmark.message),
    severity: condition.severity
  };
}

export function contextualGuidanceForRoute(
  options: Omit<ContextualGuidanceOptions, "activeStepIndex">
): ContextualGuidance[] {
  return (options.route?.steps ?? [])
    .map((_, activeStepIndex) => contextualGuidanceForStep({ ...options, activeStepIndex }))
    .filter((guidance): guidance is ContextualGuidance => Boolean(guidance));
}
