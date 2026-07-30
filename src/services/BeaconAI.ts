import type {
  AIRecommendationCard,
  AirportConfig,
  AirportCondition,
  AirportIntelligence,
  AirportLocation,
  RouteRecommendation,
  TravelerProfile,
  UserPreferences
} from "../types";
import { createAirportIntelligence } from "./airportIntelligence";
import { RouteRecommendationEngine } from "./RouteRecommendationEngine";

function byCategory(locations: AirportLocation[], category: AirportLocation["category"]): AirportLocation | undefined {
  return locations.find((location) => location.category === category);
}

function byFeature(locations: AirportLocation[], feature: AirportLocation["accessibilityFeatures"][number]): AirportLocation | undefined {
  return locations.find((location) => location.accessibilityFeatures.includes(feature));
}

function createCard(location: AirportLocation, description: string, slot: string): AIRecommendationCard {
  return {
    id: "ai-" + slot + "-" + location.id,
    locationId: location.id,
    name: location.name,
    type: location.category,
    distanceFeet: Math.max(120, Math.round((location.x + location.y) * 4)),
    walkingTimeMinutes: Math.max(1, Math.round((location.x + location.y) / 35)),
    accessibility: location.accessibilityFeatures.join(", ") || "Standard access",
    description
  };
}

export const BeaconAI = {
  getSuggestedRoute(input: {
    profile: TravelerProfile;
    currentLocation: AirportLocation;
    destination: AirportLocation;
    airport: AirportConfig;
    conditions: AirportCondition[];
    intelligence: AirportIntelligence;
    preferences: UserPreferences;
  }): RouteRecommendation {
    return RouteRecommendationEngine.getRecommendation(input);
  },

  recommendDestination(airport: AirportConfig, profile: TravelerProfile): AIRecommendationCard {
    const location =
      profile.preferences.lowStimulus || profile.preferences.preferQuietRoutes
        ? byFeature(airport.locations, "quiet") ?? airport.locations[0]
        : profile.preferences.foodPriority || profile.preferences.coffeeStops
          ? byCategory(airport.locations, "dining") ?? airport.locations[0]
          : byCategory(airport.locations, "gate") ?? airport.locations[0];

    return createCard(location, "Recommended for " + profile.label + " based on current traveler preferences.", "destination");
  },

  recommendBreak(airport: AirportConfig, profile: TravelerProfile): AIRecommendationCard {
    const location =
      byFeature(airport.locations, "quiet") ??
      byCategory(airport.locations, profile.preferences.foodPriority ? "dining" : "care") ??
      airport.locations[0];

    return createCard(location, "Suggested recovery stop before continuing through the terminal.", "break");
  },

  recommendQuietArea(airport: AirportConfig): AIRecommendationCard {
    const location = byFeature(airport.locations, "quiet") ?? byCategory(airport.locations, "care") ?? airport.locations[0];
    return createCard(location, "Lower-stimulation waiting area near accessible routes.", "quiet");
  },

  recommendDining(airport: AirportConfig): AIRecommendationCard {
    const location = byCategory(airport.locations, "dining") ?? airport.locations[0];
    return createCard(location, "Dining option selected using current wait and proximity signals.", "dining");
  },

  recommendRestroom(airport: AirportConfig): AIRecommendationCard {
    const location = byCategory(airport.locations, "restroom") ?? airport.locations[0];
    return createCard(location, "Nearest high-confidence restroom recommendation.", "restroom");
  },

  recommendExit(airport: AirportConfig): AIRecommendationCard {
    const location = byCategory(airport.locations, "transportation") ?? byCategory(airport.locations, "parking") ?? airport.locations[0];
    return createCard(location, "Exit path recommendation based on terminal position and support needs.", "exit");
  },

  analyzeCongestion(intelligence: AirportIntelligence): string {
    return intelligence.crowdLevel >= 72
      ? "Heavy crowding in primary corridors."
      : intelligence.crowdLevel >= 42
        ? "Moderate crowding with quiet alternates available."
        : "Low crowding across mapped areas.";
  },

  estimateTravelTime(route: RouteRecommendation): number {
    return route.estimatedTimeMinutes;
  },

  calculateStressScore(input: { profile: TravelerProfile; intelligence: AirportIntelligence; preferences: UserPreferences }): number {
    const crowdStress = input.profile.preferences.avoidCrowds || input.preferences.avoidCrowds ? input.intelligence.crowdLevel * 0.45 : input.intelligence.crowdLevel * 0.25;
    const noiseStress = input.profile.preferences.avoidNoise || input.preferences.avoidNoise ? input.intelligence.noiseLevel * 0.45 : input.intelligence.noiseLevel * 0.2;
    const waitStress = input.intelligence.securityWaitTime * 0.7;

    return Math.min(100, Math.round(crowdStress + noiseStress + waitStress));
  },

  createRecommendationCards(airport: AirportConfig, profile: TravelerProfile): AIRecommendationCard[] {
    return [
      this.recommendDestination(airport, profile),
      this.recommendQuietArea(airport),
      this.recommendDining(airport),
      this.recommendRestroom(airport),
      this.recommendBreak(airport, profile),
      this.recommendExit(airport)
    ];
  },

  createAirportIntelligence
};
