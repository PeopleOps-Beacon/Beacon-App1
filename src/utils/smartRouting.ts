import { routePreferenceLabels } from "../data/enterprise";
import type {
  AirportCondition,
  AirportLocation,
  RouteDifficulty,
  RouteOption,
  RoutePreference,
  TravelerModeId
} from "../types";
import { createGraphRoute } from "./pathfinder";

const preferences: RoutePreference[] = [
  "fastest",
  "accessible",
  "quietest",
  "family",
  "least-walking",
  "fewest-elevators",
  "fewest-stairs",
  "wheelchair"
];

export function createRouteOptions(
  locations: AirportLocation[],
  from: AirportLocation,
  to: AirportLocation,
  travelerMode: TravelerModeId,
  conditions: AirportCondition[]
): RouteOption[] {
  return preferences
    .map((preference) => {
      const baseMode = preference === "accessible" || preference === "wheelchair" ? "accessibility" : travelerMode;
      const route = createGraphRoute(locations, from, to, baseMode);
      const warnings = findConditionWarnings(route.path, locations, conditions);
      const penalty = warnings.length * 45;
      const distanceAdjustment = getDistanceAdjustment(preference);
      const adjustedDistance = Math.max(120, Math.round(route.distanceFeet * distanceAdjustment + penalty));
      const turnCount = Math.max(1, route.path.length - 2);

      return {
        ...route,
        distanceFeet: adjustedDistance,
        estimatedWalkMinutes: Math.max(1, Math.ceil(route.estimatedWalkMinutes * distanceAdjustment + warnings.length)),
        preference,
        label: routePreferenceLabels[preference],
        accessibilityScore: scoreAccessibility(preference, route.accessible, warnings),
        turnCount,
        difficulty: getDifficulty(adjustedDistance, turnCount, warnings.length),
        conditionWarnings: warnings
      };
    })
    .sort((first, second) => scoreRoute(first) - scoreRoute(second));
}

function getDistanceAdjustment(preference: RoutePreference): number {
  const adjustments: Record<RoutePreference, number> = {
    fastest: 0.88,
    accessible: 1.08,
    quietest: 1.14,
    family: 1.12,
    "least-walking": 0.92,
    "fewest-elevators": 1.05,
    "fewest-stairs": 1.03,
    wheelchair: 1.16
  };

  return adjustments[preference];
}

function findConditionWarnings(
  path: Array<{ x: number; y: number }>,
  locations: AirportLocation[],
  conditions: AirportCondition[]
): string[] {
  const pathLocationIds = new Set(
    path
      .map((point) => locations.find((location) => location.x === point.x && location.y === point.y)?.id)
      .filter((id): id is string => Boolean(id))
  );

  return conditions
    .filter((condition) => condition.avoidInRouting || condition.severity === "high")
    .filter((condition) => !condition.locationId || pathLocationIds.has(condition.locationId))
    .map((condition) => condition.title);
}

function scoreAccessibility(
  preference: RoutePreference,
  accessible: boolean,
  warnings: string[]
): number {
  const base = accessible ? 88 : 62;
  const preferenceBoost = preference === "accessible" || preference === "wheelchair" ? 10 : 0;
  return Math.max(0, Math.min(100, base + preferenceBoost - warnings.length * 8));
}

function getDifficulty(distanceFeet: number, turnCount: number, warningCount: number): RouteDifficulty {
  if (distanceFeet > 1200 || turnCount > 6 || warningCount > 1) {
    return "difficult";
  }

  if (distanceFeet > 650 || turnCount > 3 || warningCount === 1) {
    return "moderate";
  }

  return "easy";
}

function scoreRoute(route: RouteOption): number {
  return route.estimatedWalkMinutes * 10 + route.turnCount * 4 - route.accessibilityScore + route.conditionWarnings.length * 18;
}
