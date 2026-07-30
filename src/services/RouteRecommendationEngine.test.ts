import { describe, expect, it } from "vitest";
import { airports } from "../data/airports";
import { createAirportIntelligence } from "./airportIntelligence";
import { getRouteRecommendation } from "./RouteRecommendationEngine";
import { getTravelerProfile } from "./travelerProfiles";

const preferences = {
  reducedMotion: false,
  highContrast: true,
  largeText: false,
  theme: "dark" as const,
  preferredWalkingSpeed: "standard" as const,
  preferredRouteType: "fastest" as const,
  favoriteCategories: [],
  defaultAirportId: "gsp",
  accessibilityNeeds: [],
  sensorySensitivity: "medium" as const,
  preferredLanguage: "en" as const,
  notificationsEnabled: true,
  aiRecommendationsEnabled: true,
  smartNotificationsEnabled: true,
  reduceWalkingDistance: false,
  preferAccessibleRoutes: false,
  avoidCrowds: false,
  avoidNoise: false,
  voiceGuidanceEnabled: true,
  voiceVolume: 0.8,
  voiceRate: 1
};

describe("RouteRecommendationEngine", () => {
  it("uses traveler profile preferences to choose a recommended route", () => {
    const airport = airports[0];
    const currentLocation = airport.locations[0];
    const destination = airport.locations.find((location) => location.category === "gate") ?? airport.locations[1];
    const profile = getTravelerProfile("accessibility", preferences);
    const intelligence = createAirportIntelligence(airport, { crowding: 50, noise: 40, waitTime: 14, support: 80 }, []);

    const recommendation = getRouteRecommendation({
      airport,
      conditions: [],
      currentLocation,
      destination,
      intelligence,
      preferences,
      profile
    });

    expect(recommendation.recommendedRoute.preference).toBe("accessible");
    expect(recommendation.alternativeRoute).toBeDefined();
    expect(recommendation.crowdLevel).toBe("medium");
  });
});
