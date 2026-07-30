import type { AirportCondition, OperationsState } from "../types";

export function createOperationalConditions(
  airportId: string,
  operations: OperationsState
): AirportCondition[] {
  const conditions: AirportCondition[] = [];

  if (operations.crowding >= 70) {
    const isHigh = operations.crowding >= 85;
    conditions.push({
      id: `operations-${airportId}-crowding`,
      airportId,
      category: "crowd",
      title: isHigh ? "High terminal crowding" : "Moderate terminal crowding",
      description: `${operations.crowding}% crowding reported across active terminal corridors.`,
      severity: isHigh ? "high" : "medium",
      avoidInRouting: isHigh
    });
  }

  if (operations.noise >= 68) {
    const isHigh = operations.noise >= 82;
    conditions.push({
      id: `operations-${airportId}-noise`,
      airportId,
      category: "noise",
      title: isHigh ? "High noise advisory" : "Elevated noise levels",
      description: `${operations.noise} dB noise levels may affect sensory-sensitive travelers.`,
      severity: isHigh ? "high" : "medium",
      avoidInRouting: isHigh
    });
  }

  if (operations.waitTime >= 20) {
    const isHigh = operations.waitTime >= 35;
    conditions.push({
      id: `operations-${airportId}-security-wait`,
      airportId,
      category: "security",
      title: isHigh ? "Long security wait" : "Security wait building",
      description: `${operations.waitTime} minute checkpoint wait reported by the operations simulator.`,
      severity: isHigh ? "high" : "medium",
      avoidInRouting: false,
      waitMinutes: operations.waitTime
    });
  }

  if (operations.support <= 45) {
    const isHigh = operations.support <= 30;
    conditions.push({
      id: `operations-${airportId}-support`,
      airportId,
      category: "support",
      title: isHigh ? "Limited support coverage" : "Support coverage reduced",
      description: `${operations.support}% staff support coverage is available for assisted routes.`,
      severity: isHigh ? "high" : "medium",
      avoidInRouting: isHigh
    });
  }

  return conditions;
}
