import type { AirportCondition, AirportConfig, AirportIntelligence, OperationsState } from "../types";

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function waitSeverity(waitTime: number): AirportIntelligence["severity"] {
  if (waitTime >= 35) return "critical";
  if (waitTime >= 25) return "high";
  if (waitTime >= 15) return "medium";
  return "low";
}

export function createAirportIntelligence(
  airport: AirportConfig,
  operations: OperationsState,
  conditions: AirportCondition[]
): AirportIntelligence {
  const crowdHeatmap = airport.locations.slice(0, 7).map((location, index) => ({
    locationId: location.id,
    level: clampScore(operations.crowding + index * 5 - (location.accessibilityFeatures.includes("quiet") ? 20 : 0))
  }));
  const constructionZones = conditions
    .filter((condition) => condition.category === "construction" || condition.category === "closure")
    .map((condition) => condition.locationId ?? condition.id);
  const closedWalkways = conditions
    .filter((condition) => condition.avoidInRouting)
    .map((condition) => condition.locationId ?? condition.id);
  const securityWaitTime = Math.max(operations.waitTime, ...conditions.map((condition) => condition.waitMinutes ?? 0));

  return {
    airportId: airport.id,
    crowdHeatmap,
    constructionZones,
    closedWalkways,
    securityWaitTime,
    restaurantWaitTime: clampScore(8 + operations.crowding / 6),
    parkingOccupancy: clampScore(42 + operations.crowding / 2),
    weatherAlerts:
      airport.id === "gsp"
        ? ["Afternoon storms may affect inbound aircraft."]
        : operations.support < 45
          ? ["Operations support is reduced; allow extra transfer time."]
          : [],
    crowdLevel: clampScore(operations.crowding),
    noiseLevel: clampScore(operations.noise),
    severity: waitSeverity(securityWaitTime)
  };
}
