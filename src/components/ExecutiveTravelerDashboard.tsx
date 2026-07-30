import { CloudSun, Clock, HeartHandshake, Plane, Sparkles, Star, UserCheck, Zap } from "lucide-react";
import type { AIRecommendationCard, AirportConfig, AirportLocation, AirportIntelligence, RouteRecommendation, TravelerMode } from "../types";

export function ExecutiveTravelerDashboard({
  airport,
  airportIntelligence,
  favorites,
  mode,
  recents,
  recommendationCards,
  routeRecommendation,
  selectedDestination
}: {
  airport: AirportConfig;
  airportIntelligence: AirportIntelligence;
  favorites: AirportLocation[];
  mode: TravelerMode;
  recents: AirportLocation[];
  recommendationCards: AIRecommendationCard[];
  routeRecommendation: RouteRecommendation | null;
  selectedDestination: AirportLocation | null;
}) {
  const primaryRecommendation = recommendationCards[0];

  return (
    <section className="executive-traveler-dashboard" aria-labelledby="executive-traveler-title">
      <div className="panel-heading">
        <Sparkles aria-hidden="true" />
        <div>
          <p className="eyebrow">Executive Dashboard</p>
          <h2 id="executive-traveler-title">Good afternoon, {mode.label} traveler at {airport.iata}</h2>
        </div>
      </div>
      <div className="executive-dashboard-grid">
        <span><Plane aria-hidden="true" /><strong>{selectedDestination?.name ?? "Choose a destination"}</strong>Upcoming destination</span>
        <span><CloudSun aria-hidden="true" /><strong>{airportIntelligence.weatherAlerts[0] ?? "Clear demo weather"}</strong>Weather widget</span>
        <span><Clock aria-hidden="true" /><strong>{routeRecommendation ? routeRecommendation.estimatedTimeMinutes + " min" : airportIntelligence.securityWaitTime + " min TSA"}</strong>Walking time</span>
        <span><UserCheck aria-hidden="true" /><strong>{airportIntelligence.severity}</strong>Airport status</span>
        <span><HeartHandshake aria-hidden="true" /><strong>{mode.routeIntent}</strong>Accessibility summary</span>
        <span><Zap aria-hidden="true" /><strong>{primaryRecommendation?.name ?? "AI ready"}</strong>AI recommendation</span>
        <span><Star aria-hidden="true" /><strong>{favorites.length}</strong>Favorite destinations</span>
        <span><Clock aria-hidden="true" /><strong>{recents.length}</strong>Recent destinations</span>
      </div>
    </section>
  );
}
