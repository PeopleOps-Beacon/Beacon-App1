import { describe, expect, it } from "vitest";
import { airports } from "../data/airports";
import { BeaconAI } from "./BeaconAI";
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

describe("BeaconAI", () => {
  it("creates route suggestions that include recommendation metadata", () => {
    const airport = airports[0];
    const currentLocation = airport.locations[0];
    const destination = airport.locations.find((location) => location.category === "gate") ?? airport.locations[1];
    const profile = getTravelerProfile("sensory", preferences);
    const intelligence = BeaconAI.createAirportIntelligence(airport, { crowding: 60, noise: 75, waitTime: 18, support: 70 }, []);

    const recommendation = BeaconAI.getSuggestedRoute({
      airport,
      conditions: [],
      currentLocation,
      destination,
      intelligence,
      preferences,
      profile
    });

    expect(recommendation.recommendedRoute).toBeDefined();
    expect(recommendation.estimatedTimeMinutes).toBeGreaterThan(0);
    expect(recommendation.noiseLevel).toBe("high");
    expect(recommendation.accessibilityNotes.length).toBeGreaterThan(0);
  });

  it("returns reusable recommendation cards for the dashboard", () => {
    const airport = airports[0];
    const cards = BeaconAI.createRecommendationCards(airport, getTravelerProfile("family", preferences));

    expect(cards.length).toBeGreaterThanOrEqual(5);
    expect(cards.some((card) => card.type === "restroom")).toBe(true);
    expect(cards.every((card) => card.walkingTimeMinutes > 0)).toBe(true);
  });

  it("raises stress score when crowd and noise preferences are active", () => {
    const airport = airports[0];
    const profile = getTravelerProfile("veteran", { ...preferences, avoidCrowds: true, avoidNoise: true });
    const intelligence = BeaconAI.createAirportIntelligence(airport, { crowding: 90, noise: 90, waitTime: 30, support: 65 }, []);

    expect(BeaconAI.calculateStressScore({ intelligence, preferences, profile })).toBeGreaterThan(80);
  });
});
