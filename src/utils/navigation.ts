import type { AirportLocation, Route, TravelerModeId } from "../types";

const feetPerMapUnit = 18;
const averageFeetPerMinute = 260;

export function calculateDistance(from: AirportLocation, to: AirportLocation): number {
  const floorPenalty = Math.abs(from.floor - to.floor) * 180;
  const dx = from.x - to.x;
  const dy = from.y - to.y;

  return Math.round(Math.sqrt(dx * dx + dy * dy) * feetPerMapUnit + floorPenalty);
}

export function estimateWalkTime(distanceFeet: number, travelerMode: TravelerModeId): number {
  const modeMultiplier: Record<TravelerModeId, number> = {
    veteran: 1.12,
    sensory: 1.1,
    accessibility: 1.25,
    family: 1.3,
    business: 0.9,
    international: 1.18
  };

  return Math.max(1, Math.ceil((distanceFeet / averageFeetPerMinute) * modeMultiplier[travelerMode]));
}

export function formatDistance(distanceFeet: number): string {
  if (distanceFeet < 1000) {
    return `${distanceFeet} ft`;
  }

  return `${(distanceFeet / 5280).toFixed(1)} mi`;
}

export function getNearbyLocations(
  destination: AirportLocation,
  allLocations: AirportLocation[],
  limit = 4
): AirportLocation[] {
  return allLocations
    .filter((location) => location.id !== destination.id)
    .map((location) => ({
      location,
      distance: calculateDistance(destination, location)
    }))
    .sort((first, second) => first.distance - second.distance)
    .slice(0, limit)
    .map((entry) => entry.location);
}

export function createRoute(
  from: AirportLocation,
  to: AirportLocation,
  travelerMode: TravelerModeId
): Route {
  const distanceFeet = calculateDistance(from, to);
  const estimatedWalkMinutes = estimateWalkTime(distanceFeet, travelerMode);
  const midX = from.x + (to.x - from.x) * 0.46;
  const midY = travelerMode === "accessibility" ? from.y + (to.y - from.y) * 0.24 : from.y;
  const stepCount = Math.max(2, Math.ceil(distanceFeet / 240));

  return {
    id: `${from.id}-${to.id}-${travelerMode}`,
    from,
    to,
    distanceFeet,
    estimatedWalkMinutes,
    stepCount,
    accessible: travelerMode === "accessibility" || to.accessibilityFeatures.includes("step-free"),
    path: [
      { x: from.x, y: from.y },
      { x: midX, y: midY },
      { x: to.x, y: to.y }
    ],
    steps: [
      {
        id: "start",
        instruction: `Start at ${from.name} and enter the main concourse.`,
        distanceFeet: Math.round(distanceFeet * 0.28)
      },
      {
        id: "continue",
        instruction:
          travelerMode === "accessibility"
            ? "Follow the step-free corridor and elevator-marked route."
            : "Continue along the highlighted terminal corridor.",
        distanceFeet: Math.round(distanceFeet * 0.46)
      },
      {
        id: "arrive",
        instruction: `Arrive at ${to.name}.`,
        distanceFeet: Math.round(distanceFeet * 0.26)
      }
    ]
  };
}
