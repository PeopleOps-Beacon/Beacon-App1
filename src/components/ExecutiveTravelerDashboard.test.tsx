import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { airports } from "../data/airports";
import { travelerModes } from "../data/travelerModes";
import { BeaconAI } from "../services/BeaconAI";
import { getTravelerProfile } from "../services/travelerProfiles";
import { ExecutiveTravelerDashboard } from "./ExecutiveTravelerDashboard";

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

describe("ExecutiveTravelerDashboard", () => {
  it("renders executive traveler KPIs", () => {
    const airport = airports[0];
    const profile = getTravelerProfile("veteran", preferences);
    const intelligence = BeaconAI.createAirportIntelligence(airport, { crowding: 54, noise: 42, waitTime: 18, support: 72 }, []);

    render(
      <ExecutiveTravelerDashboard
        airport={airport}
        airportIntelligence={intelligence}
        favorites={[]}
        mode={travelerModes[0]}
        recents={[]}
        recommendationCards={BeaconAI.createRecommendationCards(airport, profile)}
        routeRecommendation={null}
        selectedDestination={null}
      />
    );

    expect(screen.getByRole("heading", { name: /good afternoon/i })).toBeInTheDocument();
    expect(screen.getByText(/Favorite destinations/i)).toBeInTheDocument();
    expect(screen.getByText(/Weather widget/i)).toBeInTheDocument();
  });
});
