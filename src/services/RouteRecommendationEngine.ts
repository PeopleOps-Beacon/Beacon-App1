import type {
  AirportConfig,
  AirportCondition,
  AirportIntelligence,
  AirportLocation,
  RouteRecommendation,
  TravelerProfile,
  UserPreferences
} from "../types";
import { createRouteOptions } from "../utils/smartRouting";
import { getRoutePreferenceForProfile } from "./travelerProfiles";

function getCrowdLabel(score: number): RouteRecommendation["crowdLevel"] {
  if (score >= 72) return "high";
  if (score >= 42) return "medium";
  return "low";
}

function getNoiseLabel(score: number): RouteRecommendation["noiseLevel"] {
  if (score >= 72) return "high";
  if (score >= 42) return "medium";
  return "low";
}

function getAccessibilityNotes(profile: TravelerProfile, destination: AirportLocation): string[] {
  const notes = [];
  if (profile.preferences.accessibleOnly || destination.accessibilityFeatures.includes("wheelchair-accessible")) {
    notes.push("Step-free path prioritized for this traveler profile.");
  }
  if (profile.preferences.lowStimulus || profile.preferences.preferQuietRoutes) {
    notes.push("Lower-noise corridors and quiet support points are preferred.");
  }
  if (profile.preferences.restroomPriority) {
    notes.push("Nearby restroom access is weighted for family travel.");
  }

  return notes.length > 0 ? notes : ["Standard terminal route with accessibility metadata available."];
}

export function getRouteRecommendation(input: {
  profile: TravelerProfile;
  currentLocation: AirportLocation;
  destination: AirportLocation;
  airport: AirportConfig;
  conditions: AirportCondition[];
  intelligence: AirportIntelligence;
  preferences: UserPreferences;
}): RouteRecommendation {
  const preferred = getRoutePreferenceForProfile(input.profile, input.preferences);
  const routeOptions = createRouteOptions(
    input.airport.locations,
    input.currentLocation,
    input.destination,
    input.profile.id,
    input.conditions
  );
  const recommendedRoute = routeOptions.find((route) => route.preference === preferred) ?? routeOptions[0];
  const alternativeRoute = routeOptions.find((route) => route.id !== recommendedRoute.id) ?? routeOptions[1] ?? recommendedRoute;
  const speedAdjustment = input.preferences.preferredWalkingSpeed === "slow" ? 2 : input.preferences.preferredWalkingSpeed === "fast" ? -1 : 0;
  const estimatedTime = Math.max(1, recommendedRoute.estimatedWalkMinutes + speedAdjustment + Math.round(input.intelligence.securityWaitTime / 20));

  return {
    recommendedRoute,
    alternativeRoute,
    estimatedTimeMinutes: estimatedTime,
    accessibilityNotes: getAccessibilityNotes(input.profile, input.destination),
    crowdLevel: getCrowdLabel(input.intelligence.crowdLevel),
    noiseLevel: getNoiseLabel(input.intelligence.noiseLevel),
    reason: recommendedRoute.label + " best matches " + input.profile.label + " preferences."
  };
}

export const RouteRecommendationEngine = {
  getRecommendation: getRouteRecommendation
};
