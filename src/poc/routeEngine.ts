import { airportLocations, mockAlerts, routeConnections } from "./mockData";
import { buildRouteStepVisualReference } from "./landmarkVisuals";
import type {
  AirportLocation,
  CalculatedRoute,
  ContextualAlert,
  PreferenceId,
  RouteConnection,
  RouteStep
} from "./types";

type RouteEngineOptions = {
  startId: string;
  destinationId: string;
  preferences?: PreferenceId[];
  locations?: AirportLocation[];
  connections?: RouteConnection[];
  alerts?: ContextualAlert[];
};

type SearchResult = {
  locationIds: string[];
  connectionIds: string[];
  distanceFeet: number;
  estimatedMinutes: number;
};

const reassuranceMessages = [
  "You are on the correct route.",
  "Your destination is getting closer.",
  "A quieter area is available ahead.",
  "You can request assistance at any time."
];

function unique<T>(items: T[]): T[] {
  return [...new Set(items)];
}

const alertTypePriority: Record<ContextualAlert["type"], number> = {
  "route-closure": 0,
  "elevator-unavailable": 1,
  "amenity-unavailable": 1,
  "gate-change": 2,
  "busy-checkpoint": 3,
  construction: 3,
  "crowded-corridor": 3,
  "noise-condition": 3
};

const alertCategoryPriority: Record<NonNullable<ContextualAlert["priorityCategory"]>, number> = {
  safety: 0,
  "accessibility-barrier": 1,
  boarding: 2,
  delay: 3,
  "accessibility-information": 4,
  "general-information": 5
};

const severityPriority: Record<ContextualAlert["severity"], number> = {
  assistance: 0,
  caution: 1,
  information: 2
};

function timeBoundary(value: string, reference: Date): number | null {
  const normalized = value.trim();
  if (!normalized || normalized.toLowerCase() === "now" || normalized.toLowerCase() === "later") {
    return null;
  }

  const clockMatch = normalized.match(/^(\d{1,2}):(\d{2})$/);
  if (clockMatch) {
    const boundary = new Date(reference);
    boundary.setHours(Number(clockMatch[1]), Number(clockMatch[2]), 0, 0);
    return boundary.getTime();
  }

  const parsed = Date.parse(normalized);
  return Number.isNaN(parsed) ? null : parsed;
}

export function isOperationalAlertActive(alert: ContextualAlert, now = new Date()): boolean {
  if (!alert.active) {
    return false;
  }

  const start = timeBoundary(alert.startTime, now);
  const end = timeBoundary(alert.endTime, now);
  const current = now.getTime();
  return (start === null || current >= start) && (end === null || current <= end);
}

export function prioritizeOperationalAlerts(
  alerts: ContextualAlert[],
  routeLocationIds: string[],
  now = new Date()
): ContextualAlert[] {
  return alerts
    .filter((alert) => isOperationalAlertActive(alert, now))
    .sort((left, right) => {
      const leftPriority = left.priorityCategory
        ? alertCategoryPriority[left.priorityCategory]
        : alertTypePriority[left.type];
      const rightPriority = right.priorityCategory
        ? alertCategoryPriority[right.priorityCategory]
        : alertTypePriority[right.type];
      const typeDifference = leftPriority - rightPriority;
      if (typeDifference !== 0) return typeDifference;

      const severityDifference = severityPriority[left.severity] - severityPriority[right.severity];
      if (severityDifference !== 0) return severityDifference;

      const leftIndex = routeLocationIds.indexOf(left.locationId);
      const rightIndex = routeLocationIds.indexOf(right.locationId);
      const locationDifference =
        (leftIndex < 0 ? Number.MAX_SAFE_INTEGER : leftIndex) -
        (rightIndex < 0 ? Number.MAX_SAFE_INTEGER : rightIndex);
      return locationDifference !== 0 ? locationDifference : left.id.localeCompare(right.id);
    });
}

export function contextualAlertsForStep(
  route: CalculatedRoute | null,
  activeStepIndex: number,
  now = new Date()
): ContextualAlert[] {
  if (!route || route.steps.length === 0) {
    return [];
  }

  const stepIndex = Math.min(Math.max(0, activeStepIndex), route.steps.length - 1);
  const nearbySteps = route.steps.slice(stepIndex, stepIndex + 3);
  const nearbyLocationIds = new Set([nearbySteps[0].from, ...nearbySteps.map((step) => step.to)]);
  const nearbyConnectionIds = new Set(nearbySteps.map((step) => step.connectionId));
  const relevantAlerts = route.alerts.filter((alert) => {
    if (!isOperationalAlertActive(alert, now)) {
      return false;
    }

    return (
      nearbyLocationIds.has(alert.locationId) ||
      alert.nearbyLocationIds?.some((locationId) => nearbyLocationIds.has(locationId)) === true ||
      (alert.connectionId ? nearbyConnectionIds.has(alert.connectionId) : false)
    );
  });

  return prioritizeOperationalAlerts(relevantAlerts, route.locationIds.slice(stepIndex), now);
}

export function contextualAlertForStep(
  route: CalculatedRoute | null,
  activeStepIndex: number,
  now = new Date()
): ContextualAlert | null {
  return contextualAlertsForStep(route, activeStepIndex, now)[0] ?? null;
}

function alertAffectsConnection(alert: ContextualAlert, connection: RouteConnection): boolean {
  if (alert.connectionId) {
    return alert.connectionId === connection.id;
  }
  return connection.from === alert.locationId || connection.to === alert.locationId;
}

function applyOperationalAlertEffects(
  connections: RouteConnection[],
  alerts: ContextualAlert[],
  preferences: PreferenceId[]
): RouteConnection[] {
  return connections.map((connection) =>
    alerts.reduce<RouteConnection>((effective, alert) => {
      if (!alertAffectsConnection(alert, connection)) {
        return effective;
      }

      if (alert.type === "route-closure" || alert.type === "elevator-unavailable") {
        return { ...effective, closed: true };
      }
      if (alert.type === "busy-checkpoint") {
        return { ...effective, estimatedMinutes: effective.estimatedMinutes + 5 };
      }
      if (alert.type === "construction") {
        return { ...effective, estimatedMinutes: effective.estimatedMinutes + 3 };
      }
      if (alert.type === "noise-condition" && preferences.includes("reducedStimulation")) {
        return { ...effective, noiseLevel: 5 };
      }
      if (
        alert.type === "crowded-corridor" &&
        (preferences.includes("avoidCrowds") || preferences.includes("reducedStimulation"))
      ) {
        return { ...effective, crowdLevel: 5 };
      }
      return effective;
    }, connection)
  );
}

function connectionMatches(connection: RouteConnection, from: string, to: string): boolean {
  return (connection.from === from && connection.to === to) || (connection.from === to && connection.to === from);
}

function connectionIsAllowed(connection: RouteConnection, preferences: PreferenceId[]): boolean {
  if (connection.closed) {
    return false;
  }

  if (preferences.includes("wheelchair") && !connection.wheelchairAccessible) {
    return false;
  }

  if (preferences.includes("avoidStairs") && connection.hasStairs) {
    return false;
  }

  return true;
}

function connectionWeight(connection: RouteConnection, preferences: PreferenceId[]): number {
  let weight = connection.estimatedMinutes * 10 + connection.distanceFeet / 100;

  if (preferences.includes("reducedStimulation")) {
    weight += connection.noiseLevel * 7 + connection.crowdLevel * 4;
    if (connection.reducedStimulation) {
      weight -= 10;
    }
  }

  if (preferences.includes("avoidCrowds")) {
    weight += connection.crowdLevel * 8;
  }

  if (preferences.includes("wheelchair") && connection.hasElevator) {
    weight -= 4;
  }

  return Math.max(1, weight);
}

function findConnection(connections: RouteConnection[], from: string, to: string): RouteConnection | undefined {
  return connections.find((connection) => connectionMatches(connection, from, to));
}

function findPath(
  startId: string,
  destinationId: string,
  preferences: PreferenceId[],
  locations: AirportLocation[],
  connections: RouteConnection[]
): SearchResult {
  const locationIds = new Set(locations.map((location) => location.id));

  if (!locationIds.has(startId) || !locationIds.has(destinationId)) {
    throw new Error("Choose a valid starting point and destination.");
  }

  if (startId === destinationId) {
    throw new Error("Choose a destination that is different from the starting point.");
  }

  const distances = new Map<string, number>();
  const previous = new Map<string, { locationId: string; connectionId: string } | null>();
  const unvisited = new Set(locationIds);

  locationIds.forEach((locationId) => {
    distances.set(locationId, locationId === startId ? 0 : Number.POSITIVE_INFINITY);
    previous.set(locationId, null);
  });

  while (unvisited.size > 0) {
    const current = [...unvisited].sort(
      (first, second) => (distances.get(first) ?? Infinity) - (distances.get(second) ?? Infinity)
    )[0];

    if (!current || current === destinationId || (distances.get(current) ?? Infinity) === Infinity) {
      break;
    }

    unvisited.delete(current);

    connections
      .filter((connection) => connectionMatches(connection, current, connection.from === current ? connection.to : connection.from))
      .filter((connection) => connection.from === current || connection.to === current)
      .filter((connection) => connectionIsAllowed(connection, preferences))
      .forEach((connection) => {
        const neighbor = connection.from === current ? connection.to : connection.from;
        if (!unvisited.has(neighbor)) {
          return;
        }

        const nextDistance = (distances.get(current) ?? Infinity) + connectionWeight(connection, preferences);
        if (nextDistance < (distances.get(neighbor) ?? Infinity)) {
          distances.set(neighbor, nextDistance);
          previous.set(neighbor, { locationId: current, connectionId: connection.id });
        }
      });
  }

  const path: string[] = [];
  const edgePath: string[] = [];
  let current: string | null = destinationId;

  while (current) {
    path.unshift(current);
    const previousStep = previous.get(current);
    if (!previousStep) {
      break;
    }
    edgePath.unshift(previousStep.connectionId);
    current = previousStep.locationId;
  }

  if (path[0] !== startId) {
    throw new Error("Beacon could not find a route with the selected preferences.");
  }

  const selectedConnections = edgePath
    .map((connectionId) => connections.find((connection) => connection.id === connectionId))
    .filter((connection): connection is RouteConnection => Boolean(connection));

  return {
    locationIds: path,
    connectionIds: edgePath,
    distanceFeet: selectedConnections.reduce((total, connection) => total + connection.distanceFeet, 0),
    estimatedMinutes: selectedConnections.reduce((total, connection) => total + connection.estimatedMinutes, 0)
  };
}

function buildStopSequence(
  startId: string,
  destinationId: string,
  preferences: PreferenceId[],
  unavailableAmenities: Set<string>
): string[] {
  const stops = [startId];

  if (
    preferences.includes("restroomStop") &&
    startId !== "restroom" &&
    destinationId !== "restroom" &&
    !unavailableAmenities.has("restroom")
  ) {
    stops.push("restroom");
  }

  if (
    preferences.includes("quietStop") &&
    startId !== "quiet-space" &&
    destinationId !== "quiet-space" &&
    !unavailableAmenities.has("quiet-space")
  ) {
    stops.push("quiet-space");
  }

  stops.push(destinationId);
  return unique(stops);
}

function buildDirection(
  from: AirportLocation,
  to: AirportLocation,
  connection: RouteConnection,
  isLastStep: boolean,
  preferences: PreferenceId[]
): string {
  if (to.id === "elevators") {
    return "Use the elevator located on your right.";
  }

  if (from.id === "information-desk") {
    return `Turn right after the information desk toward ${to.name}.`;
  }

  if (from.id === "restroom") {
    return `Continue past the restroom entrance toward ${to.name}.`;
  }

  if (to.type === "gate" && isLastStep) {
    return `Continue toward ${to.name}. Your gate is on the left.`;
  }

  if (to.id === "security-checkpoint") {
    return "Proceed straight toward the security checkpoint.";
  }

  if (to.id === "quiet-space") {
    return "The quiet space is located approximately 100 feet ahead.";
  }

  if (to.id === "nursing-room") {
    return "Continue to the private entrance beneath the Nursing Room sign.";
  }

  if (from.id === "nursing-room") {
    return `Continue from the Nursing Room toward ${to.name}.`;
  }

  if (to.id === "information-desk") {
    return "Continue toward the Aviator Boy fountain near the center of the terminal.";
  }

  if (connection.hasStairs) {
    return `Use the stairs toward ${to.name}.`;
  }

  if (preferences.includes("simplifiedDirections")) {
    return isLastStep ? `Go to ${to.name}.` : `Continue toward ${to.name}.`;
  }

  return `Proceed along the ${connection.description.toLowerCase()} toward ${to.name}.`;
}

function buildStepNote(connection: RouteConnection): string | undefined {
  if (connection.hasElevator) {
    return "Step-free elevator route.";
  }

  if (connection.hasStairs) {
    return "This segment includes stairs.";
  }

  if (connection.reducedStimulation) {
    return "Lower crowding and noise expected on this segment.";
  }

  if (connection.crowdLevel >= 4) {
    return "This segment may be crowded.";
  }

  return undefined;
}

function buildSteps(
  locationIds: string[],
  connections: RouteConnection[],
  preferences: PreferenceId[],
  locations: AirportLocation[]
): RouteStep[] {
  return locationIds.slice(1).map((locationId, index) => {
    const fromId = locationIds[index];
    const from = locations.find((location) => location.id === fromId);
    const to = locations.find((location) => location.id === locationId);
    const connection = findConnection(connections, fromId, locationId);

    if (!from || !to || !connection) {
      throw new Error("Route data is incomplete.");
    }

    const visualReference = buildRouteStepVisualReference({ connection, from, to });
    const usesTsaPreCheck = to.id === "security-checkpoint" && preferences.includes("tsaPreCheck");

    return {
      id: `step-${index + 1}`,
      connectionId: connection.id,
      from: from.id,
      to: to.id,
      instruction: usesTsaPreCheck
        ? "Continue toward the TSA PreCheck entrance on the left."
        : buildDirection(from, to, connection, index === locationIds.length - 2, preferences),
      maneuver: usesTsaPreCheck ? "security" : visualReference.maneuver,
      distanceFeet: connection.distanceFeet,
      estimatedMinutes: Math.max(1, Math.round(connection.distanceFeet / 220)),
      landmark: to.description,
      landmarkName: usesTsaPreCheck ? "TSA PreCheck Entrance" : visualReference.landmarkName,
      landmarkType: visualReference.landmarkType,
      recognitionCue: usesTsaPreCheck
        ? "Look for the TSA PreCheck text sign above the lanes on the left."
        : visualReference.recognitionCue,
      visualId: usesTsaPreCheck ? "tsa-precheck" : visualReference.visualId,
      visualAsset: usesTsaPreCheck ? "tsa-precheck" : visualReference.visualAsset,
      directionOverlay: usesTsaPreCheck ? "enter-left" : visualReference.directionOverlay,
      visualPriority: usesTsaPreCheck ? "primary" : visualReference.visualPriority,
      simulatedLabel: usesTsaPreCheck ? true : visualReference.simulatedLabel,
      altText: usesTsaPreCheck
        ? "Fictional Beacon terminal security area showing a simulated TSA PreCheck text sign above the left screening lanes with standard lanes nearby."
        : visualReference.altText,
      accessibilityDescription: usesTsaPreCheck
        ? "The simulated TSA PreCheck entrance is on the left with standard screening lanes to the right."
        : visualReference.accessibilityDescription,
      currentMapFocus: visualReference.currentMapFocus,
      turnDirection: visualReference.turnDirection,
      accessibilityNote: usesTsaPreCheck ? "Simulated security lane. Availability and wait times are demonstration data." : buildStepNote(connection),
      reassurance: preferences.includes("reassurance") ? reassuranceMessages[index % reassuranceMessages.length] : undefined
    };
  });
}

function routeAlerts(
  locationIds: string[],
  connections: RouteConnection[],
  alerts: ContextualAlert[],
  additionallyRelevantAlertIds: Set<string>
): ContextualAlert[] {
  const selectedAlerts = alerts.filter(
    (alert) =>
      locationIds.includes(alert.locationId) ||
      alert.nearbyLocationIds?.some((locationId) => locationIds.includes(locationId)) === true ||
      additionallyRelevantAlertIds.has(alert.id)
  );
  const generated: ContextualAlert[] = connections.flatMap((connection) => {
    const notices: ContextualAlert[] = [];

    if (connection.crowdLevel >= 4) {
      notices.push({
        id: `${connection.id}-crowd`,
        type: "crowded-corridor",
        title: "This area may be crowded",
        message: "Beacon selected this route using simulated crowd conditions.",
        locationId: connection.to,
        connectionId: connection.id,
        severity: "caution",
        active: true,
        startTime: "",
        endTime: ""
      });
    }

    return notices;
  });
  const allAlerts: ContextualAlert[] = [...selectedAlerts, ...generated];

  const uniqueAlerts = allAlerts.filter(
    (alert, index, routeAlertList) => routeAlertList.findIndex((candidate) => candidate.title === alert.title) === index
  );
  return prioritizeOperationalAlerts(uniqueAlerts, locationIds);
}

export function calculateRoute({
  startId,
  destinationId,
  preferences = [],
  locations = airportLocations,
  connections = routeConnections,
  alerts = mockAlerts
}: RouteEngineOptions): CalculatedRoute {
  const activeAlerts = alerts.filter((alert) => isOperationalAlertActive(alert));
  const unavailableAmenities = new Set(
    activeAlerts.filter((alert) => alert.type === "amenity-unavailable").map((alert) => alert.locationId)
  );
  const unavailableDestination = activeAlerts.find(
    (alert) => alert.type === "amenity-unavailable" && alert.locationId === destinationId
  );
  if (unavailableDestination) {
    const destinationName = locations.find((location) => location.id === destinationId)?.name ?? "This amenity";
    throw new Error(`${destinationName} is temporarily unavailable in this simulation.`);
  }

  const effectiveConnections = applyOperationalAlertEffects(connections, activeAlerts, preferences);
  const stopSequence = buildStopSequence(startId, destinationId, preferences, unavailableAmenities);
  const resultParts: SearchResult[] = [];

  for (let index = 0; index < stopSequence.length - 1; index += 1) {
    resultParts.push(
      findPath(stopSequence[index], stopSequence[index + 1], preferences, locations, effectiveConnections)
    );
  }

  const locationIds = resultParts.reduce<string[]>((allLocations, result, index) => {
    if (index === 0) {
      return result.locationIds;
    }
    return [...allLocations, ...result.locationIds.slice(1)];
  }, []);

  const connectionIds = resultParts.flatMap((result) => result.connectionIds);
  const selectedConnections = connectionIds
    .map((connectionId) => effectiveConnections.find((connection) => connection.id === connectionId))
    .filter((connection): connection is RouteConnection => Boolean(connection));

  const additionallyRelevantAlertIds = new Set(
    activeAlerts
      .filter((alert) => {
        if (
          alert.type === "amenity-unavailable" &&
          ((alert.locationId === "restroom" && preferences.includes("restroomStop")) ||
            (alert.locationId === "quiet-space" && preferences.includes("quietStop")))
        ) {
          return true;
        }
        if (
          alert.type === "elevator-unavailable" &&
          (preferences.includes("wheelchair") || preferences.includes("avoidStairs"))
        ) {
          return true;
        }
        if (alert.connectionId) {
          const affectedConnection = connections.find((connection) => connection.id === alert.connectionId);
          return Boolean(
            affectedConnection &&
              (locationIds.includes(affectedConnection.from) || locationIds.includes(affectedConnection.to))
          );
        }
        return false;
      })
      .map((alert) => alert.id)
  );

  const baseMinutes = resultParts.reduce((total, result) => total + result.estimatedMinutes, 0);
  const adjustedMinutes = preferences.includes("additionalTime") ? Math.ceil(baseMinutes * 1.25) : baseMinutes;

  return {
    locationIds,
    steps: buildSteps(locationIds, effectiveConnections, preferences, locations),
    distanceFeet: resultParts.reduce((total, result) => total + result.distanceFeet, 0),
    estimatedMinutes: Math.max(1, adjustedMinutes),
    alerts: routeAlerts(locationIds, selectedConnections, activeAlerts, additionallyRelevantAlertIds),
    preferences
  };
}
