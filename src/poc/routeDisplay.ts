import { preferenceLabels, travelerProfiles } from "./mockData";
import type { AirportLocation, CalculatedRoute, ContextualAlert, PreferenceId, TravelerProfileId } from "./types";

const routeProfileOrder: PreferenceId[] = [
  "wheelchair",
  "avoidStairs",
  "reducedStimulation",
  "avoidCrowds",
  "quietStop",
  "restroomStop",
  "simplifiedDirections",
  "reassurance",
  "additionalTime",
  "largerText"
];

export function formatDistance(feet: number): string {
  if (feet < 1000) {
    return `${feet} ft`;
  }

  return `${(feet / 5280).toFixed(1)} mi`;
}

export function locationName(locations: AirportLocation[], id: string | null): string {
  return locations.find((location) => location.id === id)?.name ?? "Current area";
}

export function routeProfileSummary(
  profileId: TravelerProfileId,
  preferences: PreferenceId[]
): { title: string; details: string[] } {
  const profile = travelerProfiles.find((item) => item.id === profileId);
  const title = profileId === "custom" ? "Custom Route" : profile?.name.replace(" Traveler", "") ?? "Standard Route";
  const details = routeProfileOrder
    .filter((preference) => preferences.includes(preference))
    .map((preference) => preferenceLabels[preference])
    .slice(0, 3);

  return {
    title,
    details: details.length > 0 ? details : ["Fastest available route"]
  };
}

export function routeRelevantAlerts(route: CalculatedRoute | null): ContextualAlert[] {
  if (!route) {
    return [];
  }

  return route.alerts.filter((alert) => alert.active);
}

export function alertRelevance(
  route: CalculatedRoute | null,
  alert: ContextualAlert,
  activeStepIndex = 0
): string {
  if (!route) {
    return "On your route";
  }

  const alertIndex = route.locationIds.indexOf(alert.locationId);
  if (alertIndex <= activeStepIndex) {
    return "At your current location";
  }

  const feetAhead = route.steps
    .slice(activeStepIndex, alertIndex)
    .reduce((total, step) => total + step.distanceFeet, 0);
  const minutesAhead = Math.max(1, Math.round(feetAhead / 250));

  return `${minutesAhead} min ahead`;
}

export function routeCondition(route: CalculatedRoute | null): { title: string; message: string } {
  if (!route) {
    return {
      title: "Route ready",
      message: "Beacon will keep the route visible as you move."
    };
  }

  const quietAlert = route.alerts.find((alert) => alert.locationId === "quiet-space");
  if (quietAlert) {
    return {
      title: "Calmer area ahead",
      message: "Quiet space is approximately one minute away."
    };
  }

  const firstAlert = routeRelevantAlerts(route)[0];
  if (firstAlert) {
    return {
      title: firstAlert.title,
      message: firstAlert.message
    };
  }

  return {
    title: "Route looks clear",
    message: "No route-specific conditions need your attention right now."
  };
}

export function routeExplanation(preferences: PreferenceId[]): string {
  if (preferences.length === 0) {
    return "This route uses the most direct available path.";
  }

  const details: string[] = [];
  if (preferences.includes("wheelchair") || preferences.includes("avoidStairs")) {
    details.push("uses accessible paths and avoids stairs");
  }
  if (preferences.includes("avoidCrowds")) {
    details.push("avoids crowded areas where possible");
  }
  if (preferences.includes("reducedStimulation") || preferences.includes("quietStop")) {
    details.push("favors calmer areas");
  }
  if (preferences.includes("restroomStop")) {
    details.push("includes a restroom stop");
  }
  if (preferences.includes("additionalTime")) {
    details.push("allows extra time");
  }
  if (preferences.includes("tsaPreCheck")) {
    details.push("uses the simulated TSA PreCheck entrance");
  }

  if (details.length === 0) {
    return "This route is adjusted around your selected support settings.";
  }

  return `This route ${details.slice(0, 3).join(", ")}.`;
}
