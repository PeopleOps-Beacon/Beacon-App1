import { describe, expect, it } from "vitest";
import { getRoutePreferenceForProfile, getTravelerProfile } from "./travelerProfiles";

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

describe("traveler profiles", () => {
  it("loads veteran PTSD preferences", () => {
    const profile = getTravelerProfile("veteran", preferences);

    expect(profile.label).toBe("Veteran PTSD");
    expect(profile.preferences.avoidCrowds).toBe(true);
    expect(profile.preferences.frequentBreaks).toBe(true);
  });

  it("maps wheelchair and sensory profiles to route preferences", () => {
    expect(getRoutePreferenceForProfile(getTravelerProfile("accessibility", preferences), preferences)).toBe("accessible");
    expect(getRoutePreferenceForProfile(getTravelerProfile("sensory", preferences), preferences)).toBe("quietest");
  });

  it("lets user preferences override route recommendation inputs", () => {
    const crowdAwareProfile = getTravelerProfile("business", { ...preferences, avoidCrowds: true });

    expect(getRoutePreferenceForProfile(crowdAwareProfile, { ...preferences, avoidCrowds: true })).toBe("quietest");


    const businessProfile = getTravelerProfile("business", { ...preferences, reduceWalkingDistance: true });

    expect(getRoutePreferenceForProfile(businessProfile, { ...preferences, reduceWalkingDistance: true })).toBe("least-walking");
  });
});
